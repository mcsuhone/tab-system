'use client'

import { cn } from '@/lib/utils'

export const TopBar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-none w-full justify-center bg-background">
      <div
        className={cn(
          'flex flex-col w-full px-4 max-w-[800px] gap-2',
          // On mobile: add shadow and border when not at top
          'md:shadow-none md:border-b-0',
          'shadow-lg border-b border-border'
        )}
      >
        {children}
      </div>
    </div>
  )
}
