import React, { useState, useEffect } from 'react';
import { Article } from '@/types/types';
import { uploadImage, validateImageFile } from '@/lib/supabase/storage';
import { Input } from '@/components/ui/input';
import { InputField } from '@/components/ui/input-field';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { useAuth } from '@/contexts/AuthContext';
import { TiptapEditor } from '@/components/ui/tiptap-editor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ArticleFormProps {
    onClose: () => void;
    onSubmit: (article: Omit<Article, 'id' | 'slug'>) => Promise<void> | void;
    onUpdate: (article: Omit<Article, 'slug'>) => Promise<void> | void;
    itemToEdit: Article | null;
    itemType: 'News Update' | 'Publication' | 'Video';
    categories?: string[];
    onAddCategory?: (category: string) => void;
    publicationCategories?: string[];
    onAddPublicationCategory?: (category: string) => void;
    isModal?: boolean; // If false, renders as inline form without overlay
    userRole?: 'contributor' | 'admin' | 'super-admin';
}

const FormField: React.FC<{ label: string; children: React.ReactNode; required?: boolean }> = ({ label, children, required }) => (
    <div className="mb-2 space-y-2">
        <Label className="text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {children}
    </div>
);

const emptyFormState = {
    title: '',
    description: '',
    category: '',
    publicationCategory: '',
    publisher: '',
    imageUrl: '',
    tagColor: 'bg-yellow-400',
    tags: [] as string[],
    publishDate: '',
    videoUrl: '',
    publicationLink: '',
    imageFile: null as File | null,
};

