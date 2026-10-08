import React from 'react';
import { Article } from '@/types/types';
import { PlayIcon } from '@/components/ui/icons';
import { toPlainText } from '@/lib/utils';

interface ArticleGridCardProps {
    item: Article;
    onViewArticle: (article: Article) => void;
    pageTitle: string;
    onDownload?: (articleId: number) => void;
}

const ArticleGridCard: React.FC<ArticleGridCardProps> = ({ item, onViewArticle, pageTitle, onDownload }) => {
    const isVideo = pageTitle === 'Videos';
    
    return (
        <button
            type="button"
            onClick={() => onViewArticle(item)}
            className="w-full text-left rounded-lg hover:opacity-90 transition-opacity duration-300 flex flex-col overflow-hidden group border-2"
            style={{ backgroundColor: 'rgba(26, 95, 122, 0.1)', borderColor: '#1a5f7a' }}
        >
            <div className="h-48 overflow-hidden relative">
                <img
                    src={item.imageUrl || '/fallback.jpg'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/fallback.jpg';
                    }}
                />
                {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all duration-300">
                        <div className="bg-white bg-opacity-90 rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                            <div style={{ color: 'var(--highlight)' }}>
                                <PlayIcon className="w-12 h-12" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <div className="mb-3 flex flex-wrap gap-2">
                    <span className="text-xs font-bold px-2 py-1 inline-block self-start rounded" style={{ backgroundColor: 'var(--highlight)', color: '#0a1628' }}>
                        {item.category}
                    </span>
                    {item.publicationCategory && (
                        <span className="text-xs font-semibold px-2 py-1 inline-block self-start rounded" style={{ backgroundColor: 'rgba(26, 95, 122, 0.3)', color: '#64b5ff' }}>
                            {item.publicationCategory}
                        </span>
                    )}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 flex-grow">{item.title}</h3>
                <p className="text-sm text-gray-300 line-clamp-3 mb-4">
                    {toPlainText(item.description)}
                </p>
                <span className="text-sm font-bold hover:underline mt-auto self-start text-left" style={{ color: '#64b5ff' }}>
                    Read More &rarr;
                </span>
            </div>
        </button>
    );
};

export default ArticleGridCard;