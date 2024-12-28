'use client'

import { useProducts } from '@/app/hooks/use-products'
import { useSearch } from '@/components/search/search-provider'
import { ScrollToTopButton } from '@/components/ui/scroll-to-top'
import { Skeleton } from '@/components/ui/skeleton'
import { Product } from '@/db/schema'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { CategoryNav } from './category-nav'
import { SearchBar } from './search-bar'

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

interface ProductListProps {
  children: (products: Product[]) => React.ReactNode
  showDisabled?: boolean
}

const DesktopProductLayout = ({
  children,
  isLoading,
  showSkeleton,
  error,
  products,
  onScroll,
  isLoadingMore,
  hasMore
}: {
  children: (products: Product[]) => React.ReactNode
  isLoading: boolean
  showSkeleton: boolean
  error: Error | null
  products: Product[]
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void
  isLoadingMore: boolean
  hasMore: boolean
}) => {
  const { setQuery, category, setCategory } = useSearch()
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <div className="hidden md:grid grid-cols-[180px_1fr] h-full gap-6">
      <div className="flex flex-col gap-4 top-4 h-full overflow-y-auto">
        <CategoryNav activeCategory={category} onCategorySelect={setCategory} />
      </div>
      <div
        className="flex flex-col gap-8 h-full overflow-y-auto"
        onScroll={onScroll}
        ref={contentRef}
      >
        <div className="flex justify-start sticky top-0 z-10">
          <SearchBar onSearch={setQuery} />
        </div>
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
              className="space-y-4 pr-2"
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
      </div>
    </div>
  )
}

const MobileProductLayout = ({
  children,
  isLoading,
  showSkeleton,
  error,
  products,
  onScroll,
  isLoadingMore,
  hasMore
}: {
  children: (products: Product[]) => React.ReactNode
  isLoading: boolean
  showSkeleton: boolean
  error: Error | null
  products: Product[]
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void
  isLoadingMore: boolean
  hasMore: boolean
}) => {
  const { setQuery, category, setCategory } = useSearch()
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <div className="md:hidden h-[calc(100vh-4rem)]">
      <div
        className="flex flex-col gap-4 h-full overflow-y-auto"
        onScroll={onScroll}
        ref={contentRef}
      >
        <div className="flex flex-row justify-between w-full items-center bg-background pb-4 gap-2 sticky top-0 z-10">
          <CategoryNav
            activeCategory={category}
            onCategorySelect={setCategory}
          />
          <SearchBar onSearch={setQuery} />
        </div>
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
            <ScrollToTopButton>
              <motion.div
                key="products"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 pr-2"
              >
                {children(products)}
                {isLoadingMore && (
                  <div className="mt-4 text-center">
                    Loading more products...
                  </div>
                )}
                {!isLoading && !hasMore && products.length > 0 && (
                  <div className="mt-4 text-center text-muted-foreground">
                    No more products
                  </div>
                )}
              </motion.div>
            </ScrollToTopButton>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export const ProductWrapper = ({
  children,
  showDisabled = true
}: ProductListProps) => {
  const [showSkeleton, setShowSkeleton] = useState(false)
  const { query, category } = useSearch()

  const { data, error, isLoading, isLoadingMore, hasMore, fetchNextPage } =
    useProducts({
      query: query || '',
      showDisabled,
      category: category || undefined
    })

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowSkeleton(true)
      }, 400)
      return () => {
        clearTimeout(timer)
        setShowSkeleton(false)
      }
    }
  }, [isLoading])

  const products = data?.data || []

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    const scrolledToBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 100

    if (scrolledToBottom && hasMore && !isLoadingMore) {
      fetchNextPage()
    }
  }

  return (
    <>
      <MobileProductLayout
        isLoading={isLoading}
        showSkeleton={showSkeleton}
        error={error}
        products={products}
        onScroll={handleScroll}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
      >
        {children}
      </MobileProductLayout>
      <DesktopProductLayout
        isLoading={isLoading}
        showSkeleton={showSkeleton}
        error={error}
        products={products}
        onScroll={handleScroll}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
      >
        {children}
      </DesktopProductLayout>
    </>
  )
}
