'use client'

import { Menu, SlidersHorizontal, User, Wine } from 'lucide-react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
  icon: SlidersHorizontal
} as const

interface AppSidebarProps {
  isAdmin: boolean
}

export function AppSidebar({ isAdmin }: AppSidebarProps) {
  const pathname = usePathname()
  const { setTheme } = useTheme()
  const { openMobile, setOpenMobile } = useSidebar()

  useEffect(() => {
    setTheme('dark')
  }, [setTheme])

  useEffect(() => {
    setOpenMobile(false)
  }, [pathname, setOpenMobile])

  const items = isAdmin ? [...baseItems, adminItem] : baseItems

  const isItemActive = (url: string) => {
    if (url === '/admin') {
      return pathname.startsWith('/admin')
    }
    return pathname === url
  }

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
            priority
            src="/jalostajat_logo_w.png"
            alt="Jalostajat logo"
            width={36}
            height={36}
            className="h-9 w-9"
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
                    isActive={isItemActive(item.url)}
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
