import React from 'react';
import { Article } from '@/types/types';
import ArticleForm from './ArticleForm';

interface NewsFormPageProps {
    onAddNews: (articleData: Omit<Article, 'id' | 'slug'>) => void;
    onUpdateNews?: (article: Omit<Article, 'slug'>) => void;
    onBack: () => void;
    categories: string[];
    itemToEdit?: Article | null;
    userRole?: 'contributor' | 'admin' | 'super-admin';
}

const NewsFormPage: React.FC<NewsFormPageProps> = ({ onAddNews, onUpdateNews, onBack, categories, itemToEdit, userRole }) => {
    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-brand-dark-blue">
                        {itemToEdit ? 'Edit News Update' : 'Add News Update'}
                    </h2>
                    <p className="text-gray-600 mt-1">
                        {itemToEdit ? 'Update news details.' : 'Submit a new news update.'}
                    </p>
                </div>
            </div>
            
            <ArticleForm
                onClose={onBack}
                onSubmit={(articleData) => {
                    onAddNews(articleData);
                    onBack();
                }}
                onUpdate={(articleData) => {
                    if (onUpdateNews && itemToEdit) {
                        onUpdateNews({ ...articleData, id: itemToEdit.id });
                        onBack();
                    }
                }}
                itemToEdit={itemToEdit || null}
                itemType="News Update"
                categories={categories}
                isModal={false}
                userRole={userRole}
            />
        </div>
    );
};

export default NewsFormPage;
