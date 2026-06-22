
import React, { useRef } from 'react';
import Link from 'next/link';
import { Article } from '@/types/types';
import { ArrowLeftIcon, ArrowRightIcon, PlayIcon } from '@/components/ui/icons';
// FIX: Corrected import path for Page type. It's now imported from `../types` to avoid circular dependencies.
import { Page } from '@/types/types';

interface ArticleCardProps {
    item: Article;
    hasBackground: boolean;
    onViewArticle: (article: Article) => void;
    isVideo?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ item, hasBackground, onViewArticle, isVideo = false }) => (
    <div className="flex-shrink-0 w-72">
        <button 
            onClick={() => onViewArticle(item)}
            className="w-full text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-yellow rounded-lg"
        >
            <div className="bg-gray-300 h-40 mb-2 overflow-hidden rounded-lg relative">
                <img src={item.imageUrl || 'https://picsum.photos/400/300'} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all duration-300">
                        <div className="bg-white bg-opacity-90 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                            <PlayIcon className="w-10 h-10 text-brand-dark-blue" />
                        </div>
                    </div>
                )}
            </div>
            <div className="p-1">
                <span className="bg-yellow-400 text-xs font-bold px-2 py-1 inline-block mb-2">{item.category}</span>
                <h4 className={`${hasBackground ? 'text-brand-dark-blue' : 'text-white'} font-bold group-hover:text-brand-light-blue transition-colors`}>{item.title}</h4>
            </div>
        </button>
    </div>
);

interface ContentCarouselProps {
    title: string;
    items: Article[];
    hasBackground?: boolean;
    onNavigate?: (page: Page) => void;
    page?: Page;
    onViewArticle: (article: Article) => void;
    isVideoCarousel?: boolean;
}

const ContentCarousel: React.FC<ContentCarouselProps> = ({ title, items, hasBackground = true, onNavigate, page, onViewArticle, isVideoCarousel = false }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleScroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 320; // Card width (w-72) + space (space-x-8)
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const textColor = hasBackground ? 'text-white' : 'text-brand-dark-blue';
    const borderColor = hasBackground ? 'border-white' : 'border-gray-400';
    const hoverColor = hasBackground ? 'hover:bg-white hover:text-brand-dark-blue' : 'hover:bg-gray-200';

    return (
        <section className="py-12 px-4 sm:px-8 lg:px-16">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className={`text-3xl font-extrabold ${textColor}`}>{title}</h2>
                        <div className={`w-16 h-1 mt-2 ${hasBackground ? 'bg-white' : 'bg-brand-dark-blue'}`}></div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {page && (
                             <Link
                                href={`/${page}`}
                                className={`text-xs sm:text-sm font-semibold py-1.5 px-3 sm:py-2 sm:px-6 rounded-full border-2 transition ${borderColor} ${textColor} ${hoverColor}`}
                            >
                                Read All
                            </Link>
                        )}
                        <div className="hidden md:flex items-center space-x-2">
                             <button
                                onClick={() => handleScroll('left')}
                                aria-label="Scroll left"
                                className={`p-2 rounded-full border transition ${borderColor} ${textColor} ${hoverColor}`}
                            >
                                <ArrowLeftIcon className="w-5 h-5"/>
                            </button>
                            <button
                                onClick={() => handleScroll('right')}
                                aria-label="Scroll right"
                                className={`p-2 rounded-full border transition ${borderColor} ${textColor} ${hoverColor}`}
                            >
                                <ArrowRightIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    </div>
                </div>
                <div ref={scrollContainerRef} className="flex space-x-8 overflow-x-auto pb-4 -mb-4">
                    {items.map(item => (
                        <ArticleCard key={item.id} item={item} hasBackground={!hasBackground} onViewArticle={onViewArticle} isVideo={isVideoCarousel} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ContentCarousel;