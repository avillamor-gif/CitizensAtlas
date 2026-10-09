'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    publications: '/publications',
    map: '/map',
    'partner-with-us': '/partner-with-us',
    'active-fight-sites': '/active-fight-sites',
    news: '/news',
    videos: '/videos',
};

const NavLink: React.FC<{ href: string; isActive: boolean; children: React.ReactNode }> = ({ href, isActive, children }) => (
    <Link
        href={href}
        className={`pb-1 transition-colors duration-200 ${isActive ? 'border-b-2' : 'text-gray-300 hover:text-white'}`}
        style={{fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 400, ...( isActive ? { color: 'var(--highlight)', borderColor: 'var(--highlight)' } : {})}}
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
            <header className="py-2.5 px-4 sm:px-6 lg:px-16 shadow-lg sticky top-0 z-40 border-b" style={{ backgroundColor: 'var(--deep)', borderColor: 'var(--surface)' }}>
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex-1 flex items-center gap-3">
                        <Image 
                            src="/citizens-atlas-logo.png" 
                            alt="Citizens' Atlas Logo" 
                            width={60}
                            height={60}
                            className="object-contain"
                            priority
                        />
                        <Link href="/" className="text-left block">
                            <h1 className="text-white text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight" style={{fontFamily: "'Fraunces', serif", fontWeight: 600}}>
                                Citizens' Atlas
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-400 leading-tight">on False Solutions to Climate and Circularity</p>
                            <div className="w-1/3 h-0.5 mt-0.5" style={{ backgroundColor: 'var(--highlight)' }}></div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
                        <NavLink href="/about" isActive={isActive('about')}>About</NavLink>
                        <NavLink href="/publications" isActive={isActive('publications')}>Publications</NavLink>
                        <NavLink href="/map" isActive={isActive('map')}>Map</NavLink>
                        <NavLink href="/partner-with-us" isActive={isActive('partner-with-us')}>Partner with us</NavLink>
                        <Link
                            href="/active-fight-sites"
                            className="px-4 py-2 rounded-lg text-gray-900 font-medium transition-colors hover:opacity-90"
                            style={{ backgroundColor: 'var(--highlight)', fontSize: '14px' }}
                        >
                            Active Fight Sites
                        </Link>
                        
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
                        className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6 text-white" />
                        ) : (
                            <Menu className="w-6 h-6 text-white" />
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
                    <div className="md:hidden fixed top-[88px] left-0 right-0 border-b z-50 shadow-lg animate-in slide-in-from-top" style={{ backgroundColor: 'var(--deep)', borderColor: 'var(--surface)' }}>
                        <nav className="flex flex-col p-6 space-y-1">
                        <Link
                            href="/about"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`text-left py-2.5 px-4 rounded-lg font-medium transition-colors ${
                                isActive('about')
                                    ? 'text-white' 
                                    : 'text-gray-300 hover:bg-opacity-50 active:bg-opacity-70'
                            }`}
                            style={isActive('about') ? { backgroundColor: 'var(--surface)' } : {}}
                        >
                            About
                        </Link>
                        <Link
                            href="/publications"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`text-left py-2.5 px-4 rounded-lg font-medium transition-colors ${
                                isActive('publications')
                                    ? 'text-white' 
                                    : 'text-gray-300 hover:bg-opacity-50 active:bg-opacity-70'
                            }`}
                            style={isActive('publications') ? { backgroundColor: 'var(--surface)' } : {}}
                        >
                            Publications
                        </Link>
                        <Link
                            href="/map"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`text-left py-2.5 px-4 rounded-lg font-medium transition-colors ${
                                isActive('map')
                                    ? 'text-white' 
                                    : 'text-gray-300 hover:bg-opacity-50 active:bg-opacity-70'
                            }`}
                            style={isActive('map') ? { backgroundColor: 'var(--surface)' } : {}}
                        >
                            Map
                        </Link>
                        <Link
                            href="/partner-with-us"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`text-left py-2.5 px-4 rounded-lg font-medium transition-colors ${
                                isActive('partner-with-us')
                                    ? 'text-white' 
                                    : 'text-gray-300 hover:bg-opacity-50 active:bg-opacity-70'
                            }`}
                            style={isActive('partner-with-us') ? { backgroundColor: 'var(--surface)' } : {}}
                        >
                            Partner with us
                        </Link>
                        <Link
                            href="/active-fight-sites"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-left py-2.5 px-4 rounded-lg font-medium transition-colors text-gray-900 hover:opacity-90"
                            style={{ backgroundColor: 'var(--highlight)' }}
                        >
                            Active Fight Sites
                        </Link>

                        {/* Mobile User Section */}
                        <div className="pt-4 border-t" style={{ borderColor: 'var(--surface)' }}>
                            {resolvedUser ? (
                                <Link 
                                    href="/admin/account-profile" 
                                    className="flex items-center space-x-3 py-2.5 px-4 rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={resolvedUser.avatar_url} alt={resolvedUser.full_name} />
                                        <AvatarFallback className="bg-brand-medium-blue text-white">
                                            {getInitials(resolvedUser.full_name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-white">{resolvedUser.full_name}</p>
                                        <p className="text-sm text-gray-400">Admin Dashboard</p>
                                    </div>
                                </Link>
                            ) : (
                                <Link 
                                    href="/auth/login"
                                    className="flex items-center space-x-3 py-2.5 px-4 rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <div className="p-2 bg-gray-800 rounded-full">
                                        <UserIcon className="w-6 h-6 text-gray-300" />
                                    </div>
                                    <span className="font-medium text-gray-300">Login</span>
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