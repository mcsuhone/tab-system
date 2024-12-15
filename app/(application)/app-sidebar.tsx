'use client'

import { Package, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useTheme } from 'next-themes'
import { useEffect } from 'react'
import { MobileMenu } from './mobile-menu'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar'

// Define menu items
const items = [
  {
    title: 'Products',
    url: '/products',
    icon: Package
  },
  {
    title: 'Account',
    url: '/account',
    icon: User
  }
]

export function AppSidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    setTheme('dark')
  }, [])

  return (
    <>
      <MobileMenu onClick={() => setIsMobileOpen(!isMobileOpen)} />

      <Sidebar
        className={`${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform md:translate-x-0`}
      >
        <SidebarHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-2">
            <span className="text-lg font-semibold">Tab System</span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  )
}
