'use client'

import Link from 'next/link'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePathname } from 'next/navigation'

const adminTabs = [
  {
    title: 'Activity',
    href: '/admin'
  },
  {
    title: 'Products',
    href: '/admin/products'
  },
  {
    title: 'Users',
    href: '/admin/users'
  }
]

export function AdminNavbar() {
  const pathname = usePathname()

  return (
    <Tabs defaultValue="/admin" className="w-full" value={pathname}>
      <TabsList>
        {adminTabs.map((tab) => (
          <TabsTrigger key={tab.href} value={tab.href} asChild>
            <Link href={tab.href}>{tab.title}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
