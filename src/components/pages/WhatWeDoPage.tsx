'use client'

import React, { useState, useEffect } from 'react';
import { User } from '@/types/types';
import { getPageContent, updatePageContent, PageContent } from '@/lib/services/supabase-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ChevronDownIcon } from '@/components/ui/icons';

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
  'map-pin': <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  'search': <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  'document': <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  'play': <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  'lightning': <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  'globe': <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.707 4.5l-1.414 1.414M16.293 4.5l1.414 1.414M12 18.5a5 5 0 01-10 0" /></svg>,
};

interface FeatureCardProps {
  content: PageContent;
  onClick: () => void;
  onEditClick: () => void;
  isAdmin: boolean;
  isSelected: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ content, onClick, onEditClick, isAdmin, isSelected }) => (
  <div 
    className={`bg-white p-8 rounded-lg shadow-lg border-2 transition-all duration-300 relative cursor-pointer ${
      isSelected 
        ? 'border-brand-light-blue bg-brand-light-blue/5' 
        : 'border-gray-200 hover:border-brand-light-blue/50 hover:shadow-xl'
    }`}
    onClick={onClick}
  >
    {isAdmin && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEditClick();
        }}
        className="absolute top-4 right-4 text-gray-400 hover:text-brand-light-blue transition-colors"
        title="Edit Content"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
    )}
    <div className={`flex items-center justify-center h-16 w-16 rounded-full transition-colors mb-6 ${
      isSelected ? 'bg-brand-light-blue text-white' : 'bg-brand-light-blue/20 text-brand-light-blue'
    }`}>
      {iconMap[content.icon_name || 'document']}
    </div>
    <h3 className={`text-2xl font-bold mb-3 pr-8 transition-colors ${
      isSelected ? 'text-brand-light-blue' : 'text-brand-dark-blue'
    }`}>
      {content.title}
    </h3>
    <p className="text-gray-600 leading-relaxed line-clamp-3">{content.content}</p>
  </div>
);

interface WhatWeDoPageProps {
  currentUser?: User | null;
}

