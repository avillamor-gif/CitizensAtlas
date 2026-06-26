import React, { useState } from 'react';
import { Article } from '@/types/types';
import { PlusIcon, PencilIcon, TrashIcon } from '@/components/ui/icons';
import AddPublicationCategoryModal from './AddPublicationCategoryModal';

interface PublicationCategoryListProps {
    publications: Article[];
    publicationCategories: string[];
    onAddCategory: (categoryName: string) => void;
    onUpdateCategory: (oldName: string, newName: string) => void;
    onDeleteCategory: (categoryName: string) => void;
}

const PublicationCategoryList: React.FC<PublicationCategoryListProps> = ({
    publications,
    publicationCategories,
    onAddCategory,
    onUpdateCategory,
    onDeleteCategory,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<string | null>(null);

    const handleOpenAddModal = () => {
        setCategoryToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (category: string) => {
        setCategoryToEdit(category);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCategoryToEdit(null);
    };

    const handleSubmitCategory = (newName: string, oldName?: string) => {
        if (oldName) {
            onUpdateCategory(oldName, newName);
        } else {
            onAddCategory(newName);
        }
        handleCloseModal();
    };

    const handleDelete = (categoryName: string) => {
        if (window.confirm(`Are you sure you want to delete the publication category "${categoryName}"? This action cannot be undone.`)) {
            onDeleteCategory(categoryName);
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-brand-dark-blue">Publication Categories</h2>
                    <p className="text-gray-600 mt-1">A list of all available categories for publications.</p>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="bg-brand-yellow text-brand-dark-blue font-bold py-3 px-6 rounded-md hover:bg-yellow-500 transition-colors whitespace-nowrap mt-4 md:mt-0 flex items-center gap-2"
                >
                    <PlusIcon className="w-5 h-5" />
                    Add New Category
                </button>
            </div>

            <div className="bg-white border rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left text-gray-700">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-bold text-brand-dark-blue">
                                    Category Name
                                </th>
                                <th scope="col" className="px-6 py-4 font-bold text-brand-dark-blue">
                                    Publication Count
                                </th>
                                <th scope="col" className="px-6 py-4 font-bold text-brand-dark-blue text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {publicationCategories.map(category => {
                                const count = publications.filter(item => item.publicationCategory === category).length;
                                return (
                                    <tr key={category} className="border-b hover:bg-blue-50 transition-colors">
                                        <td className="px-6 py-4 font-medium">{category}</td>
                                        <td className="px-6 py-4">{count}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end items-center space-x-3">
                                                <button
                                                    onClick={() => handleOpenEditModal(category)}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                                    aria-label={`Edit ${category}`}
                                                >
                                                    <PencilIcon />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category)}
                                                    className="text-red-600 hover:text-red-800 transition-colors"
                                                    aria-label={`Delete ${category}`}
                                                >
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && (
                <AddPublicationCategoryModal
                    onClose={handleCloseModal}
                    onSubmit={handleSubmitCategory}
                    categoryToEdit={categoryToEdit}
                />
            )}
        </div>
    );
};

export default PublicationCategoryList;
