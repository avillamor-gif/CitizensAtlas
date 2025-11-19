import React, { useState } from 'react';
import { Article } from '@/types/types';
import { PlusIcon, PencilIcon, TrashIcon } from '@/components/ui/icons';
import AddCategoryModal from './AddCategoryModal';

interface VideoCategoryListProps {
    videos: Article[];
    categories: string[];
    onAddCategory: (categoryName: string) => void;
    onUpdateCategory: (oldName: string, newName: string) => void;
    onDeleteCategory: (categoryName: string) => void;
}

const VideoCategoryList: React.FC<VideoCategoryListProps> = ({ videos, categories, onAddCategory, onUpdateCategory, onDeleteCategory }) => {
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
        if (window.confirm(`Are you sure you want to delete the category "${categoryName}"? This action cannot be undone.`)) {
            onDeleteCategory(categoryName);
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                 <div>
                    <h2 className="text-3xl font-bold text-brand-dark-blue">Video Categories</h2>
                    <p className="text-gray-600 mt-1">A list of all available categories for videos.</p>
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
                                    Video Count
                                </th>
                                <th scope="col" className="px-6 py-4 font-bold text-brand-dark-blue text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(category => {
                                const count = videos.filter(item => item.category === category).length;
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
                <AddCategoryModal 
                    onClose={handleCloseModal}
                    onSubmit={handleSubmitCategory}
                    categoryToEdit={categoryToEdit}
                />
            )}
        </div>
    );
};

export default VideoCategoryList;
