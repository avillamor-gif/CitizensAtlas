"use client"

import * as React from "react"
import {
  Newspaper,
  FileText,
  Film,
  LayoutGrid,
  BarChart3,
  Upload,
  Users,
  Shield,
  FolderOpen,
  Plus,
  List,
  Tags,
  ChevronRight,
  Briefcase,
} from "lucide-react"

import { NavMainAdmin } from "./NavMainAdmin"
import { NavUser } from "@/components/navigation/nav-user"
import { hasPermission } from "@/hooks/useRolePermissions"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"

export type AdminPage = 'projects-list' | 'projects-analytics' | 'projects-add' | 'projects-edit' | 'project-briefs-list' | 'project-briefs-add' | 'project-briefs-edit' | 'news-list' | 'news-categories' | 'news-add' | 'news-edit' | 'publications-list' | 'publications-types' | 'publications-add' | 'publications-edit' | 'videos-list' | 'videos-categories' | 'videos-add' | 'videos-edit' | 'drafts-projects' | 'drafts-news' | 'drafts-publications' | 'drafts-videos' | 'pending-approvals' | 'batch-upload' | 'team-management' | 'role-management' | 'account-profile';

interface AdminSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activePage: AdminPage;
  setActivePage: (page: AdminPage) => void;
  currentUser?: any;
}

