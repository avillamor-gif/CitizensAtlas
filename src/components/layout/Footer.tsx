
import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
    return (
        <footer className="text-white hidden md:block border-t" style={{ backgroundColor: 'var(--deep)', borderColor: 'var(--surface)' }}>
            <div className="container mx-auto py-12 px-4 sm:px-8 border-b" style={{ borderColor: 'var(--surface)' }}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    {/* About Section */}
                    <div>
                        <h3 className="mb-4 text-white">Citizens Atlas</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Tracking false solutions to waste. Making development finance visible across the Asia-Pacific region.
                        </p>
                    </div>
                    
                    {/* Links Section */}
                    <div>
                        <h4 className="mb-4 text-white uppercase tracking-wide">About the Atlas</h4>
                        <ul className="space-y-2">
                            <li><Link href="/about" className="text-gray-400 hover:transition-colors text-sm" style={{ color: 'rgb(156, 163, 175)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--highlight)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}>About</Link></li>
                            <li><Link href="/publications" className="text-gray-400 hover:transition-colors text-sm" style={{ color: 'rgb(156, 163, 175)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--highlight)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}>Publications</Link></li>
                            <li><Link href="/map" className="text-gray-400 hover:transition-colors text-sm" style={{ color: 'rgb(156, 163, 175)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--highlight)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}>Map</Link></li>
                            <li><Link href="/partner-with-us" className="text-gray-400 hover:transition-colors text-sm" style={{ color: 'rgb(156, 163, 175)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--highlight)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}>Expose a False Solution!</Link></li>
                        </ul>
                    </div>

                    {/* Social Section */}
                    <div>
                        <h4 className="mb-4 text-white uppercase tracking-wide">Follow us</h4>
                        <div className="flex items-center space-x-4">
                            <a href="https://www.facebook.com/GAIAAsiaPacific/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:transition-colors" style={{ color: 'rgb(156, 163, 175)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--highlight)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'} aria-label="Facebook">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5c-.563-.074-2.313-.25-4.369-.25-4.814 0-7.288 2.993-7.288 8.496v2.854z"/></svg>
                            </a>
                            <a href="https://www.instagram.com/zerowasteasia/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:transition-colors" style={{ color: 'rgb(156, 163, 175)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--highlight)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'} aria-label="Instagram">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85 0 3.204-.012 3.584-.07 4.85-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.85-.07-3.252-.149-4.771-1.664-4.919-4.919-.058-1.265-.07-1.644-.07-4.85 0-3.204.012-3.584.07-4.85.148-3.225 1.664-4.771 4.919-4.919 1.266-.058 1.644-.07 4.85-.07zm0 1.441c-3.122 0-3.465.012-4.677.07-2.267.102-3.505 1.37-3.608 3.608-.058 1.211-.07 1.555-.07 4.677 0 3.122.012 3.465.07 4.677.102 2.267 1.37 3.505 3.608 3.608 1.211.058 1.555.07 4.677.07 3.122 0 3.465-.012 4.677-.07 2.267-.102 3.505-1.37 3.608-3.608.058-1.211.07-1.555.07-4.677 0-3.122-.012-3.465-.07-4.677-.102-2.267-1.371-3.505-3.608-3.608-1.212-.058-1.555-.07-4.677-.07zm0 2.409a2.748 2.748 0 100 5.496 2.748 2.748 0 000-5.496zm0 4.528a1.78 1.78 0 110 3.56 1.78 1.78 0 010-3.56zm3.53-4.728a.642.642 0 110 1.284.642.642 0 010-1.284z"/></svg>
                            </a>
                            <a href="https://youtube.com/zerowasteasia" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:transition-colors" style={{ color: 'rgb(156, 163, 175)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--highlight)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'} aria-label="YouTube">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                            </a>
                            <a href="https://linkedin.com/company/zerowasteasia" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:transition-colors" style={{ color: 'rgb(156, 163, 175)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--highlight)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'} aria-label="LinkedIn">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>
                            </a>
                        </div>
                    </div>

                    {/* Stay Informed Section */}
                    <div>
                        <h4 className="mb-4 text-white uppercase tracking-wide">Stay Informed</h4>
                        <ul className="space-y-2">
                            <li><Link href="#" className="text-gray-400 hover:transition-colors text-sm" style={{ color: 'rgb(156, 163, 175)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--highlight)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}>Newsletter</Link></li>
                            <li><Link href="https://www.no-burn.org/join-gaia/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:transition-colors text-sm" style={{ color: 'rgb(156, 163, 175)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--highlight)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}>Subscribe</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div className="container mx-auto py-6 px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400 space-y-4 sm:space-y-0">
                <p>@ 2026. An initiative of GAIA Asia Pacific.</p>
                <div className="flex space-x-6">
                    <Link href="/about" className="transition-colors text-gray-400" style={{ color: 'rgb(156, 163, 175)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--highlight)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}>Terms & Support</Link>
                    <Link href="https://no-burn.org" target="_blank" rel="noopener noreferrer" className="transition-colors text-gray-400" style={{ color: 'rgb(156, 163, 175)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--highlight)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}>no-burn.org</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
