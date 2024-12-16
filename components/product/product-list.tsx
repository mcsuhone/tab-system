'use client'

import { Product, ProductCategory } from '@/db/schema'
import { CategoryNav } from './category-nav'
import { ProductItems } from './product-items'
import { CartButton } from './cart-button'
import { SearchBar } from './search-bar'
import { useState } from 'react'
import { useProducts } from '@/app/hooks/use-products'

export function ProductList() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<ProductCategory | null>(null)

  const {
    data: productsData,
    error,
    isLoading
  } = useProducts({
    query,
    category: category || undefined
  })

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
          {isLoading ? (
            <div>Loading...</div>
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
