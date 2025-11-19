"use client"

import {
  BadgeCheck,
  ChevronsUpDown,
  LogOut,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"

export function NavUser({
  user,
  onNavigateToProfile,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
  onNavigateToProfile?: () => void
}) {
  const { isMobile } = useSidebar()
  const { signOut } = useAuth()

  // Get user initials for avatar fallback
  const getInitials = () => {
    const name = user.name || user.email
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('NavUser: Logout clicked')
    
    try {
      await signOut()
      console.log('NavUser: signOut completed')
    } catch (error) {
      console.error('NavUser: Error logging out:', error)
    }
    
    // Always redirect after logout attempt
    console.log('NavUser: Redirecting to home...')
    window.location.href = '/'
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-[#0d234f] text-white">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg bg-[#0d234f] text-white">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={onNavigateToProfile} className="cursor-pointer">
                <BadgeCheck />
                Account Profile
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onSelect={async (e) => {
                e.preventDefault();
                console.log('NavUser: Logout menu item clicked');
                try {
                  await signOut();
                  console.log('NavUser: signOut completed');
                } catch (error) {
                  console.error('NavUser: Error logging out:', error);
                }
                // Always redirect after logout attempt
                console.log('NavUser: Redirecting to home...');
                window.location.href = '/';
              }}
              className="cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