const WhatWeDoPage: React.FC<WhatWeDoPageProps> = ({ currentUser }) => {
  const [contents, setContents] = useState<PageContent[]>([]);
  const [selectedContent, setSelectedContent] = useState<PageContent | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'super-admin';

  // Debug logging
  useEffect(() => {
    console.log('🔍 WhatWeDoPage - Current User:', currentUser);
    console.log('🔍 WhatWeDoPage - User Role:', currentUser?.role);
    console.log('🔍 WhatWeDoPage - Is Admin:', isAdmin);
  }, [currentUser, isAdmin]);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const data = await getPageContent('what-we-do');
      setContents(data);
    } catch (error) {
      console.error('Error loading page content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (content: PageContent) => {
    if (selectedContent?.id === content.id) {
      // Toggle off if clicking the same card
      setSelectedContent(null);
      setIsEditMode(false);
    } else {
      setSelectedContent(content);
      setIsEditMode(false);
    }
  };

  const handleEditClick = (content: PageContent) => {
    setSelectedContent(content);
    setEditedContent({ ...content });
    setIsEditMode(true);
  };

  const handleSave = async () => {
    if (!editedContent) return;
    
    try {
      setSaving(true);
      await updatePageContent(editedContent.id, {
        title: editedContent.title,
        content: editedContent.content,
      });
      
      // Update local state
      setContents(prev => prev.map(c => c.id === editedContent.id ? editedContent : c));
      setSelectedContent(editedContent);
      setIsEditMode(false);
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setSelectedContent(null);
    setIsEditMode(false);
    setEditedContent(null);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="bg-brand-dark-blue text-white px-4 sm:px-8 text-center min-h-[300px] flex flex-col justify-center items-center">
        <div>
          <h1 className="text-5xl font-extrabold mb-4">What We Do</h1>
          <p className="text-xl max-w-3xl mx-auto">
            We provide data, tools, and stories to help communities fight for environmental justice and promote real Zero Waste solutions.
          </p>
        </div>
      </div>
      
      <div className="py-16 px-4 sm:px-8">
        <div className="container mx-auto space-y-8">
          {/* First Section - First 3 cards */}
          <div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {contents.slice(0, 3).map((content) => (
                <FeatureCard 
                  key={content.id}
                  content={content} 
                  onClick={() => handleCardClick(content)}
                  onEditClick={() => handleEditClick(content)}
                  isAdmin={isAdmin}
                  isSelected={selectedContent?.id === content.id}
                />
              ))}
            </div>

            {/* Content Panel for First Section */}
            <div 
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                selectedContent && contents.slice(0, 3).find(c => c.id === selectedContent.id)
                  ? 'max-h-[1000px] opacity-100' 
                  : 'max-h-0 opacity-0'
              }`}
            >
              {selectedContent && contents.slice(0, 3).find(c => c.id === selectedContent.id) && (
                <div className="bg-white rounded-lg shadow-2xl border-2 border-brand-light-blue p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-6 flex-1">
                      <div className="flex items-center justify-center h-20 w-20 rounded-full bg-brand-light-blue text-white flex-shrink-0">
                        {iconMap[selectedContent.icon_name || 'document']}
                      </div>
                      <div className="flex-1">
                        {isEditMode ? (
                          <Input
                            value={editedContent?.title || ''}
                            onChange={(e) => setEditedContent(prev => prev ? { ...prev, title: e.target.value } : null)}
                            className="text-3xl font-bold mb-2"
                          />
                        ) : (
                          <h2 className="text-3xl font-bold text-brand-dark-blue mb-2">{selectedContent.title}</h2>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={handleClose}
                      className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
                      aria-label="Close"
                    >
                      <ChevronDownIcon className="w-8 h-8 transform rotate-180" />
                    </button>
                  </div>

                  <div className="mt-6">
                    {isEditMode ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="content">Content</Label>
                          <Textarea
                            id="content"
                            value={editedContent?.content || ''}
                            onChange={(e) => setEditedContent(prev => prev ? { ...prev, content: e.target.value } : null)}
                            rows={10}
                            className="mt-2"
                          />
                        </div>
                        <div className="flex gap-3 justify-end">
                          <Button 
                            variant="outline" 
                            onClick={() => setIsEditMode(false)}
                            disabled={saving}
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleSave}
                            disabled={saving}
                          >
                            {saving ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="prose prose-lg max-w-none">
                        <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                          {selectedContent.content}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Second Section - Last 3 cards */}
          <div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {contents.slice(3).map((content) => (
                <FeatureCard 
                  key={content.id}
                  content={content} 
                  onClick={() => handleCardClick(content)}
                  onEditClick={() => handleEditClick(content)}
                  isAdmin={isAdmin}
                  isSelected={selectedContent?.id === content.id}
                />
              ))}
            </div>

            {/* Content Panel for Second Section */}
            <div 
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                selectedContent && contents.slice(3).find(c => c.id === selectedContent.id)
                  ? 'max-h-[1000px] opacity-100' 
                  : 'max-h-0 opacity-0'
              }`}
            >
              {selectedContent && contents.slice(3).find(c => c.id === selectedContent.id) && (
                <div className="bg-white rounded-lg shadow-2xl border-2 border-brand-light-blue p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-6 flex-1">
                      <div className="flex items-center justify-center h-20 w-20 rounded-full bg-brand-light-blue text-white flex-shrink-0">
                        {iconMap[selectedContent.icon_name || 'document']}
                      </div>
                      <div className="flex-1">
                        {isEditMode ? (
                          <Input
                            value={editedContent?.title || ''}
                            onChange={(e) => setEditedContent(prev => prev ? { ...prev, title: e.target.value } : null)}
                            className="text-3xl font-bold mb-2"
                          />
                        ) : (
                          <h2 className="text-3xl font-bold text-brand-dark-blue mb-2">{selectedContent.title}</h2>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={handleClose}
                      className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
                      aria-label="Close"
                    >
                      <ChevronDownIcon className="w-8 h-8 transform rotate-180" />
                    </button>
                  </div>

                  <div className="mt-6">
                    {isEditMode ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="content">Content</Label>
                          <Textarea
                            id="content"
                            value={editedContent?.content || ''}
                            onChange={(e) => setEditedContent(prev => prev ? { ...prev, content: e.target.value } : null)}
                            rows={10}
                            className="mt-2"
                          />
                        </div>
                        <div className="flex gap-3 justify-end">
                          <Button 
                            variant="outline" 
                            onClick={() => setIsEditMode(false)}
                            disabled={saving}
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleSave}
                            disabled={saving}
                          >
                            {saving ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="prose prose-lg max-w-none">
                        <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                          {selectedContent.content}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatWeDoPage;