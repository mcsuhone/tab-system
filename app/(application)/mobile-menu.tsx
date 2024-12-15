'use client'

import { Menu } from 'lucide-react'

interface MobileMenuProps {
  onClick: () => void
}

export function MobileMenu({ onClick }: MobileMenuProps) {
  return (
    <div className="fixed left-4 top-4 z-50 md:hidden">
      <Menu className="h-6 w-6 cursor-pointer" onClick={onClick} />
    </div>
  )
}
