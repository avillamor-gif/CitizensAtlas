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
    const isNews = pageTitle === 'News';
    const isPublication = pageTitle === 'Publications';
    const [isHovering, setIsHovering] = React.useState(false);
    
    return (
        <button
            type="button"
            onClick={() => onViewArticle(item)}
            className="w-full text-left rounded-lg hover:opacity-90 transition-all duration-300 flex flex-col overflow-hidden group border"
            style={{ backgroundColor: 'rgba(26, 95, 122, 0.1)', borderColor: '#384860' }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#ffa51d';
                setIsHovering(true);
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#2f4059';
                setIsHovering(false);
            }}
        >
            <div className="h-48 overflow-hidden relative">
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
                {isPublication && item.publicationSolutionType && (
                    <div className="absolute top-0 left-0 right-0 flex justify-center pt-2 z-10">
                        <div className="px-3 py-1.5 rounded text-xs font-bold text-white" style={{ backgroundColor: item.publicationSolutionType === 'Solutions' ? '#10b981' : '#f59e0b' }}>
                            {item.publicationSolutionType}
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
                <h4 className="text-white mb-2 flex-grow group-hover:text-brand-orange transition-colors">{item.title}</h4>
                {!isNews && !isPublication && (
                    <p className="text-sm text-gray-300 line-clamp-3 mb-4">
                        {toPlainText(item.description)}
                    </p>
                )}
                <span 
                    className="transition-colors duration-200"
                    style={{ 
                        color: isHovering ? '#ffa51d' : '#98a7b8',
                        fontWeight: 400,
                        fontSize: '12px',
                        fontStyle: 'normal',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginTop: (isNews || isPublication) ? '16px' : 'auto',
                        display: 'block',
                        textAlign: 'left'
                    }}
                >
                    {isVideo ? 'Watch' : isNews ? 'View Article' : isPublication ? 'Open Publication Link' : 'Read More'} →
                </span>
            </div>
        </button>
    );
};

export default ArticleGridCard;