'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Page, User } from '@/types/types';
import { UserIcon } from '@/components/ui/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
    currentUser?: User;
    // Kept for backward compat — no longer used for navigation
    activePage?: Page;
    onNavigate?: (page: Page) => void;
}

const pageToPath: Record<string, string> = {
    about: '/about',
    'what-we-do': '/what-we-do',
    publications: '/publications',
    map: '/map',
    'partner-with-us': '/partner-with-us',
    news: '/news',
    videos: '/videos',
};

const NavLink: React.FC<{ href: string; isActive: boolean; children: React.ReactNode }> = ({ href, isActive, children }) => (
    <Link
        href={href}
        className={`font-medium pb-1 transition-colors duration-200 ${isActive ? 'text-brand-dark-blue border-b-2 border-brand-dark-blue' : 'text-gray-700 hover:text-brand-dark-blue'}`}
    >
        {children}
    </Link>
);

const Header: React.FC<HeaderProps> = ({ currentUser, activePage }) => {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user: authUser } = useAuth();
    const resolvedUser = currentUser ?? authUser ?? undefined;

    const isActive = (page: string) => {
        const path = pageToPath[page];
        // Use pathname for path-based pages, fall back to activePage prop for SPA usage
        if (path) return pathname === path || activePage === page;
        return activePage === page;
    };

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
        <>
            <header className="bg-white py-2.5 px-4 sm:px-6 lg:px-16 shadow-md sticky top-0 z-40">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex-1">
                        <Link href="/" className="text-left block">
                            <h1 className="text-brand-dark-blue text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight" style={{fontFamily: "'Sora', sans-serif", fontVariantCaps: 'small-caps'}}>
                                CITIZENS' ATLAS
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-600 leading-tight">on False Solutions to Climate and Circularity</p>
                            <div className="w-1/3 h-0.5 bg-brand-dark-blue mt-0.5"></div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
                        <NavLink href="/about" isActive={isActive('about')}>About</NavLink>
                        <NavLink href="/what-we-do" isActive={isActive('what-we-do')}>What we do</NavLink>
                        <NavLink href="/publications" isActive={isActive('publications')}>Publications</NavLink>
                        <NavLink href="/map" isActive={isActive('map')}>Map</NavLink>
                        <NavLink href="/partner-with-us" isActive={isActive('partner-with-us')}>Partner with us</NavLink>
                        
                        {/* User Avatar or Login Link */}
                        {resolvedUser ? (
                            <Link href="/admin/account-profile" className="flex items-center">
                                <Avatar className="h-9 w-9 cursor-pointer hover:opacity-80 transition-opacity">
                                    <AvatarImage src={resolvedUser.avatar_url} alt={resolvedUser.full_name} />
                                    <AvatarFallback className="bg-brand-dark-blue text-white">
                                        {getInitials(resolvedUser.full_name)}
                                    </AvatarFallback>
                                </Avatar>
                            </Link>
                        ) : (
                            <Link 
                                href="/auth/login"
                                className="p-2 rounded-full bg-brand-dark-blue hover:bg-opacity-90 transition-colors"
                                title="Login"
                            >
                                <UserIcon className="w-6 h-6 text-white" />
                            </Link>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6 text-gray-700" />
                        ) : (
                            <Menu className="w-6 h-6 text-gray-700" />
                        )}
                    </button>
                </div>
            </header>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="md:hidden fixed inset-0 top-[88px] bg-black/50 z-40"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    {/* Menu Content */}
                    <div className="md:hidden fixed top-[88px] left-0 right-0 bg-white z-50 shadow-lg animate-in slide-in-from-top">
                        <nav className="flex flex-col p-6 space-y-1">
                        <Link
                            href="/about"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`text-left py-2.5 px-4 rounded-lg font-medium transition-colors ${
                                isActive('about')
                                    ? 'bg-brand-dark-blue text-white' 
                                    : 'text-gray-700 hover:bg-gray-300 active:bg-gray-400'
                            }`}
                        >
                            About
                        </Link>
                        <Link
                            href="/what-we-do"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`text-left py-2.5 px-4 rounded-lg font-medium transition-colors ${
                                isActive('what-we-do')
                                    ? 'bg-brand-dark-blue text-white' 
                                    : 'text-gray-700 hover:bg-gray-300 active:bg-gray-400'
                            }`}
                        >
                            What we do
                        </Link>
                        <Link
                            href="/publications"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`text-left py-2.5 px-4 rounded-lg font-medium transition-colors ${
                                isActive('publications')
                                    ? 'bg-brand-dark-blue text-white' 
                                    : 'text-gray-700 hover:bg-gray-300 active:bg-gray-400'
                            }`}
                        >
                            Publications
                        </Link>
                        <Link
                            href="/map"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`text-left py-2.5 px-4 rounded-lg font-medium transition-colors ${
                                isActive('map')
                                    ? 'bg-brand-dark-blue text-white' 
                                    : 'text-gray-700 hover:bg-gray-300 active:bg-gray-400'
                            }`}
                        >
                            Map
                        </Link>
                        <Link
                            href="/partner-with-us"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`text-left py-2.5 px-4 rounded-lg font-medium transition-colors ${
                                isActive('partner-with-us')
                                    ? 'bg-brand-dark-blue text-white' 
                                    : 'text-gray-700 hover:bg-gray-300 active:bg-gray-400'
                            }`}
                        >
                            Partner with us
                        </Link>

                        {/* Mobile User Section */}
                        <div className="pt-4 border-t border-gray-200">
                            {resolvedUser ? (
                                <Link 
                                    href="/admin/account-profile" 
                                    className="flex items-center space-x-3 py-2.5 px-4 rounded-lg hover:bg-gray-300 active:bg-gray-400 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={resolvedUser.avatar_url} alt={resolvedUser.full_name} />
                                        <AvatarFallback className="bg-brand-dark-blue text-white">
                                            {getInitials(resolvedUser.full_name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-gray-900">{resolvedUser.full_name}</p>
                                        <p className="text-sm text-gray-500">Admin Dashboard</p>
                                    </div>
                                </Link>
                            ) : (
                                <Link 
                                    href="/auth/login"
                                    className="flex items-center space-x-3 py-2.5 px-4 rounded-lg hover:bg-gray-300 active:bg-gray-400 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <div className="p-2 bg-gray-100 rounded-full">
                                        <UserIcon className="w-6 h-6 text-gray-700" />
                                    </div>
                                    <span className="font-medium text-gray-900">Login</span>
                                </Link>
                            )}
                        </div>
                    </nav>
                    </div>
                </>
            )}
        </>
    );
};

export default Header;