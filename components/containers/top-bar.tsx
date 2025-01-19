'use client'

import { cn } from '@/lib/utils'

export const TopBar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-none w-full justify-center bg-background">
      <div className={cn('flex flex-col w-full px-4 max-w-[800px] gap-2')}>
        {children}
      </div>
    </div>
  )
}
