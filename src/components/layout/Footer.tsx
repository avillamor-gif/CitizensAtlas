
import React from 'react';
import Link from 'next/link';
import { SocialIcons } from '@/components/ui/icons';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-white hidden md:block border-t border-gray-800">
            <div className="container mx-auto py-12 px-4 sm:px-8 border-b border-gray-800">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
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
                            <li><Link href="/about" className="text-gray-400 hover:text-brand-medium-blue transition-colors text-sm">About</Link></li>
                            <li><Link href="/publications" className="text-gray-400 hover:text-brand-medium-blue transition-colors text-sm">Publications</Link></li>
                            <li><Link href="/map" className="text-gray-400 hover:text-brand-medium-blue transition-colors text-sm">Map</Link></li>
                            <li><Link href="/partner-with-us" className="text-gray-400 hover:text-brand-medium-blue transition-colors text-sm">Partner with us</Link></li>
                        </ul>
                    </div>

                    {/* Social Section */}
                    <div>
                        <h4 className="text-sm font-bold mb-4 text-white uppercase tracking-wide">Follow us</h4>
                        <SocialIcons />
                    </div>
                </div>
            </div>
            
            <div className="container mx-auto py-6 px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400 space-y-4 sm:space-y-0">
                <p>© 2025 Citizens' Atlas – A collaboration with no-burn.org and AidData</p>
                <div className="flex space-x-6">
                    <Link href="/about" className="hover:text-brand-medium-blue transition-colors">Terms & Support</Link>
                    <Link href="https://no-burn.org" target="_blank" rel="noopener noreferrer" className="hover:text-brand-medium-blue transition-colors">no-burn.org</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
