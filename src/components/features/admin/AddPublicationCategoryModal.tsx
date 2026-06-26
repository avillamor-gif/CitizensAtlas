import React, { useState, useEffect } from 'react';

interface AddPublicationCategoryModalProps {
    onClose: () => void;
    onSubmit: (newCategoryName: string, oldCategoryName?: string) => void;
    categoryToEdit?: string | null;
}

const AddPublicationCategoryModal: React.FC<AddPublicationCategoryModalProps> = ({ onClose, onSubmit, categoryToEdit }) => {
    const [categoryName, setCategoryName] = useState('');
    const isEditMode = Boolean(categoryToEdit);

    useEffect(() => {
        if (isEditMode && categoryToEdit) {
            setCategoryName(categoryToEdit);
        }
    }, [categoryToEdit, isEditMode]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (categoryName.trim()) {
            onSubmit(categoryName.trim(), categoryToEdit || undefined);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-brand-dark-blue">{isEditMode ? 'Edit Publication Category' : 'Add New Publication Category'}</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <label htmlFor="category-name" className="block text-sm font-medium text-gray-700 mb-1">
                            Category Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="category-name"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-medium-blue focus:border-brand-medium-blue"
                            required
                            autoFocus
                        />
                    </div>
                    <div className="p-6 flex justify-end space-x-4 bg-gray-50 border-t rounded-b-lg">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-md hover:bg-gray-300 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="text-white font-bold py-2 px-6 rounded-md transition-colors"
                            style={{ backgroundColor: '#0d234f' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#081629'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0d234f'}
                        >
                            {isEditMode ? 'Update Category' : 'Add Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPublicationCategoryModal;
