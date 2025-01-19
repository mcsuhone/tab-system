'use client'

import { cn } from '@/lib/utils'

const scrollbarStyles =
  'scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-transparent scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/50'

export const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* Mobile Layout */}
      <div className="md:hidden min-h-screen flex flex-col mt-12">
        {children}
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex md:flex-col md:h-screen w-full max-w-[800px]">
        <div
          className={cn(
            'flex-1 flex-col mt-8 overflow-hidden',
            scrollbarStyles
          )}
        >
          {children}
        </div>
      </div>
    </>
  )
}
