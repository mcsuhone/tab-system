'use client'

import { cn } from '@/lib/utils'

const scrollbarStyles =
  'scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-transparent scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/50'

export const PageLayout = ({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <>
      {/* Mobile Layout */}
      <div
        className={cn(
          'md:hidden min-h-screen flex flex-col w-full mt-12 px-4',
          className
        )}
      >
        {children}
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex md:flex-col md:h-screen w-full max-w-[800px]">
        <div
          className={cn(
            'flex-1 flex-col mt-8 overflow-hidden',
            scrollbarStyles,
            className
          )}
        >
          {children}
        </div>
      </div>
    </>
  )
}
