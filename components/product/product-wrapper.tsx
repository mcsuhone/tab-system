'use client'

import { Product, ProductCategory } from '@/db/schema'
import { SearchBar } from './search-bar'
import { useState, useEffect } from 'react'
import { useProducts } from '@/app/hooks/use-products'
import { Skeleton } from '@/components/ui/skeleton'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearch } from '@/components/search/search-provider'
import { CategoryNav } from './category-nav'
import { ScrollToTopButton } from '@/components/ui/scroll-to-top'
import { useIsMobile } from '@/hooks/use-mobile'

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
  products
}: {
  children: (products: Product[]) => React.ReactNode
  isLoading: boolean
  showSkeleton: boolean
  error: Error | null
  products: Product[]
}) => {
  const { query, setQuery, category, setCategory } = useSearch()

  return (
    <div className="hidden md:grid grid-cols-[200px_1fr] gap-6">
      <div className="flex flex-col gap-4 sticky top-4 h-fit">
        <CategoryNav activeCategory={category} onCategorySelect={setCategory} />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-end sticky top-4 bg-background z-10 pb-4">
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
              className="space-y-4"
            >
              {children(products)}
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
  products
}: {
  children: (products: Product[]) => React.ReactNode
  isLoading: boolean
  showSkeleton: boolean
  error: Error | null
  products: Product[]
}) => {
  const { query, setQuery, category, setCategory } = useSearch()

  return (
    <div className="md:hidden">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between w-full items-center bg-background pb-4 gap-2">
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
            <motion.div
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {children(products)}
            </motion.div>
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
  const isMobile = useIsMobile()

  const {
    data: productsData,
    error,
    isLoading
  } = useProducts({
    query: '',
    showDisabled
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

  const products = productsData?.data || []

  return (
    <>
      <ScrollToTopButton />
      <MobileProductLayout
        isLoading={isLoading}
        showSkeleton={showSkeleton}
        error={error}
        products={products}
      >
        {children}
      </MobileProductLayout>
      <DesktopProductLayout
        isLoading={isLoading}
        showSkeleton={showSkeleton}
        error={error}
        products={products}
      >
        {children}
      </DesktopProductLayout>
    </>
  )
}
