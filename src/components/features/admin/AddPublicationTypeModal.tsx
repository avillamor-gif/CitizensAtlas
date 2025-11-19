import React, { useState, useEffect } from 'react';

interface AddPublicationTypeModalProps {
    onClose: () => void;
    onSubmit: (newTypeName: string, oldTypeName?: string) => void;
    typeToEdit?: string | null;
}

const AddPublicationTypeModal: React.FC<AddPublicationTypeModalProps> = ({ onClose, onSubmit, typeToEdit }) => {
    const [typeName, setTypeName] = useState('');
    const isEditMode = Boolean(typeToEdit);

    useEffect(() => {
        if (isEditMode && typeToEdit) {
            setTypeName(typeToEdit);
        }
    }, [typeToEdit, isEditMode]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (typeName.trim()) {
            onSubmit(typeName.trim(), typeToEdit || undefined);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-brand-dark-blue">{isEditMode ? 'Edit Publication Type' : 'Add New Publication Type'}</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <label htmlFor="type-name" className="block text-sm font-medium text-gray-700 mb-1">
                            Type Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="type-name"
                            value={typeName}
                            onChange={(e) => setTypeName(e.target.value)}
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
                            {isEditMode ? 'Update Type' : 'Add Type'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPublicationTypeModal;