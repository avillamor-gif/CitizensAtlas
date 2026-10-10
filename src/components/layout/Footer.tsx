
import React from 'react';
import Link from 'next/link';
import { SocialIcons } from '@/components/ui/icons';

const Footer: React.FC = () => {
    return (
        <footer className="text-white hidden md:block border-t" style={{ backgroundColor: 'var(--deep)', borderColor: 'var(--surface)' }}>
            <div className="container mx-auto py-12 px-4 sm:px-8 border-b" style={{ borderColor: 'var(--surface)' }}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-white">Citizens' Atlas</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Tracking false solutions to waste. Making development finance visible across the Asia-Pacific region.
                        </p>
                    </div>
                    
                    {/* Links Section */}
                    <div>
                        <h4 className="text-sm font-bold mb-4 text-white uppercase tracking-wide">About the Atlas</h4>
                        <ul className="space-y-2">
                            <li><Link href="/about" className="text-gray-400 hover:transition-colors text-sm" style={{ color: 'rgb(156, 163, 175)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--highlight)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}>About</Link></li>
                            <li><Link href="/publications" className="text-gray-400 hover:transition-colors text-sm" style={{ color: 'rgb(156, 163, 175)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--highlight)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}>Publications</Link></li>
                            <li><Link href="/map" className="text-gray-400 hover:transition-colors text-sm" style={{ color: 'rgb(156, 163, 175)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--highlight)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}>Map</Link></li>
                            <li><Link href="/partner-with-us" className="text-gray-400 hover:transition-colors text-sm" style={{ color: 'rgb(156, 163, 175)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--highlight)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}>Partner with us</Link></li>
                        </ul>
                    </div>

                    {/* Social Section */}
                    <div>
                        <h4 className="text-sm font-bold mb-4 text-white uppercase tracking-wide">Follow us</h4>
                        <SocialIcons />
                    </div>

                    {/* Stay Informed Section */}
                    <div>
                        <h4 className="text-sm font-bold mb-4 text-white uppercase tracking-wide">Stay Informed</h4>
                        <ul className="space-y-2">
                            <li><Link href="#" className="text-gray-400 hover:transition-colors text-sm" style={{ color: 'rgb(156, 163, 175)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--highlight)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}>Newsletter</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:transition-colors text-sm" style={{ color: 'rgb(156, 163, 175)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--highlight)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}>Subscribe</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div className="container mx-auto py-6 px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400 space-y-4 sm:space-y-0">
                <p>© 2025 Citizens' Atlas – A collaboration with no-burn.org and AidData</p>
                <div className="flex space-x-6">
                    <Link href="/about" className="transition-colors text-gray-400" style={{ color: 'rgb(156, 163, 175)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--highlight)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}>Terms & Support</Link>
                    <Link href="https://no-burn.org" target="_blank" rel="noopener noreferrer" className="transition-colors text-gray-400" style={{ color: 'rgb(156, 163, 175)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--highlight)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}>no-burn.org</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
