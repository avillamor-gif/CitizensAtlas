
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
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                            </a>
                            <a href="https://www.instagram.com/zerowasteasia/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:transition-colors" style={{ color: 'rgb(156, 163, 175)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--highlight)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'} aria-label="Instagram">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.585-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.585-.012-4.85-.07c-3.252-.149-4.771-1.664-4.919-4.919-.058-1.265-.07-1.644-.07-4.85s.012-3.585.07-4.85c.148-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.441a2.309 2.309 0 100 4.618 2.309 2.309 0 000-4.618zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zm4.949-1.417a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" clipRule="evenodd" /></svg>
                            </a>
                            <a href="https://youtube.com/zerowasteasia" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:transition-colors" style={{ color: 'rgb(156, 163, 175)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--highlight)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'} aria-label="YouTube">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M21.812 6.043c-.249-1.195-1.59-2.133-2.914-2.133-3.902-.3-7.743-.3-11.812-.3-4.068 0-7.91 0-11.812.3-1.324 0-2.665.938-2.914 2.133C1.969 7.238 2 9.119 2 12c0 2.881-.031 4.762.06 5.957.249 1.195 1.59 2.133 2.914 2.133 3.902.3 7.743.3 11.812.3 4.068 0 7.91 0 11.812-.3 1.324 0 2.665-.938 2.914-2.133.092-1.195.06-3.076.06-5.957 0-2.881.031-4.762-.06-5.957zM9.6 15.2V8.8l5.478 3.2L9.6 15.2z" clipRule="evenodd" /></svg>
                            </a>
                            <a href="https://linkedin.com/company/zerowasteasia" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:transition-colors" style={{ color: 'rgb(156, 163, 175)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--highlight)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'} aria-label="LinkedIn">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.731-2.004 1.438-.103.249-.129.597-.129.946v5.421h-3.554s.05-8.736 0-9.646h3.554v1.364c.43-.664 1.199-1.608 2.928-1.608 2.136 0 3.745 1.394 3.745 4.389v5.501zM5.337 9.433c-1.144 0-1.915-.758-1.915-1.704 0-.951.771-1.713 1.906-1.713.948 0 1.915.762 1.924 1.713 0 .946-.976 1.704-1.915 1.704zm1.676 11.019H3.651V9.806h3.362v10.646zM22.094 0H1.906C.851 0 0 .851 0 1.906v20.188C0 23.149.851 24 1.906 24h20.188c1.055 0 1.906-.851 1.906-1.906V1.906C24 .851 23.149 0 22.094 0z" /></svg>
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
