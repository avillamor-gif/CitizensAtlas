'use client';

import React, { useState } from 'react';
import Link from 'next/link';
// FIX: Import Page from types.ts to fix circular dependency
import { Page, User } from '@/types/types';
import { UserIcon } from '@/components/ui/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, X } from 'lucide-react';

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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    const handleNavigation = (page: Page) => {
        onNavigate(page);
        setIsMobileMenuOpen(false); // Close mobile menu on navigation
    };

    return (
        <>
            <header className="bg-white py-2.5 px-4 sm:px-6 lg:px-16 shadow-md sticky top-0 z-40">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex-1">
                        <button onClick={() => handleNavigation('home')} className="text-left">
                            <h1 className="text-brand-dark-blue text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight" style={{fontFamily: "'Sora', sans-serif", fontVariant: 'small-caps'}}>
                                CITIZENS' ATLAS
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-600 leading-tight">on False Solutions to Climate and Circularity</p>
                            <div className="w-1/3 h-0.5 bg-brand-dark-blue mt-0.5"></div>
                        </button>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
                        <NavButton page="about" activePage={activePage} onNavigate={onNavigate}>About</NavButton>
                        <NavButton page="what-we-do" activePage={activePage} onNavigate={onNavigate}>What we do</NavButton>
                        <NavButton page="publications" activePage={activePage} onNavigate={onNavigate}>Publications</NavButton>
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
                        <button
                            onClick={() => handleNavigation('about')}
                            className={`text-left py-2.5 px-4 rounded-lg font-medium transition-colors ${
                                activePage === 'about' 
                                    ? 'bg-brand-dark-blue text-white' 
                                    : 'text-gray-700 hover:bg-gray-300 active:bg-gray-400'
                            }`}
                        >
                            About
                        </button>
                        <button
                            onClick={() => handleNavigation('what-we-do')}
                            className={`text-left py-2.5 px-4 rounded-lg font-medium transition-colors ${
                                activePage === 'what-we-do' 
                                    ? 'bg-brand-dark-blue text-white' 
                                    : 'text-gray-700 hover:bg-gray-300 active:bg-gray-400'
                            }`}
                        >
                            What we do
                        </button>
                        <button
                            onClick={() => handleNavigation('publications')}
                            className={`text-left py-2.5 px-4 rounded-lg font-medium transition-colors ${
                                activePage === 'publications' 
                                    ? 'bg-brand-dark-blue text-white' 
                                    : 'text-gray-700 hover:bg-gray-300 active:bg-gray-400'
                            }`}
                        >
                            Publications
                        </button>
                        <button
                            onClick={() => handleNavigation('map')}
                            className={`text-left py-2.5 px-4 rounded-lg font-medium transition-colors ${
                                activePage === 'map' 
                                    ? 'bg-brand-dark-blue text-white' 
                                    : 'text-gray-700 hover:bg-gray-300 active:bg-gray-400'
                            }`}
                        >
                            Map
                        </button>
                        <button
                            onClick={() => handleNavigation('partner-with-us')}
                            className={`text-left py-2.5 px-4 rounded-lg font-medium transition-colors ${
                                activePage === 'partner-with-us' 
                                    ? 'bg-brand-dark-blue text-white' 
                                    : 'text-gray-700 hover:bg-gray-300 active:bg-gray-400'
                            }`}
                        >
                            Partner with us
                        </button>

                        {/* Mobile User Section */}
                        <div className="pt-4 border-t border-gray-200">
                            {currentUser ? (
                                <Link 
                                    href="/admin" 
                                    className="flex items-center space-x-3 py-2.5 px-4 rounded-lg hover:bg-gray-300 active:bg-gray-400 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={currentUser.avatar_url} alt={currentUser.full_name} />
                                        <AvatarFallback className="bg-brand-dark-blue text-white">
                                            {getInitials(currentUser.full_name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-gray-900">{currentUser.full_name}</p>
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