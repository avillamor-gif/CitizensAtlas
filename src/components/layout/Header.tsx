import React from 'react';
import Link from 'next/link';
// FIX: Import Page from types.ts to fix circular dependency
import { Page, User } from '@/types/types';
import { UserIcon } from '@/components/ui/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HeaderProps {
    activePage: Page;
    onNavigate: (page: Page) => void;
    currentUser?: User;
}

const NavButton: React.FC<{ page: Page; activePage: Page; onNavigate: (page: Page) => void; children: React.ReactNode }> = ({ page, activePage, onNavigate, children }) => {
    const isActive = page === activePage;
    return (
        <button
            onClick={() => onNavigate(page)}
            className={`font-medium pb-1 transition-colors duration-200 ${isActive ? 'text-brand-dark-blue border-b-2 border-brand-dark-blue' : 'text-gray-700 hover:text-brand-dark-blue'}`}
        >
            {children}
        </button>
    );
};

const Header: React.FC<HeaderProps> = ({ activePage, onNavigate, currentUser }) => {
    // Get user initials for avatar fallback
    const getInitials = (name?: string) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className="bg-white py-4 px-4 sm:px-8 lg:px-16 shadow-md sticky top-0 z-40">
            <div className="container mx-auto flex justify-between items-center">
                <div>
                    <button onClick={() => onNavigate('home')} className="text-left">
                        <h1 className="text-colo-[#132856] text-2xl md:text-3xl font-extrabold text-brand-dark-blue tracking-tight">CITIZENS' ATLAS</h1>
                        <p className="text-sm text-gray-600">on False Solutions to Climate and Circularity</p>
                        <div className="w-1/3 h-1 bg-brand-dark-blue mt-1"></div>
                    </button>
                </div>
                <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
                    <NavButton page="about" activePage={activePage} onNavigate={onNavigate}>About</NavButton>
                    <NavButton page="what-we-do" activePage={activePage} onNavigate={onNavigate}>What we do</NavButton>
                    <NavButton page="map" activePage={activePage} onNavigate={onNavigate}>Map</NavButton>
                    <NavButton page="partner-with-us" activePage={activePage} onNavigate={onNavigate}>Partner with us</NavButton>
                    
                    {/* User Avatar or Login Link */}
                    {currentUser ? (
                        <Link href="/admin" className="flex items-center">
                            <Avatar className="h-9 w-9 cursor-pointer hover:opacity-80 transition-opacity">
                                <AvatarImage src={currentUser.avatar_url} alt={currentUser.full_name} />
                                <AvatarFallback className="bg-brand-dark-blue text-white">
                                    {getInitials(currentUser.full_name)}
                                </AvatarFallback>
                            </Avatar>
                        </Link>
                    ) : (
                        <Link 
                            href="/auth/login"
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            title="Login"
                        >
                            <UserIcon className="w-6 h-6 text-gray-700" />
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;