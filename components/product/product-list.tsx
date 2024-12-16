'use client'

import { Product, ProductCategory } from '@/db/schema'
import { CategoryNav } from './category-nav'
import { ProductItems } from './product-items'
import { CartButton } from './cart-button'
import { SearchBar } from './search-bar'
import { useState, useEffect } from 'react'
import { useProducts } from '@/app/hooks/use-products'
import { Skeleton } from '@/components/ui/skeleton'

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

export function ProductList() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<ProductCategory | null>(null)
  const [showSkeleton, setShowSkeleton] = useState(false)

  const {
    data: productsData,
    error,
    isLoading
  } = useProducts({
    query,
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

  return (
    <>
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
            <CartButton />
          </div>
          {isLoading && showSkeleton ? (
            <ProductListSkeleton />
          ) : error ? (
            <div className="text-red-500">{error.message}</div>
          ) : (
            <ProductItems products={productsData?.data || []} />
          )}
        </div>
      </div>
    </>
  )
}
