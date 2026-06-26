import React, { useState } from 'react';
import { Article } from '@/types/types';
import { PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon } from '@/components/ui/icons';
import ArticleForm from './ArticleForm';
import Pagination from './Pagination';
import { useTable } from './useTable';
import SortableTableHeader from './SortableTableHeader';
import Checkbox from './Checkbox';

interface NewsUpdateListProps {
    news: Article[];
    onAddNews: (articleData: Omit<Article, 'id' | 'slug'>) => void;
    onUpdateNews: (article: Omit<Article, 'slug'>) => void;
    onDeleteNews: (articleIds: number[]) => void;
    categories: string[];
    onEditNews?: (article: Article) => void;
}

const NewsUpdateList: React.FC<NewsUpdateListProps> = ({ news, onAddNews, onUpdateNews, onDeleteNews, categories, onEditNews }) => {
    const NEWS_EDIT_ID_KEY = 'atlas_admin_news_edit_id';
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<Article | null>(null);

    const persistEditId = (id: number) => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(NEWS_EDIT_ID_KEY, String(id));
    };

    const {
        paginatedItems,
        requestSort,
        setSearchTerm,
        sortConfig,
        currentPage,
        totalPages,
        handlePageChange,
        selectedItems,
        setSelectedItems,
        handleSelectItem,
        handleSelectAll,
        isAllSelected,
    } = useTable<Article>({
        items: news,
        initialSortConfig: { key: 'publishDate', direction: 'descending' },
        searchableFields: ['title', 'category', 'slug'],
        itemsPerPage: 20
    });
    
    const handleOpenAddModal = () => {
        setItemToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (article: Article) => {
        persistEditId(article.id);
        if (onEditNews) {
            onEditNews(article);
        } else {
            setItemToEdit(article);
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setItemToEdit(null);
    };

    const handleDelete = (articleId: number) => {
        if (window.confirm('Are you sure you want to delete this news update?')) {
            onDeleteNews([articleId]);
            if (paginatedItems.length === 1 && currentPage > 1) {
                handlePageChange(currentPage - 1);
            }
        }
    };

    const handleBulkDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedItems.length} selected news updates?`)) {
            onDeleteNews(selectedItems);
            setSelectedItems([]);
            if (paginatedItems.length === selectedItems.length && currentPage > 1) {
                handlePageChange(currentPage - 1);
            }
        }
    };
    
    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-brand-dark-blue">Manage News Updates</h2>
                    <p className="text-gray-600 mt-1">Add, edit, or delete news updates.</p>
                </div>
            </div>
            
            {selectedItems.length > 0 && (
                <div className="flex items-center justify-between p-4 bg-blue-100 border border-blue-200 rounded-lg mb-4">
                    <p className="text-sm font-medium text-blue-800">{selectedItems.length} item(s) selected.</p>
                    <button
                        onClick={handleBulkDelete}
                        className="bg-red-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-600 text-sm flex items-center gap-2"
                    >
                        <TrashIcon className="w-4 h-4" />
                        Delete Selected
                    </button>
                </div>
            )}

            <div className="mb-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by title, category, or slug..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 pl-9 border border-gray-300 rounded-md focus:ring-brand-medium-blue focus:border-brand-medium-blue"
                        aria-label="Search news updates"
                    />
                    <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            <div className="bg-white border rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left text-gray-700">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th scope="col" className="px-6 py-4">
                                    <Checkbox
                                        checked={isAllSelected(paginatedItems)}
                                        onChange={() => handleSelectAll(paginatedItems)}
                                        aria-label="Select all news on this page"
                                    />
                                </th>
                                <SortableTableHeader label="Title" sortKey="title" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableTableHeader label="Category" sortKey="category" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableTableHeader label="Publish Date" sortKey="publishDate" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableTableHeader label="Status" sortKey="status" sortConfig={sortConfig} requestSort={requestSort} />
                                <th scope="col" className="px-6 py-4 font-bold text-brand-dark-blue text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedItems.map(item => (
                                <tr key={item.id} className={`border-b transition-colors ${selectedItems.includes(item.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                                    <td className="px-6 py-4">
                                        <Checkbox
                                            checked={selectedItems.includes(item.id)}
                                            onChange={() => handleSelectItem(item.id)}
                                            aria-label={`Select news item ${item.title}`}
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-medium max-w-sm truncate">{item.title}</td>
                                    <td className="px-6 py-4">{item.category}</td>
                                    <td className="px-6 py-4">{item.publishDate || 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            item.status === 'draft' 
                                                ? 'bg-yellow-100 text-yellow-800' 
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                            {item.status === 'draft' ? 'Waiting for approval' : 'Published'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end items-center space-x-3">
                                            <button 
                                                onClick={() => handleOpenEditModal(item)}
                                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                                aria-label={`Edit ${item.title}`}
                                            >
                                                <PencilIcon />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="text-red-600 hover:text-red-800 transition-colors"
                                                aria-label={`Delete ${item.title}`}
                                            >
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            {isModalOpen && (
                <ArticleForm
                    onClose={handleCloseModal}
                    onSubmit={(data) => {
                        onAddNews(data);
                        handleCloseModal();
                    }}
                    onUpdate={(data) => {
                        onUpdateNews(data);
                        handleCloseModal();
                    }}
                    itemToEdit={itemToEdit}
                    itemType="News Update"
                    categories={categories}
                />
            )}
        </div>
    );
};

export default NewsUpdateList;