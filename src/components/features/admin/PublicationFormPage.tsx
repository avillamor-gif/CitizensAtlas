import React from 'react';
import { Article } from '@/types/types';
import ArticleForm from './ArticleForm';

interface PublicationFormPageProps {
    onAddPublication: (articleData: Omit<Article, 'id' | 'slug'>) => void;
    onUpdatePublication?: (article: Omit<Article, 'slug'>) => void;
    onBack: () => void;
    publicationTypes: string[];
    onAddPublicationType?: (publicationType: string) => void;
    itemToEdit?: Article | null;
    userRole?: 'contributor' | 'admin' | 'super-admin';
}

const PublicationFormPage: React.FC<PublicationFormPageProps> = ({ onAddPublication, onUpdatePublication, onBack, publicationTypes, onAddPublicationType, itemToEdit, userRole }) => {
    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-brand-dark-blue">
                        {itemToEdit ? 'Edit Publication' : 'Add Publication'}
                    </h2>
                    <p className="text-gray-600 mt-1">
                        {itemToEdit ? 'Update publication details.' : 'Submit a new publication.'}
                    </p>
                </div>
            </div>
            
            <ArticleForm
                onClose={onBack}
                onSubmit={(articleData) => {
                    onAddPublication(articleData);
                    onBack();
                }}
                onUpdate={(articleData) => {
                    if (onUpdatePublication && itemToEdit) {
                        onUpdatePublication({ ...articleData, id: itemToEdit.id });
                        onBack();
                    }
                }}
                itemToEdit={itemToEdit || null}
                itemType="Publication"
                categories={publicationTypes}
                onAddCategory={onAddPublicationType}
                isModal={false}
                userRole={userRole}
            />
        </div>
    );
};

export default PublicationFormPage;