export function AdminSidebar({ activePage, setActivePage, currentUser, ...props }: AdminSidebarProps) {
  const userRole = currentUser?.role;
  
  // If no user is provided, render a minimal sidebar
  if (!currentUser) {
    console.warn('⚠️ [AdminSidebar] No currentUser provided');
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" className="bg-sidebar-accent hover:bg-sidebar-accent cursor-default">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#0d234f] text-white">
                  <LayoutGrid className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Citizens' Atlas</span>
                  <span className="truncate text-xs">Admin Dashboard</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <div className="p-4 text-center text-gray-500">
            <p>Please log in to access admin functions</p>
          </div>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    )
  }
  
  // Check permissions based on database role
  const canViewProjects = hasPermission(userRole, 'View/Edit Projects');
  const canViewNews = hasPermission(userRole, 'View/Edit News');
  const canViewPublications = hasPermission(userRole, 'View/Edit Publications');
  const canViewVideos = hasPermission(userRole, 'View/Edit Videos');
  const canViewAnalytics = hasPermission(userRole, 'View Analytics');
  const canManageCategories = hasPermission(userRole, 'Manage Categories/Types');
  const canBatchUpload = hasPermission(userRole, 'Batch Upload');
  const canApproveDrafts = hasPermission(userRole, 'Pending Approvals');
  const canManageTeam = hasPermission(userRole, 'Team Management');
  const canManageRoles = hasPermission(userRole, 'Role Management');

  // Build navigation items based on permissions
  const navItems = [];
  
  // Projects section
  if (canViewProjects) {
    navItems.push({
      title: "Projects",
      icon: LayoutGrid,
      isActive: activePage.startsWith('projects'),
      items: [
        {
          title: "Project List",
          page: "projects-list" as AdminPage,
          icon: List,
        },
        {
          title: "Add Project",
          page: "projects-add" as AdminPage,
          icon: Plus,
        },
        ...(canViewAnalytics ? [{
          title: "Analytics",
          page: "projects-analytics" as AdminPage,
          icon: BarChart3,
        }] : []),
      ],
    });
    
    // Project Briefs submenu
    navItems.push({
      title: "Project Briefs",
      icon: Briefcase,
      isActive: activePage.startsWith('project-briefs'),
      items: [
        {
          title: "Briefs List",
          page: "project-briefs-list" as AdminPage,
          icon: List,
        },
        {
          title: "Add Brief",
          page: "project-briefs-add" as AdminPage,
          icon: Plus,
        },
      ],
    });
  }
  
  // News section
  if (canViewNews) {
    navItems.push({
      title: "News Updates",
      icon: Newspaper,
      isActive: activePage.startsWith('news'),
      items: [
        {
          title: "News List",
          page: "news-list" as AdminPage,
          icon: List,
        },
        {
          title: "Add News",
          page: "news-add" as AdminPage,
          icon: Plus,
        },
        ...(canManageCategories ? [{
          title: "Categories",
          page: "news-categories" as AdminPage,
          icon: Tags,
        }] : []),
      ],
    });
  }
  
  // Publications section
  if (canViewPublications) {
    navItems.push({
      title: "Publications",
      icon: FileText,
      isActive: activePage.startsWith('publications'),
      items: [
        {
          title: "Publication List",
          page: "publications-list" as AdminPage,
          icon: List,
        },
        {
          title: "Add Publication",
          page: "publications-add" as AdminPage,
          icon: Plus,
        },
        ...(canManageCategories ? [{
          title: "Publication Types",
          page: "publications-types" as AdminPage,
          icon: Tags,
        }] : []),
      ],
    });
  }
  
  // Videos section
  if (canViewVideos) {
    navItems.push({
      title: "Videos",
      icon: Film,
      isActive: activePage.startsWith('videos'),
      items: [
        {
          title: "Video List",
          page: "videos-list" as AdminPage,
          icon: List,
        },
        {
          title: "Add Video",
          page: "videos-add" as AdminPage,
          icon: Plus,
        },
        ...(canManageCategories ? [{
          title: "Categories",
          page: "videos-categories" as AdminPage,
          icon: Tags,
        }] : []),
      ],
    });
  }

  // Add admin items based on permissions
  const adminItems = [];
  if (canBatchUpload) {
    adminItems.push({
      title: "Batch Upload",
      page: "batch-upload" as AdminPage,
      icon: Upload,
    });
  }

  // Pending Approvals
  if (canApproveDrafts) {
    adminItems.push({
      title: "Pending Approvals",
      page: "pending-approvals" as AdminPage,
      icon: FolderOpen,
    });
  }

  // Team Management with Role Management submenu
  const teamManagementItems = [];
  if (canManageTeam || canManageRoles) {
    teamManagementItems.push({
      title: "Team Management",
      icon: Users,
      isActive: activePage === 'team-management' || activePage === 'role-management',
      items: [
        ...(canManageTeam ? [{
          title: "Manage Team",
          page: "team-management" as AdminPage,
          icon: Users,
        }] : []),
        ...(canManageRoles ? [{
          title: "Role Management",
          page: "role-management" as AdminPage,
          icon: Shield,
        }] : []),
      ],
    });
  }

  const userData = currentUser ? {
    name: currentUser.full_name || currentUser.email || "User",
    email: currentUser.email || "",
    avatar: currentUser.avatar_url || "",
  } : {
    name: "Guest",
    email: "",
    avatar: "",
  };

  // Debug: Log what's being generated
  console.log('🔍 [AdminSidebar] User role:', userRole);
  console.log('🔍 [AdminSidebar] Permissions check results:', {
    canViewProjects,
    canViewNews, 
    canViewPublications,
    canViewVideos,
    canViewAnalytics,
    canManageCategories,
    canBatchUpload,
    canApproveDrafts,
    canManageTeam,
    canManageRoles
  });
  console.log('🔍 [AdminSidebar] Generated nav items:', navItems);
  console.log('🔍 [AdminSidebar] Generated admin items:', adminItems);
  console.log('🔍 [AdminSidebar] Generated team management items:', teamManagementItems);

  console.log('👤 AdminSidebar userData:', { 
    currentUser, 
    avatar: currentUser?.avatar_url,
    userData 
  });

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="bg-sidebar-accent hover:bg-sidebar-accent cursor-default">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#0d234f] text-white">
                <LayoutGrid className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Citizens' Atlas</span>
                <span className="truncate text-xs">Admin Dashboard</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMainAdmin 
          items={navItems.map(item => ({
            ...item,
            url: "#",
            items: item.items.map(subItem => ({
              title: subItem.title,
              url: "#",
              isActive: activePage === subItem.page,
              onClick: () => setActivePage(subItem.page),
            }))
          }))} 
        />
        {adminItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.page}>
                  <SidebarMenuButton
                    onClick={() => setActivePage(item.page)}
                    isActive={activePage === item.page}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {/* Team Management Collapsible */}
              {teamManagementItems.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title} className="cursor-pointer">
                        <item.icon />
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              isActive={activePage === subItem.page}
                              onClick={() => setActivePage(subItem.page)}
                              className="cursor-pointer"
                            >
                              <span>{subItem.title}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} onNavigateToProfile={() => setActivePage('account-profile')} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
