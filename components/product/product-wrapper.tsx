'use client'

import { useProducts } from '@/app/hooks/use-products'
import { useSearch } from '@/components/search/search-provider'
import { Skeleton } from '@/components/ui/skeleton'
import { Product } from '@/db/schema'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { CategoryNav } from './category-nav'
import { SearchBar } from './search-bar'
import { cn } from '@/lib/utils'
import { CartButton } from '../cart/cart-button'
import { scrollbarStyles } from '@/lib/scrollbar-styles'

const ProductListSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-lg border">
          <Skeleton className="h-16 w-16 rounded-md flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
      ))}
    </div>
  )
}

export const ProductWrapper = ({
  children,
  showCart = true,
  showDisabled = true
}: {
  children: (products: Product[]) => React.ReactNode
  showCart?: boolean
  showDisabled?: boolean
}) => {
  const [showSkeleton, setShowSkeleton] = useState(false)
  const { query, category, setQuery, setCategory } = useSearch()

  const { data, error, isLoading, isLoadingMore, hasMore, fetchNextPage } =
    useProducts({
      query: query || '',
      showDisabled,
      category: category || undefined
    })

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setShowSkeleton(true), 400)
      return () => {
        clearTimeout(timer)
        setShowSkeleton(false)
      }
    }
  }, [isLoading])

  const observerRef = useRef<IntersectionObserver>()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    if (bottomRef.current) {
      observerRef.current.observe(bottomRef.current)
    }

    return () => observerRef.current?.disconnect()
  }, [hasMore, isLoadingMore, fetchNextPage])

  const products = data?.products || []

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    const scrolledToBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 100

    if (scrolledToBottom && hasMore && !isLoadingMore) {
      fetchNextPage()
    }
  }

  const content = (
    <AnimatePresence mode="wait">
      {isLoading && showSkeleton ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <ProductListSkeleton />
        </motion.div>
      ) : error ? (
        <motion.div
          key="error"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="text-red-500"
        >
          {error.message}
        </motion.div>
      ) : (
        <motion.div
          key="products"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-4 p-1"
        >
          {children(products)}
          {isLoadingMore && (
            <div className="mt-4 text-center">Loading more products...</div>
          )}
          {!isLoading && !hasMore && products.length > 0 && (
            <div className="mt-4 text-center text-muted-foreground">
              No more products
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <>
      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col">
        <div className="sticky top-0 z-10 bg-background border-b border-border shadow-lg">
          <div className="w-full flex flex-col">
            {/* Top section with cart */}
            <div className="flex-none w-full px-4 pt-4">
              <div className="flex justify-end">
                {showCart && <CartButton />}
              </div>
            </div>
            {/* Bottom section with nav and search */}
            <div className="flex-none w-full px-4 py-4">
              <div className="flex justify-between items-center gap-2">
                <CategoryNav
                  activeCategory={category}
                  onCategorySelect={setCategory}
                />
                <SearchBar onSearch={setQuery} />
              </div>
            </div>
          </div>
        </div>

        <div
          className={cn(
            'flex flex-col gap-8 h-full overflow-y-auto w-full',
            'touch-pan-y overscroll-none',
            scrollbarStyles
          )}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {content}
          <div ref={bottomRef} className="h-4" />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block w-full">
        <div className="hidden md:grid md:grid-cols-[180px_1fr] md:h-[calc(100vh-130px)] mt-8 md:gap-6">
          <div
            className={cn(
              'flex flex-col gap-4 overflow-y-auto h-full',
              scrollbarStyles
            )}
          >
            <CategoryNav
              activeCategory={category}
              onCategorySelect={setCategory}
            />
          </div>
          <div
            className={cn(
              'flex flex-col gap-8 h-full overflow-y-auto',
              scrollbarStyles
            )}
            onScroll={handleScroll}
          >
            <div className="flex justify-between sticky top-0 z-10 bg-background py-3 px-1">
              <SearchBar onSearch={setQuery} />
              {showCart && <CartButton />}
            </div>
            {content}
          </div>
        </div>
      </div>
    </>
  )
}
