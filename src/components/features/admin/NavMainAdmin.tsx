"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { useState, useEffect } from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMainAdmin({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
      isActive?: boolean
      onClick?: () => void
    }[]
  }[]
}) {
  // Track open state for each menu to keep them open when active
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  // Update open state when active page changes
  useEffect(() => {
    const newOpenMenus: Record<string, boolean> = {};
    items.forEach((item) => {
      // Keep menu open if any of its items are active
      newOpenMenus[item.title] = item.isActive || item.items?.some(subItem => subItem.isActive) || false;
    });
    setOpenMenus(newOpenMenus);
  }, [items]);

  const handleOpenChange = (title: string, isOpen: boolean) => {
    setOpenMenus(prev => ({
      ...prev,
      [title]: isOpen
    }));
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Content Management</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            open={openMenus[item.title]}
            onOpenChange={(isOpen) => handleOpenChange(item.title, isOpen)}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton 
                        asChild={!subItem.onClick}
                        isActive={subItem.isActive}
                        onClick={subItem.onClick}
                        className="pl-8"
                      >
                        {subItem.onClick ? (
                          <button type="button" className="w-full text-left">
                            <span>{subItem.title}</span>
                          </button>
                        ) : (
                          <a href={subItem.url} className="text-left">
                            <span>{subItem.title}</span>
                          </a>
                        )}
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
  )
}
