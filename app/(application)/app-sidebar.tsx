'use client'

import { Menu, Package, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger
} from '@/components/ui/sidebar'
import { useTheme } from 'next-themes'
import { useEffect } from 'react'

export function AppSidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    setTheme('dark')
  }, [])

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2 px-2">
          <Menu
            className="h-6 w-6 cursor-pointer md:hidden"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          />
          <span className="hidden text-lg font-semibold md:block">
            Tab System
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent
        className={`${isMobileOpen ? 'block' : 'hidden'} md:block`}
      >
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/products'}
              tooltip="Products"
            >
              <Link href="/products">
                <Package />
                <span>Products</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/account'}
              tooltip="Account"
            >
              <Link href="/account">
                <User />
                <span>Account</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
