'use client'

import { useProducts } from '@/app/hooks/use-products'
import { useSpecialProducts } from '@/app/hooks/use-special-products'
import { ProductItems } from '@/components/product/product-items'
import { ProductWrapper } from '@/components/product/product-wrapper'
import { SpecialProducts } from '@/components/product/special-products'
import { useSearch } from '@/components/search/search-provider'
import { AnimatePresence, motion } from 'framer-motion'

export function TabPageClient() {
  const { data: specialProductsData, isLoading: isSpecialProductsLoading } =
    useSpecialProducts()

  const { query, category } = useSearch()

  const {
    data: products,
    isLoading,
    isLoadingMore,
    hasMore
  } = useProducts({
    limit: 30,
    showDisabled: false,
    query,
    category: category || undefined
  })

  const renderProducts = () => {
    // Filter out special products from regular list
    const regularProducts = products.data?.filter((p) => !p.isSpecialProduct)

    return (
      <>
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
        <h2 className="text-lg font-semibold mb-4">Products</h2>
        <ProductItems products={regularProducts} />
        {isLoadingMore && <div className="mt-4">Loading more products...</div>}
        {!isLoading && !hasMore && products.data?.length > 0 && (
          <div className="mt-4 text-center text-muted-foreground">
            No more products
          </div>
        )}
      </>
    )
  }

  return <ProductWrapper>{renderProducts}</ProductWrapper>
}
