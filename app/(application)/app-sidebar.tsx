'use client'

import { Menu, Ruler, SquareActivity, User, Wine } from 'lucide-react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { DialogTitle, DialogDescription } from '@/components/ui/dialog'

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

const adminItems = [
  {
    title: 'Activity',
    url: '/admin/activity-logs',
    icon: SquareActivity
  },
  {
    title: 'Products',
    url: '/admin/products',
    icon: Wine
  },
  {
    title: 'Users',
    url: '/admin/users',
    icon: User
  },
  {
    title: 'Measurements',
    url: '/admin/measurements',
    icon: Ruler
  }
] as const

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
      <DialogTitle className="sr-only">Application Navigation</DialogTitle>
      <DialogDescription className="sr-only">
        Main menu for OJS Tab system
      </DialogDescription>

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

        {isAdmin && (
          <SidebarGroup>
            <div className="px-3 pt-4">
              <h4 className="mb-2 text-xs font-semibold">Admin</h4>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
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
        )}
      </SidebarContent>
    </Sidebar>
  )
}
