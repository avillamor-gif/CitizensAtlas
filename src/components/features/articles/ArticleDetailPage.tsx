import React from 'react';
import { Article, Page } from '@/types/types';
import { ArrowLeftIcon } from '@/components/ui/icons';

interface ArticleDetailPageProps {
    article: Article;
    onBack: () => void;
    sourcePage: Page;
}

// Helper function to get embeddable video URL
const getEmbedUrl = (url: string): { embedUrl: string; type: 'youtube' | 'facebook' | 'vimeo' | 'unknown' } => {
    if (!url) return { embedUrl: '', type: 'unknown' };

    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
        return {
            embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
            type: 'youtube'
        };
    }

    // Vimeo
    // Examples:
    // - https://vimeo.com/123456789
    // - https://player.vimeo.com/video/123456789
    const vimeoRegex = /(?:vimeo\.com\/)(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:|\/\?)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
        return {
            embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
            type: 'vimeo'
        };
    }

    // Facebook - supports multiple URL formats
    // Examples:
    // - https://www.facebook.com/username/videos/123456789/
    // - https://www.facebook.com/watch/?v=123456789
    // - https://fb.watch/xyz123/
    // - https://www.facebook.com/video.php?v=123456789
    if (url.includes('facebook.com') || url.includes('fb.watch') || url.includes('fb.com')) {
        return {
            embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&width=500&show_text=false&appId`,
            type: 'facebook'
        };
    }

    return { embedUrl: url, type: 'unknown' };
};

const normalizeExternalUrl = (url?: string): string | null => {
    if (!url) return null;
    const trimmed = url.trim();
    if (!trimmed) return null;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
};

const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({ article, onBack, sourcePage }) => {
    const buttonText = sourcePage === 'home' ? 'Back to home' : 'Back to list';
    const videoEmbed = article.videoUrl ? getEmbedUrl(article.videoUrl) : null;
    const publicationLink = normalizeExternalUrl(article.documentUrls?.[0]);

    return (
        <div className="bg-white py-12">
            <div className="container mx-auto px-4 sm:px-8 max-w-4xl">
                <div className="mb-8">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-sm font-semibold text-brand-dark-blue hover:text-brand-light-blue transition-colors"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        {buttonText}
                    </button>
                </div>
                
                <article>
                    <header className="mb-8">
                        <span className="bg-yellow-400 text-sm font-bold px-3 py-1 inline-block mb-4">
                            {article.category}
                        </span>
                        {article.publicationCategory && (
                            <span className="ml-2 bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 inline-block mb-4 rounded">
                                {article.publicationCategory}
                            </span>
                        )}
                        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark-blue leading-tight">
                            {article.title}
                        </h1>
                    </header>
                    
                    {videoEmbed && videoEmbed.embedUrl ? (
                        <div className="mb-8">
                            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                <iframe
                                    src={videoEmbed.embedUrl}
                                    className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title={article.title}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="mb-8">
                            <img 
                                src={article.imageUrl || '/gaia-logo.jpg'} 
                                alt={article.title}
                                className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-lg"
                            />
                        </div>
                    )}

                    <div
                        className="project-brief-content prose prose-lg max-w-none text-gray-800 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: article.description || '' }}
                    />

                    {publicationLink && (
                        <div className="mt-8">
                            <a
                                href={publicationLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-bold text-white bg-brand-dark-blue hover:bg-opacity-80 transition-colors py-2 px-4 rounded-md"
                            >
                                Open Publication Link
                            </a>
                        </div>
                    )}

                    {article.documentNames && article.documentNames.length > 0 && (
                        <div className="mt-12 p-6 bg-gray-50 border rounded-lg">
                            <h3 className="text-xl font-bold text-brand-dark-blue mb-4">Related Documents</h3>
                            <ul className="space-y-2">
                                {article.documentNames.map((doc, index) => {
                                    const docUrl = normalizeExternalUrl(article.documentUrls?.[index] || article.documentUrls?.[0]);
                                    return (
                                        <li key={index}>
                                            <a
                                                href={docUrl || '#'}
                                                target={docUrl ? '_blank' : undefined}
                                                rel={docUrl ? 'noopener noreferrer' : undefined}
                                                className="text-brand-light-blue hover:underline flex items-center gap-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                {doc}
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </article>
            </div>
        </div>
    );
};

export default ArticleDetailPage;