'use client'

import { Package, User, Wine, Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { jwtVerify } from 'jose'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from '@/components/ui/sidebar'

const baseItems = [
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

const adminItem = {
  title: 'Admin',
  url: '/admin',
  icon: Package
} as const

export function AppSidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { openMobile, setOpenMobile } = useSidebar()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        const token = document.cookie.split('token=')[1]?.split(';')[0]
        if (token) {
          const secret = new TextEncoder().encode('secret')
          const { payload } = await jwtVerify(token, secret)
          setIsAdmin(payload.role === 'admin')
        }
      } catch (error) {
        console.error('Error checking admin status:', error)
        setIsAdmin(false)
      }
    }
    checkAdminStatus()
  }, [])

  useEffect(() => {
    setTheme('dark')
  }, [])

  useEffect(() => {
    setOpenMobile(false)
  }, [pathname, setOpenMobile])

  const items = isAdmin ? [...baseItems, adminItem] : baseItems

  return (
    <Sidebar
      className={`${
        openMobile ? 'translate-x-0' : '-translate-x-full'
      } transition-transform md:translate-x-0`}
    >
      <button
        onClick={() => setOpenMobile(!openMobile)}
        className="fixed left-4 top-4 z-50 md:hidden"
      >
        <Menu className="h-6 w-6 cursor-pointer" />
      </button>

      <SidebarHeader className="flex items-center justify-between my-2">
        <div className="flex items-center gap-2 px-2">
          <Image
            src="/jalostajat_logo_w.png"
            alt="Jalostajat logo"
            width={36}
            height={36}
            className="max-w-[36px]"
          />
          <span className="text-xl font-semibold gesetz-font">OJS Tab</span>
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
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
