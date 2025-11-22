'use client'

import React, { useState, useEffect } from 'react';
import { User } from '@/types/types';
import { getPageContent, updatePageContent, PageContent } from '@/lib/services/supabase-service';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

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
}

const FeatureCard: React.FC<FeatureCardProps> = ({ content, onClick }) => (
  <div 
    className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 cursor-pointer hover:shadow-xl transition-shadow duration-300"
    onClick={onClick}
  >
    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-light-blue text-white mb-6">
      {iconMap[content.icon_name || 'document']}
    </div>
    <h3 className="text-2xl font-bold text-brand-dark-blue mb-3">{content.title}</h3>
    <p className="text-gray-600 leading-relaxed line-clamp-3">{content.content}</p>
    <p className="text-brand-light-blue text-sm mt-3 font-medium">Click to read more →</p>
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
    setSelectedContent(content);
    setIsEditMode(false);
  };

  const handleEditClick = () => {
    setEditedContent({ ...selectedContent! });
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
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contents.map((content) => (
              <FeatureCard 
                key={content.id} 
                content={content} 
                onClick={() => handleCardClick(content)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content Detail Modal */}
      <Dialog open={!!selectedContent} onOpenChange={handleClose}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-3xl font-bold text-brand-dark-blue">
                {isEditMode ? (
                  <Input
                    value={editedContent?.title || ''}
                    onChange={(e) => setEditedContent(prev => prev ? { ...prev, title: e.target.value } : null)}
                    className="text-2xl font-bold"
                  />
                ) : (
                  selectedContent?.title
                )}
              </DialogTitle>
              {isAdmin && !isEditMode && (
                <Button 
                  onClick={handleEditClick}
                  variant="outline"
                  size="sm"
                  className="ml-4"
                >
                  Edit Content
                </Button>
              )}
            </div>
          </DialogHeader>
          
          <div className="mt-6">
            <div className="flex items-center justify-center h-20 w-20 rounded-full bg-brand-light-blue text-white mb-6">
              {iconMap[selectedContent?.icon_name || 'document']}
            </div>
            
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
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedContent?.content}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WhatWeDoPage;