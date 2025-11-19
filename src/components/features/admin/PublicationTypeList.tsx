import React, { useState } from 'react';
import { Article } from '@/types/types';
import { PlusIcon, PencilIcon, TrashIcon } from '@/components/ui/icons';
import AddPublicationTypeModal from './AddPublicationTypeModal';

interface PublicationTypeListProps {
    publications: Article[];
    publicationTypes: string[];
    onAddType: (typeName: string) => void;
    onUpdateType: (oldName: string, newName: string) => void;
    onDeleteType: (typeName: string) => void;
}

const PublicationTypeList: React.FC<PublicationTypeListProps> = ({ publications, publicationTypes, onAddType, onUpdateType, onDeleteType }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [typeToEdit, setTypeToEdit] = useState<string | null>(null);

    const handleOpenAddModal = () => {
        setTypeToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (type: string) => {
        setTypeToEdit(type);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTypeToEdit(null);
    };
    
    const handleSubmitType = (newName: string, oldName?: string) => {
        if (oldName) {
            onUpdateType(oldName, newName);
        } else {
            onAddType(newName);
        }
        handleCloseModal();
    };

    const handleDelete = (typeName: string) => {
        if (window.confirm(`Are you sure you want to delete the publication type "${typeName}"? This action cannot be undone.`)) {
            onDeleteType(typeName);
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                 <div>
                    <h2 className="text-3xl font-bold text-brand-dark-blue">Publication Types</h2>
                    <p className="text-gray-600 mt-1">A list of all available types for publications.</p>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="bg-brand-yellow text-brand-dark-blue font-bold py-3 px-6 rounded-md hover:bg-yellow-500 transition-colors whitespace-nowrap mt-4 md:mt-0 flex items-center gap-2"
                >
                    <PlusIcon className="w-5 h-5" />
                    Add New Type
                </button>
            </div>

            <div className="bg-white border rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left text-gray-700">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-bold text-brand-dark-blue">
                                    Type Name
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
                            {publicationTypes.map(type => {
                                const count = publications.filter(item => item.category === type).length;
                                return (
                                    <tr key={type} className="border-b hover:bg-blue-50 transition-colors">
                                        <td className="px-6 py-4 font-medium">{type}</td>
                                        <td className="px-6 py-4">{count}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end items-center space-x-3">
                                                <button
                                                    onClick={() => handleOpenEditModal(type)}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                                    aria-label={`Edit ${type}`}
                                                >
                                                    <PencilIcon />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(type)}
                                                    className="text-red-600 hover:text-red-800 transition-colors"
                                                    aria-label={`Delete ${type}`}
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
                <AddPublicationTypeModal 
                    onClose={handleCloseModal}
                    onSubmit={handleSubmitType}
                    typeToEdit={typeToEdit}
                />
            )}
        </div>
    );
};

export default PublicationTypeList;