const ArticleForm: React.FC<ArticleFormProps> = ({ onClose, onSubmit, onUpdate, itemToEdit, itemType, categories, onAddCategory, publicationCategories, onAddPublicationCategory, isModal = true, userRole = 'contributor' }) => {
    console.log('🎨 [ArticleForm] Component mounted/updated:', { itemType, isModal, userRole, hasItemToEdit: !!itemToEdit });
    
    const { user } = useAuth();
    const isEditMode = Boolean(itemToEdit);
    const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    const [formData, setFormData] = useState({ ...emptyFormState, publishDate: today });
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [saveAsDraft, setSaveAsDraft] = useState(false); // New state for draft override
    
    // State for managing news categories (like ProjectForm)
    const [newsCategories, setNewsCategories] = useState<string[]>(categories || ['Breaking News', 'Politics', 'Environment', 'N/A']);
    const [showManageNewsCategories, setShowManageNewsCategories] = useState(false);

    // State for tag management
    const [newTag, setNewTag] = useState('');
    const [showAddTag, setShowAddTag] = useState(false);
    const [isFetchingPublicationImage, setIsFetchingPublicationImage] = useState(false);
    const [showAddPublicationCategory, setShowAddPublicationCategory] = useState(false);
    const [newPublicationCategory, setNewPublicationCategory] = useState('');

    const publicationTypeOptions = Array.from(new Set([...(categories || []), formData.category].filter(Boolean as any)));
    const publicationCategoryOptions = Array.from(new Set([...(publicationCategories || []), formData.publicationCategory].filter(Boolean as any)));

    // Update newsCategories when categories prop changes
    useEffect(() => {
        if (categories && categories.length > 0) {
            setNewsCategories(categories);
        }
    }, [categories]);

    useEffect(() => {
        if (isEditMode && itemToEdit) {
            const editItem = itemToEdit as any;
            const resolvedCategory = itemToEdit.category || editItem.publicationType || editItem.publication_type || '';
            const resolvedPublicationCategory = itemToEdit.publicationCategory || editItem.publication_category || '';
            const resolvedPublisher = itemToEdit.publisher || editItem.publication_publisher || '';
            const resolvedPublicationLink = itemToEdit.documentUrls?.[0] || editItem.publicationLink || editItem.publication_link || '';

            console.log('🔄 [ArticleForm useEffect] Loading item to edit:', {
                id: itemToEdit.id,
                title: itemToEdit.title,
                category: resolvedCategory,
                publicationCategory: resolvedPublicationCategory,
                imageUrl: itemToEdit.imageUrl,
                description: itemToEdit.description?.substring(0, 100),
                tagColor: itemToEdit.tagColor,
                tags: itemToEdit.tags,
                allKeys: Object.keys(itemToEdit)
            });
            setFormData({
                title: itemToEdit.title,
                description: itemToEdit.description || '',
                category: resolvedCategory,
                publicationCategory: resolvedPublicationCategory,
                publisher: resolvedPublisher,
                imageUrl: itemToEdit.imageUrl,
                tagColor: itemToEdit.tagColor,
                tags: itemToEdit.tags || [],
                publishDate: itemToEdit.publishDate || '',
                videoUrl: itemToEdit.videoUrl || '',
                publicationLink: resolvedPublicationLink,
                imageFile: null,
            });
            console.log('✅ [ArticleForm useEffect] Form data set:', {
                category: resolvedCategory,
                publicationCategory: resolvedPublicationCategory,
                publicationLink: resolvedPublicationLink
            });
        } else {
            setFormData({ ...emptyFormState, publishDate: today });
        }
    }, [itemToEdit, isEditMode]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Auto-fetch video thumbnail when video URL changes
        if (name === 'videoUrl' && value && itemType === 'Video') {
            fetchVideoThumbnail(value);
        }
    };

    // Helper for Select components (value-only callback)
    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const fetchVideoThumbnail = (url: string) => {
        try {
            let thumbnailUrl = '';
            
            // YouTube
            if (url.includes('youtube.com') || url.includes('youtu.be')) {
                const videoId = url.includes('youtu.be') 
                    ? url.split('youtu.be/')[1]?.split('?')[0]
                    : new URL(url).searchParams.get('v');
                    
                if (videoId) {
                    thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                    setFormData(prev => ({ ...prev, imageUrl: thumbnailUrl }));
                    console.log('✅ YouTube thumbnail fetched:', thumbnailUrl);
                }
            }
            // Vimeo
            else if (url.includes('vimeo.com')) {
                const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
                if (videoId) {
                    // Vimeo requires API call, use placeholder for now
                    fetch(`https://vimeo.com/api/v2/video/${videoId}.json`)
                        .then(res => res.json())
                        .then(data => {
                            if (data && data[0] && data[0].thumbnail_large) {
                                setFormData(prev => ({ ...prev, imageUrl: data[0].thumbnail_large }));
                                console.log('✅ Vimeo thumbnail fetched:', data[0].thumbnail_large);
                            }
                        })
                        .catch(err => console.warn('Could not fetch Vimeo thumbnail:', err));
                }
            }
            // Facebook - use a placeholder as thumbnails require authentication
            else if (url.includes('facebook.com')) {
                console.log('ℹ️ Facebook videos require manual thumbnail upload');
            }
        } catch (error) {
            console.warn('Error fetching video thumbnail:', error);
        }
    };

    const handlePublicationLinkBlur = async () => {
        if (itemType !== 'Publication') return;

        const link = formData.publicationLink.trim();
        if (!link) return;

        // Respect manually uploaded or existing non-fallback images.
        if (formData.imageFile) return;
        if (formData.imageUrl && formData.imageUrl !== '/gaia-logo.jpg') return;

        try {
            setIsFetchingPublicationImage(true);
            const response = await fetch(`/api/link-preview-image?url=${encodeURIComponent(link)}`);
            if (!response.ok) return;

            const payload = await response.json();
            if (payload?.imageUrl) {
                setFormData(prev => ({ ...prev, imageUrl: payload.imageUrl }));
            }
        } catch (error) {
            console.warn('Could not auto-fetch publication preview image:', error);
        } finally {
            setIsFetchingPublicationImage(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    imageFile: file,
                    imageUrl: reader.result as string,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddCategory = () => {
        if (newCategory.trim() && onAddCategory) {
            onAddCategory(newCategory.trim());
            setFormData(prev => ({ ...prev, category: newCategory.trim() }));
            setNewCategory('');
            setShowAddCategory(false);
        }
    };

    const handleAddPublicationCategory = () => {
        if (newPublicationCategory.trim() && onAddPublicationCategory) {
            onAddPublicationCategory(newPublicationCategory.trim());
            setFormData(prev => ({ ...prev, publicationCategory: newPublicationCategory.trim() }));
            setNewPublicationCategory('');
            setShowAddPublicationCategory(false);
        }
    };

    const handleAddNewsCategory = () => {
        if (newCategory.trim()) {
            const trimmedCategory = newCategory.trim();
            if (!newsCategories.includes(trimmedCategory)) {
                setNewsCategories(prev => [...prev, trimmedCategory]);
                setFormData(prev => ({ ...prev, category: trimmedCategory }));
            }
            setNewCategory('');
            setShowAddCategory(false);
        }
    };

    const handleDeleteNewsCategory = (categoryToDelete: string) => {
        if (window.confirm(`Are you sure you want to delete the category "${categoryToDelete}"?`)) {
            setNewsCategories(prev => prev.filter(cat => cat !== categoryToDelete));
            // If the deleted category was selected, clear it
            if (formData.category === categoryToDelete) {
                setFormData(prev => ({ ...prev, category: '' }));
            }
        }
    };

    const handleAddTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag('');
            setShowAddTag(false);
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        console.log('🚀 [handleSubmit] START - Form submission triggered!', { itemType, isEditMode, userRole });
        e.preventDefault();
        console.log('✋ [handleSubmit] preventDefault() called');
        console.log('📊 [handleSubmit] Current formData state:', {
            title: formData.title,
            category: formData.category,
            categoryLength: formData.category?.length,
            categoryType: typeof formData.category,
            hasImage: !!formData.imageUrl || !!formData.imageFile,
            videoUrl: formData.videoUrl,
            tags: formData.tags,
            tagColor: formData.tagColor,
            publishDate: formData.publishDate,
            description: formData.description?.substring(0, 50) + '...',
            allKeys: Object.keys(formData)
        });

        if (itemType === 'Publication') {
            if (!formData.category?.trim()) {
                alert('❌ Publication Type is required.');
                return;
            }
            if (!formData.publicationCategory?.trim()) {
                alert('❌ Publication Category is required.');
                return;
            }
        }
        
        try {
            let uploadedImageUrl = formData.imageUrl;

            // Upload image if a new file was selected
            if (formData.imageFile) {
                console.log('Uploading image...');
                console.log('Image file details:', {
                    name: formData.imageFile.name,
                    type: formData.imageFile.type,
                    size: formData.imageFile.size
                });
                const validation = validateImageFile(formData.imageFile);
                console.log('Image validation result:', validation);
                if (!validation.valid) {
                    alert(`Image validation failed: ${validation.error}`);
                    return;
                }
                try {
                    console.log('Calling uploadImage...');
                    uploadedImageUrl = await uploadImage(formData.imageFile);
                    console.log('✅ Image uploaded successfully:', uploadedImageUrl);
                } catch (uploadError) {
                    console.error('❌ Image upload FAILED:', uploadError);
                    alert(`Image upload failed: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`);
                    return;
                }
            } else if (itemType === 'Video' && !uploadedImageUrl) {
                // For videos without uploaded image, ensure we have thumbnail URL
                console.log('ℹ️ No custom image uploaded for video, using video thumbnail');
            }

            // Ensure a stable fallback image when no featured image is provided.
            if (!uploadedImageUrl) {
                uploadedImageUrl = '/gaia-logo.jpg';
            }

            const articleData: any = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                imageUrl: uploadedImageUrl,
                tagColor: formData.tagColor,
                tags: formData.tags,
                publishDate: formData.publishDate,
                videoUrl: formData.videoUrl || undefined,
                // Override logic: use draft if checkbox is checked, otherwise use role-based logic
                status: (saveAsDraft || (userRole !== 'admin' && userRole !== 'super-admin')) ? 'draft' as const : 'published' as const,
                submittedBy: user?.email || 'unknown',
                submittedAt: new Date().toISOString(),
            };

            console.log('📦 [handleSubmit] articleData built:', {
                title: articleData.title,
                category: articleData.category,
                categoryExists: articleData.category !== undefined && articleData.category !== null && articleData.category !== '',
                categoryValue: `"${articleData.category}"`,
                description: articleData.description?.substring(0, 50),
                imageUrl: articleData.imageUrl,
                tagColor: articleData.tagColor,
                tags: articleData.tags,
                publishDate: articleData.publishDate,
                status: articleData.status,
                allKeys: Object.keys(articleData)
            });

            console.log('🔍 ArticleForm Debug:', {
                user: user,
                userRole: userRole,
                userEmail: user?.email,
                saveAsDraft: saveAsDraft,
                finalStatus: articleData.status,
                submittedBy: articleData.submittedBy,
                submittedAt: articleData.submittedAt
            });

            // Only add document fields for Publications
            if (itemType === 'Publication') {
                articleData.publisher = formData.publisher.trim() || undefined;
                articleData.publicationCategory = formData.publicationCategory || undefined;
                articleData.documentNames = formData.publicationLink ? ['Publication Link'] : [];
                articleData.documentUrls = formData.publicationLink ? [formData.publicationLink] : [];
            }

            console.log('Article data to save:', articleData);

            if (isEditMode && itemToEdit) {
                console.log('📤 [ArticleForm] Calling onUpdate with:', {
                    id: itemToEdit.id,
                    title: articleData.title,
                    category: articleData.category,
                    imageUrl: articleData.imageUrl,
                    description: articleData.description?.substring(0, 100),
                    tagColor: articleData.tagColor,
                    tags: articleData.tags,
                    allKeys: Object.keys({ ...articleData, id: itemToEdit.id })
                });
                await onUpdate({ ...articleData, id: itemToEdit.id });
            } else {
                console.log('📤 [ArticleForm] Calling onSubmit with:', {
                    title: articleData.title,
                    category: articleData.category,
                    categoryValue: `"${articleData.category}"`,
                    imageUrl: articleData.imageUrl,
                    description: articleData.description?.substring(0, 100),
                    tagColor: articleData.tagColor,
                    tags: articleData.tags,
                    allKeys: Object.keys(articleData)
                });
                await onSubmit(articleData);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };
    
    const inputClass = "w-full p-3 border border-gray-300 rounded-md focus:ring-brand-medium-blue focus:border-brand-medium-blue";

    const formContent = (
        <>
            {isModal && (
                <div className="p-4 sm:p-6 md:p-8 border-b flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl sm:text-2xl font-bold text-brand-dark-blue">{isEditMode ? 'Edit' : 'Add New'} {itemType}</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
                    </div>
                </div>
            )}
            <form onSubmit={handleSubmit} onClick={() => console.log('📋 Form clicked')} className="flex flex-col flex-1 overflow-hidden">
                <div className={isModal ? "p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 overflow-y-auto flex-1" : "p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6"}>
                    <FormField label="Title" required>
                        <Input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
                    </FormField>
                    <FormField label="Description" required>
                        <div className="mb-24">
                            <TiptapEditor
                                value={formData.description}
                                onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                                height="200px"
                                placeholder="Enter content..."
                            />
                        </div>
                    </FormField>
                    {itemType === 'Publication' ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField label="Publication Type" required>
                                    <Select
                                        value={formData.category || ''}
                                        onValueChange={(value) => handleSelectChange('category', value)}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Publication Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {publicationTypeOptions.filter(c => c !== '').map(cat => (
                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {onAddCategory && (
                                        <>
                                            {!showAddCategory ? (
                                                <button
                                                    type="button"
                                                    onClick={() => setShowAddCategory(true)}
                                                    className="mt-2 text-sm text-brand-medium-blue hover:underline"
                                                >
                                                    + Add New Publication Type
                                                </button>
                                            ) : (
                                                <div className="mt-2 flex items-center space-x-2">
                                                    <Input
                                                        type="text"
                                                        value={newCategory}
                                                        onChange={(e) => setNewCategory(e.target.value)}
                                                        placeholder="Enter new publication type"
                                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleAddCategory}
                                                        className="text-white px-4 py-2 rounded-md transition-colors"
                                                        style={{ backgroundColor: '#0d234f' }}
                                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#081629'}
                                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0d234f'}
                                                    >
                                                        Add
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setShowAddCategory(false); setNewCategory(''); }}
                                                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </FormField>
                                <FormField label="Publication Category" required>
                                    <Select
                                        value={formData.publicationCategory || ''}
                                        onValueChange={(value) => handleSelectChange('publicationCategory', value)}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Publication Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {publicationCategoryOptions.filter(c => c !== '').map(cat => (
                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {onAddPublicationCategory && (
                                        <>
                                            {!showAddPublicationCategory ? (
                                                <button
                                                    type="button"
                                                    onClick={() => setShowAddPublicationCategory(true)}
                                                    className="mt-2 text-sm text-brand-medium-blue hover:underline"
                                                >
                                                    + Add New Publication Category
                                                </button>
                                            ) : (
                                                <div className="mt-2 flex items-center space-x-2">
                                                    <Input
                                                        type="text"
                                                        value={newPublicationCategory}
                                                        onChange={(e) => setNewPublicationCategory(e.target.value)}
                                                        placeholder="Enter new publication category"
                                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPublicationCategory())}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleAddPublicationCategory}
                                                        className="text-white px-4 py-2 rounded-md transition-colors"
                                                        style={{ backgroundColor: '#0d234f' }}
                                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#081629'}
                                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0d234f'}
                                                    >
                                                        Add
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setShowAddPublicationCategory(false); setNewPublicationCategory(''); }}
                                                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </FormField>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField label="Publisher">
                                    <Input
                                        type="text"
                                        name="publisher"
                                        value={formData.publisher}
                                        onChange={handleInputChange}
                                        placeholder="Enter publisher"
                                    />
                                </FormField>
                                <FormField label="Publication Link">
                                    <Input
                                        type="url"
                                        name="publicationLink"
                                        value={formData.publicationLink}
                                        onChange={handleInputChange}
                                        onBlur={handlePublicationLinkBlur}
                                        placeholder="https://example.com/publication"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Paste the publication URL. We will try to auto-capture a featured image from the link.
                                    </p>
                                    {isFetchingPublicationImage && (
                                        <p className="mt-1 text-xs text-gray-500">Fetching preview image from link...</p>
                                    )}
                                </FormField>
                            </div>
                        </>
                    ) : (
                        <FormField label={itemType === 'Video' ? 'Video Category' : 'Category'} required>
                            {itemType === 'Video' ? (
                                <>
                                    <Select
                                        value={formData.category || ''}
                                        onValueChange={(value) => handleSelectChange('category', value)}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Video Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories && categories.filter(c => c !== '').map(cat => (
                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {onAddCategory && (
                                        <>
                                            {!showAddCategory ? (
                                                <button
                                                    type="button"
                                                    onClick={() => setShowAddCategory(true)}
                                                    className="mt-2 text-sm text-brand-medium-blue hover:underline"
                                                >
                                                    + Add New Video Category
                                                </button>
                                            ) : (
                                                <div className="mt-2 flex items-center space-x-2">
                                                    <Input
                                                        type="text"
                                                        value={newCategory}
                                                        onChange={(e) => setNewCategory(e.target.value)}
                                                        placeholder="Enter new video category"
                                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleAddCategory}
                                                        className="text-white px-4 py-2 rounded-md transition-colors"
                                                        style={{ backgroundColor: '#0d234f' }}
                                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#081629'}
                                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0d234f'}
                                                    >
                                                        Add
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setShowAddCategory(false); setNewCategory(''); }}
                                                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Select
                                        value={formData.category || ''}
                                        onValueChange={(value) => handleSelectChange('category', value)}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {newsCategories.filter(c => c !== '').map(cat => (
                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {showAddCategory ? (
                                        <div className="mt-2 flex items-center space-x-2">
                                            <Input
                                                type="text"
                                                value={newCategory}
                                                onChange={(e) => setNewCategory(e.target.value)}
                                                placeholder="Enter new category"
                                                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-brand-medium-blue focus:border-brand-medium-blue text-sm"
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNewsCategory())}
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddNewsCategory}
                                                className="p-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200 text-sm"
                                            >
                                                Add
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { setShowAddCategory(false); setNewCategory(''); }}
                                                className="p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 text-sm"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="mt-2 flex items-center gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setShowAddCategory(true)}
                                                className="text-sm text-brand-medium-blue hover:underline"
                                            >
                                                + Add more category
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowManageNewsCategories(!showManageNewsCategories)}
                                                className="text-sm text-brand-medium-blue hover:underline"
                                            >
                                                - Manage Categories
                                            </button>
                                        </div>
                                    )}
                                    {showManageNewsCategories && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {newsCategories.map(cat => (
                                                <div key={cat} className="inline-flex items-center bg-gray-100 rounded-md px-2 py-1 text-sm">
                                                    <span className="text-gray-700">{cat}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteNewsCategory(cat)}
                                                        className="ml-2 text-red-500 hover:text-red-700 font-bold"
                                                        title="Delete category"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </FormField>
                    )}
                    {itemType === 'Video' && (
                        <FormField label="Video URL (YouTube, Vimeo, Facebook)" required>
                            <Input 
                                type="url" 
                                name="videoUrl" 
                                value={formData.videoUrl} 
                                onChange={handleInputChange} 
                                placeholder="https://youtube.com/watch?v=..." 
                                required 
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Paste the full URL from YouTube, Vimeo, or Facebook
                            </p>
                        </FormField>
                    )}
                    <FormField label="Featured Image">
                        {itemType === 'Video' && (
                            <p className="mb-2 text-sm text-gray-600">
                                💡 Thumbnail will be automatically fetched from the video URL. You can upload a custom image if needed.
                            </p>
                        )}
                        {itemType !== 'Video' && (
                            <p className="mb-2 text-sm text-gray-600">
                                Optional. If empty, a default fallback image will be used.
                            </p>
                        )}
                        <Input 
                            type="file" 
                            name="imageFile" 
                            onChange={handleImageChange} 
                            accept="image/*" 
                        />
                         {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" className="mt-2 h-32 w-auto rounded object-cover border" />}
                    </FormField>
                    <FormField label="Tags">
                        <div className="space-y-2">
                            {/* Display existing tags */}
                            {formData.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {formData.tags.map((tag, index) => (
                                        <div key={index} className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm">
                                            <span>{tag}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                className="ml-2 text-blue-600 hover:text-blue-900 font-bold"
                                                title="Remove tag"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {/* Add new tag */}
                            {showAddTag ? (
                                <div className="flex items-center space-x-2">
                                    <Input 
                                        type="text" 
                                        value={newTag} 
                                        onChange={(e) => setNewTag(e.target.value)} 
                                        placeholder="Enter tag name"
                                        className="flex-1"
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={handleAddTag} 
                                        className="p-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200 text-sm"
                                    >
                                        Add
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => { setShowAddTag(false); setNewTag(''); }} 
                                        className="p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    type="button" 
                                    onClick={() => setShowAddTag(true)} 
                                    className="text-sm text-brand-medium-blue hover:underline"
                                >
                                    + Add tag
                                </button>
                            )}
                        </div>
                    </FormField>
                </div>
                <div className="p-8 bg-gray-50 border-t rounded-b-lg space-y-4">
                    <div className="flex items-center space-x-3">
                        <Label className="text-sm font-medium text-gray-700">Publish Date:</Label>
                        <DatePicker
                            value={formData.publishDate}
                            onChange={(date) => handleSelectChange('publishDate', date)}
                            placeholder="Select publish date"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4 justify-between items-center">
                        {/* Save as Draft checkbox for admins/super-admins */}
                        {(userRole === 'admin' || userRole === 'super-admin') && !isEditMode && (
                            <label className="flex items-center justify-center sm:justify-start">
                                <input
                                    type="checkbox"
                                    checked={saveAsDraft}
                                    onChange={(e) => setSaveAsDraft(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-brand-medium-blue focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue"
                                />
                                <span className="ml-2 text-sm text-gray-700">Save as Draft (requires approval)</span>
                            </label>
                        )}
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            {!isModal && (
                                <button type="button" onClick={onClose} className="w-full sm:w-auto bg-gray-200 text-gray-800 font-bold py-2 px-4 sm:px-6 rounded-md hover:bg-gray-300 transition-colors">
                                    Back
                                </button>
                            )}
                            {isModal && (
                                <button type="button" onClick={onClose} className="w-full sm:w-auto bg-gray-200 text-gray-800 font-bold py-2 px-4 sm:px-6 rounded-md hover:bg-gray-300 transition-colors">
                                    Cancel
                                </button>
                            )}
                            <button 
                                type="submit" 
                                className="w-full sm:w-auto text-white font-bold py-2 px-4 sm:px-6 rounded-md transition-colors"
                                style={{ backgroundColor: '#0d234f' }}
                                onMouseEnter={(e) => {
                                    console.log('🖱️ Mouse entered submit button');
                                    e.currentTarget.style.backgroundColor = '#081629';
                                }}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0d234f'}
                                onClick={(e) => {
                                    console.log('🔘 Submit button clicked!', {
                                        type: e.currentTarget.type,
                                        disabled: e.currentTarget.disabled,
                                        formValid: e.currentTarget.form?.checkValidity(),
                                        itemType,
                                        isEditMode
                                    });
                                }}
                                onMouseDown={() => console.log('⬇️ Mouse down on submit button')}
                                onMouseUp={() => console.log('⬆️ Mouse up on submit button')}
                            >
                                {isEditMode ? `Update ${itemType}` : `Submit ${itemType}`}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );

    if (isModal) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-2 sm:p-4" onClick={onClose}>
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[95vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                    {formContent}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-xl w-full">
            {formContent}
        </div>
    );
};

export default ArticleForm;