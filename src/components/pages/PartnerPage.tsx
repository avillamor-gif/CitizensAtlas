'use client'

import React, { useState, useEffect } from 'react';
import { User } from '@/types/types';
import { ArrowRightIcon } from '@/components/ui/icons';
import { getPageContent, updatePageContent, PageContent } from '@/lib/services/supabase-service';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface PartnerPageProps {
  currentUser?: User | null;
}

const PartnerPage: React.FC<PartnerPageProps> = ({ currentUser }) => {
    const [contents, setContents] = useState<PageContent[]>([]);
    const [editingContent, setEditingContent] = useState<PageContent | null>(null);
    const [editedText, setEditedText] = useState('');
    const [saving, setSaving] = useState(false);
    
    const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'super-admin';

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        try {
            const data = await getPageContent('partner');
            setContents(data);
        } catch (error) {
            console.error('Error loading page content:', error);
        }
    };

    const handleEdit = (content: PageContent) => {
        setEditingContent(content);
        setEditedText(content.content);
    };

    const handleSave = async () => {
        if (!editingContent) return;
        
        try {
            setSaving(true);
            await updatePageContent(editingContent.id, {
                content: editedText,
            });
            
            setContents(prev => prev.map(c => 
                c.id === editingContent.id ? { ...c, content: editedText } : c
            ));
            setEditingContent(null);
        } catch (error) {
            console.error('Error saving content:', error);
            alert('Failed to save changes. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const getContent = (cardId: string) => contents.find(c => c.card_id === cardId);

    const renderContent = (content: string) => {
        return content.split('\n\n').map((section, i) => {
            if (section.startsWith('•')) {
                return (
                    <ul key={i} className="list-disc list-inside text-gray-600 space-y-2">
                        {section.split('\n').map((item, j) => (
                            <li key={j}>{item.replace('• ', '')}</li>
                        ))}
                    </ul>
                );
            }
            return <p key={i} className="text-gray-600 mb-4">{section}</p>;
        });
    };

    return (
        <div className="bg-white">
            <div className="bg-brand-dark-blue text-white px-4 sm:px-8 text-center min-h-[300px] flex flex-col justify-center items-center">
                <div>
                    <h1 className="text-5xl font-extrabold mb-4">Partner With Us</h1>
                    <p className="text-xl max-w-3xl mx-auto">
                        Help us build the most comprehensive global database on false solutions and community-led resistance.
                    </p>
                </div>
            </div>
            <div className="py-16 px-4 sm:px-8">
                <div className="container mx-auto">
                    <div className="text-center mb-16 relative">
                        {isAdmin && getContent('why-collaborate') && (
                            <button
                                onClick={() => handleEdit(getContent('why-collaborate')!)}
                                className="absolute -top-2 right-4 bg-brand-light-blue text-white p-2 rounded hover:bg-brand-dark-blue transition-colors z-10"
                                title="Edit Content"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                        )}
                        <h2 className="text-3xl font-extrabold text-brand-dark-blue mb-2">Why Collaborate?</h2>
                        <div className="w-16 h-1 bg-brand-dark-blue mx-auto mb-4"></div>
                        {editingContent?.card_id === 'why-collaborate' ? (
                            <div className="space-y-4 max-w-4xl mx-auto">
                                <Textarea
                                    value={editedText}
                                    onChange={(e) => setEditedText(e.target.value)}
                                    rows={5}
                                    className="w-full"
                                />
                                <div className="flex gap-3 justify-center">
                                    <Button onClick={handleSave} disabled={saving}>
                                        {saving ? 'Saving...' : 'Save'}
                                    </Button>
                                    <Button variant="outline" onClick={() => setEditingContent(null)}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
                                {getContent('why-collaborate')?.content}
                            </p>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-10 items-start">
                        <div className="bg-gray-50 p-8 rounded-lg border h-full relative">
                            {isAdmin && getContent('submit-project') && (
                                <button
                                    onClick={() => handleEdit(getContent('submit-project')!)}
                                    className="absolute -top-2 -right-2 bg-brand-light-blue text-white p-2 rounded hover:bg-brand-dark-blue transition-colors z-10"
                                    title="Edit Content"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                            )}
                            <img src="https://picsum.photos/seed/submit-project/800/400" alt="Person adding data to a map on a laptop" className="rounded-lg shadow-md mb-6 w-full h-64 object-cover" />
                            <h3 className="text-2xl font-bold text-brand-dark-blue mb-4">Submit a Project</h3>
                            {editingContent?.card_id === 'submit-project' ? (
                                <div className="space-y-4">
                                    <Textarea
                                        value={editedText}
                                        onChange={(e) => setEditedText(e.target.value)}
                                        rows={10}
                                        className="w-full"
                                    />
                                    <div className="flex gap-3">
                                        <Button onClick={handleSave} disabled={saving}>
                                            {saving ? 'Saving...' : 'Save'}
                                        </Button>
                                        <Button variant="outline" onClick={() => setEditingContent(null)}>
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                getContent('submit-project') && renderContent(getContent('submit-project')!.content)
                            )}
                        </div>
                        <div className="bg-gray-50 p-8 rounded-lg border h-full relative">
                            {isAdmin && getContent('share-story') && (
                                <button
                                    onClick={() => handleEdit(getContent('share-story')!)}
                                    className="absolute -top-2 -right-2 bg-brand-light-blue text-white p-2 rounded hover:bg-brand-dark-blue transition-colors z-10"
                                    title="Edit Content"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                            )}
                            <img src="https://picsum.photos/seed/share-story/800/400" alt="People at a community protest holding signs" className="rounded-lg shadow-md mb-6 w-full h-64 object-cover" />
                            <h3 className="text-2xl font-bold text-brand-dark-blue mb-4">Share Your Story</h3>
                            {editingContent?.card_id === 'share-story' ? (
                                <div className="space-y-4">
                                    <Textarea
                                        value={editedText}
                                        onChange={(e) => setEditedText(e.target.value)}
                                        rows={10}
                                        className="w-full"
                                    />
                                    <div className="flex gap-3">
                                        <Button onClick={handleSave} disabled={saving}>
                                            {saving ? 'Saving...' : 'Save'}
                                        </Button>
                                        <Button variant="outline" onClick={() => setEditingContent(null)}>
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                getContent('share-story') && renderContent(getContent('share-story')!.content)
                            )}
                        </div>
                    </div>

                    <div className="mt-16 text-center bg-brand-section-blue text-white p-12 rounded-lg">
                        <h2 className="text-4xl font-extrabold mb-4">Let's Connect</h2>
                        <p className="text-lg mb-8 max-w-2xl mx-auto">
                            Whether you are a grassroots organization, a researcher, a journalist, or a concerned citizen, we want to hear from you. Reach out to share information, ask questions, or explore partnership opportunities.
                        </p>
                        <a href="mailto:citizensatlas@no-burn.org" className="inline-flex items-center text-lg font-bold bg-brand-yellow text-brand-dark-blue py-4 px-8 rounded-md hover:bg-yellow-300 transition-colors">
                            <span className="w-8 h-8 rounded-full bg-brand-dark-blue flex items-center justify-center mr-3">
                                <ArrowRightIcon className="w-5 h-5 text-white" />
                            </span>
                            citizensatlas@no-burn.org
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnerPage;