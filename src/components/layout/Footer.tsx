
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
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                            </a>
                            <a href="https://www.instagram.com/zerowasteasia/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:transition-colors" style={{ color: 'rgb(156, 163, 175)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--highlight)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'} aria-label="Instagram">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>
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
