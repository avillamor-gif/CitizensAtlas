"use client"

import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface HamburgerMenuProps {
  onNavigate?: (path: string) => void;
}

export function HamburgerMenu({ onNavigate }: HamburgerMenuProps) {
  const handleNavigation = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      // Fallback to window.location for backwards compatibility
      window.location.href = path;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleNavigation('/')} className="cursor-pointer">
          Home
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigation('/about')} className="cursor-pointer">
          About
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigation('/what-we-do')} className="cursor-pointer">
          What we do
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigation('/map')} className="cursor-pointer">
          Map
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigation('/partner')} className="cursor-pointer">
          Partner with us
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
