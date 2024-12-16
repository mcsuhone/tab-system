'use client'

import { useSidebar } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { Menu } from 'lucide-react'

export function MobileMenu({ className }: { className?: string }) {
  const { openMobile, setOpenMobile } = useSidebar()

  return (
    <button
      onClick={() => setOpenMobile(!openMobile)}
      className={cn('fixed left-4 top-4 z-50 md:hidden', className)}
    >
      <Menu className="h-6 w-6 cursor-pointer" />
    </button>
  )
}
