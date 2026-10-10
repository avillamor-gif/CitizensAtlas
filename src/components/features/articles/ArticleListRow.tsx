import React from 'react';
import { Article } from '@/types/types';
import { PlayIcon } from '@/components/ui/icons';
import { toPlainText } from '@/lib/utils';

interface ArticleListRowProps {
    item: Article;
    onViewArticle: (article: Article) => void;
    pageTitle: string;
    onDownload?: (articleId: number) => void;
}

const ArticleListRow: React.FC<ArticleListRowProps> = ({ item, onViewArticle, pageTitle, onDownload }) => {
    const isVideo = pageTitle === 'Videos';

    return (
        <button
            type="button"
            onClick={() => onViewArticle(item)}
            className="w-full text-left rounded-lg hover:opacity-90 transition-all duration-300 flex flex-col sm:flex-row overflow-hidden group border"
            style={{ backgroundColor: 'rgba(26, 95, 122, 0.1)', borderColor: '#2f4059' }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#ffa51d';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#2f4059';
            }}
        >
            <div className="sm:w-1/3 flex-shrink-0 h-48 sm:h-auto overflow-hidden relative">
                <img
                    src={item.imageUrl || '/fallback-project-image.svg'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/fallback-project-image.svg';
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
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-300 line-clamp-4 flex-grow mb-4">
                    {toPlainText(item.description)}
                </p>
                <span className="text-sm font-bold hover:underline mt-auto self-start text-left" style={{ color: '#64b5ff' }}>
                    Read More &rarr;
                </span>
            </div>
        </button>
    );
};

export default ArticleListRow;