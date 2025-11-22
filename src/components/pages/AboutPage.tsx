'use client'

import React, { useState, useEffect } from 'react';
import { User } from '@/types/types';
import { getPageContent, updatePageContent, PageContent } from '@/lib/services/supabase-service';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface AboutPageProps {
  currentUser?: User | null;
}

const PageSection: React.FC<{ 
  title: string; 
  children: React.ReactNode;
  content?: PageContent;
  isAdmin?: boolean;
  onEdit?: (content: PageContent) => void;
}> = ({ title, children, content, isAdmin, onEdit }) => (
    <div className="relative">
        {isAdmin && content && onEdit && (
            <button
                onClick={() => onEdit(content)}
                className="absolute -top-2 -right-2 bg-brand-light-blue text-white p-2 rounded hover:bg-brand-dark-blue transition-colors z-10"
                title="Edit Content"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            </button>
        )}
        <h2 className="text-3xl font-extrabold text-brand-dark-blue mb-2">{title}</h2>
        <div className="w-16 h-1 bg-brand-dark-blue mb-4"></div>
        <div className="text-gray-700 text-lg leading-relaxed space-y-4">
            {children}
        </div>
    </div>
);

const AboutPage: React.FC<AboutPageProps> = ({ currentUser }) => {
    const [contents, setContents] = useState<PageContent[]>([]);
    const [editingContent, setEditingContent] = useState<PageContent | null>(null);
    const [editedText, setEditedText] = useState('');
    const [saving, setSaving] = useState(false);
    
    const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'super-admin';

    // Debug logging
    useEffect(() => {
        console.log('AboutPage - Current User:', currentUser);
        console.log('AboutPage - Is Admin:', isAdmin);
        console.log('AboutPage - Contents:', contents);
    }, [currentUser, isAdmin, contents]);

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        try {
            const data = await getPageContent('about');
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

    return (
        <div className="bg-white">
            {/* Temporary Login Status Indicator */}
            {isAdmin && (
                <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
                    ✅ Logged in as Admin - Edit buttons active
                </div>
            )}
            {!currentUser && (
                <div className="fixed top-20 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
                    ❌ Not logged in - Please login to see edit buttons
                </div>
            )}
            
            <div className="bg-brand-dark-blue text-white px-4 sm:px-8 text-center min-h-[300px] flex flex-col justify-center items-center">
                <div>
                    <h1 className="text-5xl font-extrabold mb-4">About the Citizens' Atlas</h1>
                    <p className="text-xl max-w-3xl mx-auto">
                        Exposing false solutions and empowering communities for a Zero Waste future.
                    </p>
                </div>
            </div>
            <div className="py-16 px-4 sm:px-8">
                <div className="container mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                        <div>
                            <PageSection 
                                title="Our Mission" 
                                content={getContent('mission')} 
                                isAdmin={isAdmin}
                                onEdit={handleEdit}
                            >
                                {editingContent?.card_id === 'mission' ? (
                                    <div className="space-y-4">
                                        <Textarea
                                            value={editedText}
                                            onChange={(e) => setEditedText(e.target.value)}
                                            rows={8}
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
                                    <p>{getContent('mission')?.content}</p>
                                )}
                            </PageSection>
                        </div>
                        <div>
                            <img src="https://picsum.photos/seed/mission/800/600" alt="A diverse group of people collaborating around a table." className="rounded-lg shadow-lg" />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="md:order-2">
                            <PageSection 
                                title="Our Vision" 
                                content={getContent('vision')} 
                                isAdmin={isAdmin}
                                onEdit={handleEdit}
                            >
                                {editingContent?.card_id === 'vision' ? (
                                    <div className="space-y-4">
                                        <Textarea
                                            value={editedText}
                                            onChange={(e) => setEditedText(e.target.value)}
                                            rows={8}
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
                                    <p>{getContent('vision')?.content}</p>
                                )}
                            </PageSection>
                        </div>
                        <div className="md:order-1">
                            <img src="https://picsum.photos/seed/vision/800/600" alt="A pristine natural landscape with clean air and vibrant green fields." className="rounded-lg shadow-lg" />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-brand-dark-blue py-16 px-4 sm:px-8">
                <div className="container mx-auto max-w-4xl text-center relative">
                    {isAdmin && getContent('problem') && (
                        <button
                            onClick={() => handleEdit(getContent('problem')!)}
                            className="absolute -top-2 right-4 bg-brand-light-blue text-white p-2 rounded hover:bg-brand-dark-blue transition-colors z-10"
                            title="Edit Content"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                    )}
                    <h2 className="text-3xl font-extrabold text-white mb-2">The Problem We Address</h2>
                    <div className="w-16 h-1 bg-white mx-auto mb-4"></div>
                    <div className="text-lg leading-relaxed space-y-4 text-gray-200">
                        {editingContent?.card_id === 'problem' ? (
                            <div className="space-y-4">
                                <Textarea
                                    value={editedText}
                                    onChange={(e) => setEditedText(e.target.value)}
                                    rows={10}
                                    className="w-full text-gray-900"
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
                            getContent('problem')?.content.split('\n\n').map((para, i) => (
                                <p key={i}>{para}</p>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="py-16 px-4 sm:px-8">
                <div className="container mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <PageSection 
                                title="Our Approach" 
                                content={getContent('approach')} 
                                isAdmin={isAdmin}
                                onEdit={handleEdit}
                            >
                                {editingContent?.card_id === 'approach' ? (
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
                                    <>
                                        {getContent('approach')?.content.split('\n\n').map((para, i) => (
                                            <p key={i}>{para}</p>
                                        ))}
                                    </>
                                )}
                            </PageSection>
                        </div>
                        <div>
                            <img src="https://picsum.photos/seed/approach/800/600" alt="A person interacting with a large digital map showing data points." className="rounded-lg shadow-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;