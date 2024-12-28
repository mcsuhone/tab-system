'use client'

import { useSpecialProducts } from '@/app/hooks/use-special-products'
import { ProductItems } from './product-items'
import { ProductWrapper } from '@/components/product/product-wrapper'
import { SpecialProducts } from '@/components/product/special-products'
import { Product } from '@/db/schema'
import { AnimatePresence, motion } from 'framer-motion'

export function TabPageClient() {
  const { data: specialProductsData, isLoading: isSpecialProductsLoading } =
    useSpecialProducts()

  const renderProducts = (products: Product[]) => {
    // Filter out special products from regular list
    const regularProducts = products.filter((p) => !p.isSpecialProduct)

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
      </>
    )
  }

  return <ProductWrapper>{renderProducts}</ProductWrapper>
}
