import React, { useState, useMemo } from 'react';
import { Article } from '@/types/types';
import ViewToggle from '@/components/pages/ViewToggle';
import ArticleGridCard from './ArticleGridCard';
import ArticleListRow from './ArticleListRow';
import Pagination from '@/components/features/admin/Pagination';

interface ArticleListPageProps {
    title: string;
    items: Article[];
    onViewArticle: (article: Article) => void;
    onIncrementDownload?: (articleId: number) => void;
}

const ITEMS_PER_PAGE = 9;

const ArticleListPage: React.FC<ArticleListPageProps> = ({ title, items, onViewArticle, onIncrementDownload }) => {
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

    const paginatedItems = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [items, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    return (
        <div className="bg-white py-12 px-4 sm:px-8 lg:px-16">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-brand-dark-blue">{title}</h1>
                        <div className="w-16 h-1 bg-brand-dark-blue mt-2"></div>
                    </div>
                    <ViewToggle activeView={view} setActiveView={setView} />
                </div>

                {view === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {paginatedItems.map(item => <ArticleGridCard key={item.id} item={item} onViewArticle={onViewArticle} pageTitle={title} onDownload={onIncrementDownload} />)}
                    </div>
                ) : (
                    <div className="space-y-8">
                        {paginatedItems.map(item => <ArticleListRow key={item.id} item={item} onViewArticle={onViewArticle} pageTitle={title} onDownload={onIncrementDownload} />)}
                    </div>
                )}
                
                 <div className="mt-12">
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default ArticleListPage;