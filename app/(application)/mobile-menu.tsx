'use client'

import { Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'

interface NavigationItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
}

interface MobileMenuProps {
  items: readonly NavigationItem[]
  setIsMobileOpen: (open: boolean) => void
}

export function MobileMenu({ items, setIsMobileOpen }: MobileMenuProps) {
  const pathname = usePathname()

  return (
    <Sheet onOpenChange={setIsMobileOpen}>
      <SheetTrigger asChild className="fixed left-4 top-4 z-50 md:hidden">
        <Menu className="h-6 w-6 cursor-pointer" />
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Tab System</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col space-y-2 mt-4">
          {items.map((item) => (
            <Link
              key={item.title}
              href={item.url}
              className={`flex items-center gap-2 rounded-md p-2 text-sm hover:bg-accent ${
                pathname === item.url ? 'bg-accent' : ''
              }`}
              onClick={() => setIsMobileOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
