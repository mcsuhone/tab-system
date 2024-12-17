'use client'

import { Product, ProductCategory } from '@/db/schema'
import { CategoryNav } from './category-nav'
import { SearchBar } from './search-bar'
import { useState, useEffect } from 'react'
import { useProducts } from '@/app/hooks/use-products'
import { useSpecialProducts } from '@/app/hooks/use-special-products'
import { Skeleton } from '@/components/ui/skeleton'
import { motion, AnimatePresence } from 'framer-motion'
import { SpecialProducts } from './special-products'
import { CartButton } from './cart-button'

function ProductListSkeleton() {
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

export function ProductList({
  children,
  showDisabled = true
}: ProductListProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<ProductCategory | null>(null)
  const [showSkeleton, setShowSkeleton] = useState(false)

  const {
    data: productsData,
    error,
    isLoading
  } = useProducts({
    query,
    category: category || undefined,
    showDisabled
  })

  const { data: specialProductsData, isLoading: isSpecialProductsLoading } =
    useSpecialProducts()

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

  // Only filter out special products from regular products list
  const regularProducts =
    productsData?.data?.filter((p) => !p.isSpecialProduct) || []

  return (
    <>
      <div className="flex justify-end mt-6">
        <CartButton />
      </div>
      <AnimatePresence mode="wait">
        {!isSpecialProductsLoading && specialProductsData?.data && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <SpecialProducts
              products={specialProductsData.data}
              isLoading={false}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <h2 className="mb-4 text-xl font-semibold">Categories</h2>
      <div className="grid grid-cols-[200px_1fr] gap-6">
        <div className="sticky top-0">
          <CategoryNav
            activeCategory={category}
            onCategorySelect={setCategory}
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between w-full items-center sticky top-0 z-10 bg-background pb-4">
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
                {children(regularProducts)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}
