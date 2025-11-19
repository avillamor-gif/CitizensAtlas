import React from 'react';
import { Article } from '@/types/types';
import ArticleForm from './ArticleForm';

interface VideoFormPageProps {
    onAddVideo: (articleData: Omit<Article, 'id' | 'slug'>) => void;
    onUpdateVideo?: (article: Omit<Article, 'slug'>) => void;
    onBack: () => void;
    videoCategories: string[];
    onAddVideoCategory?: (category: string) => void;
    itemToEdit?: Article | null;
    userRole?: 'contributor' | 'admin' | 'super-admin';
}

const VideoFormPage: React.FC<VideoFormPageProps> = ({ onAddVideo, onUpdateVideo, onBack, videoCategories, onAddVideoCategory, itemToEdit, userRole }) => {
    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-brand-dark-blue">
                        {itemToEdit ? 'Edit Video' : 'Add Video'}
                    </h2>
                    <p className="text-gray-600 mt-1">
                        {itemToEdit ? 'Update video details.' : 'Submit a new video.'}
                    </p>
                </div>
            </div>
            
            <ArticleForm
                onClose={onBack}
                onSubmit={(articleData) => {
                    onAddVideo(articleData);
                    onBack();
                }}
                onUpdate={(articleData) => {
                    if (onUpdateVideo && itemToEdit) {
                        onUpdateVideo({ ...articleData, id: itemToEdit.id });
                        onBack();
                    }
                }}
                itemToEdit={itemToEdit || null}
                itemType="Video"
                categories={videoCategories}
                onAddCategory={onAddVideoCategory}
                isModal={false}
                userRole={userRole}
            />
        </div>
    );
};

export default VideoFormPage;
