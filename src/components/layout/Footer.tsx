
import React from 'react';
import { SocialIcons } from '@/components/ui/icons';

const Footer: React.FC = () => {
    return (
        <footer className="bg-black text-white hidden md:block">
            <div className="container mx-auto py-8 px-4 sm:px-8 text-center border-b border-gray-700">
                <h3 className="text-lg font-bold mb-4">Join the conversation on social media</h3>
                <div className="flex justify-center">
                    <SocialIcons />
                </div>
            </div>
            <div className="container mx-auto py-4 px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
                <p>Terms & Support</p>
                <p>no-burn.org</p>
            </div>
        </footer>
    );
};

export default Footer;
