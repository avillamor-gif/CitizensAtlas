import React from 'react';
import { Article } from '@/types/types';
import { DownloadIcon, PlayIcon } from '@/components/ui/icons';

interface ArticleGridCardProps {
    item: Article;
    onViewArticle: (article: Article) => void;
    pageTitle: string;
    onDownload?: (articleId: number) => void;
}

const ArticleGridCard: React.FC<ArticleGridCardProps> = ({ item, onViewArticle, pageTitle, onDownload }) => {
    const isPublicationWithDocs = pageTitle === 'Publications' && onDownload && item.documentNames && item.documentNames.length > 0;
    const isVideo = pageTitle === 'Videos';
    
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden group">
            <div className="h-48 overflow-hidden relative">
                <img src={item.imageUrl || '/gaia-logo.jpg'} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all duration-300">
                        <div className="bg-white bg-opacity-90 rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                            <PlayIcon className="w-12 h-12 text-brand-dark-blue" />
                        </div>
                    </div>
                )}
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <span className="bg-yellow-400 text-xs font-bold px-2 py-1 inline-block mb-3 self-start">
                    {item.category}
                </span>
                <h3 className="text-lg font-bold text-brand-dark-blue mb-2 flex-grow">{item.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {item.description}
                </p>
                {isPublicationWithDocs ? (
                    <button
                        onClick={() => onDownload(item.id)}
                        className="flex items-center gap-2 text-sm font-bold text-white bg-brand-dark-blue hover:bg-opacity-80 transition-colors mt-auto self-start text-left py-2 px-4 rounded-md"
                    >
                        <DownloadIcon className="w-4 h-4" />
                        Download ({item.downloadCount?.toLocaleString() || 0})
                    </button>
                ) : (
                    <button 
                        onClick={() => onViewArticle(item)}
                        className="text-sm font-bold text-brand-light-blue hover:underline mt-auto self-start text-left"
                    >
                        Read More &rarr;
                    </button>
                )}
            </div>
        </div>
    );
};

export default ArticleGridCard;