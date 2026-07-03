import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Article } from '@/types/types';
import ViewToggle from '@/components/pages/ViewToggle';
import ArticleGridCard from './ArticleGridCard';
import ArticleListRow from './ArticleListRow';

interface ArticleListPageProps {
    title: string;
    items: Article[];
    onViewArticle: (article: Article) => void;
    onIncrementDownload?: (articleId: number) => void;
    filterBar?: React.ReactNode;
    hideTitle?: boolean;
}

const ITEMS_PER_PAGE = 12;

const ArticleListPage: React.FC<ArticleListPageProps> = ({ title, items, onViewArticle, onIncrementDownload, filterBar, hideTitle = false }) => {
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
    const [isLoading, setIsLoading] = useState(false);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const displayedItems = useMemo(() => {
        return items.slice(0, displayedCount);
    }, [items, displayedCount]);

    const hasMore = displayedCount < items.length;

    const loadMore = useCallback(() => {
        if (hasMore && !isLoading) {
            setIsLoading(true);
            // Simulate a small delay for better UX
            setTimeout(() => {
                setDisplayedCount(prev => Math.min(prev + ITEMS_PER_PAGE, items.length));
                setIsLoading(false);
            }, 300);
        }
    }, [hasMore, isLoading, items.length]);

    // Reset display count when items change (e.g., when filters change)
    useEffect(() => {
        setDisplayedCount(ITEMS_PER_PAGE);
    }, [items]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
        };
    }, [loadMore, hasMore, isLoading]);

    return (
        <div className="bg-white py-12 px-4 sm:px-8 lg:px-16">
            <div className="container mx-auto">
                <div className="mb-8">
                    {!hideTitle && (
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                            <div>
                                <h1 className="text-4xl font-extrabold text-brand-dark-blue">{title}</h1>
                                <div className="w-16 h-1 bg-brand-dark-blue mt-2"></div>
                            </div>
                            {!filterBar && <ViewToggle activeView={view} setActiveView={setView} />}
                        </div>
                    )}
                    {filterBar && (
                        <div className="flex flex-col md:flex-row md:items-center gap-3 mt-6">
                            <div className="flex-1">{filterBar}</div>
                            <div className="flex-shrink-0">
                                <ViewToggle activeView={view} setActiveView={setView} />
                            </div>
                        </div>
                    )}
                    {hideTitle && !filterBar && (
                        <div className="flex justify-end">
                            <ViewToggle activeView={view} setActiveView={setView} />
                        </div>
                    )}
                </div>

                {view === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {displayedItems.map(item => <ArticleGridCard key={item.id} item={item} onViewArticle={onViewArticle} pageTitle={title} onDownload={onIncrementDownload} />)}
                    </div>
                ) : (
                    <div className="space-y-8">
                        {displayedItems.map(item => <ArticleListRow key={item.id} item={item} onViewArticle={onViewArticle} pageTitle={title} onDownload={onIncrementDownload} />)}
                    </div>
                )}
                
                {/* Load More Trigger */}
                {hasMore && (
                    <div ref={loadMoreRef} className="mt-12 flex justify-center">
                        {isLoading && (
                            <div className="flex flex-col items-center gap-2">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-dark-blue"></div>
                                <p className="text-gray-500">Loading more publications...</p>
                            </div>
                        )}
                    </div>
                )}
                
                {!hasMore && items.length > ITEMS_PER_PAGE && (
                    <div className="mt-12 text-center text-gray-500">
                        <p>No more publications to load</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArticleListPage;