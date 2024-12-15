'use client'

import { Package, User, Wine } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

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
import { MobileMenu } from './mobile-menu'

// Move items outside of the component to avoid recreation
const items = [
  {
    title: 'Drinks',
    url: '/tab',
    icon: Wine
  },
  {
    title: 'Account',
    url: '/account',
    icon: User
  }
] as const

export function AppSidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    setTheme('dark')
  }, [])

  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  return (
    <>
      <MobileMenu items={items} setIsMobileOpen={setIsMobileOpen} />

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
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      tooltip={item.title}
                      variant="outline"
                    >
                      <Link href={item.url}>
                        <item.icon className="h-5 w-5" />
                        <span className="text-base">{item.title}</span>
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
