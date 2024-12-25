'use client'

import { Product } from '@/db/schema'
import { ProductList } from '@/components/product/product-list'
import { ProductItems } from '@/components/product/product-items'
import { useSpecialProducts } from '@/app/hooks/use-special-products'
import { CartButton } from '@/components/cart/cart-button'
import { SpecialProducts } from '@/components/product/special-products'
import { motion, AnimatePresence } from 'framer-motion'

export function UserProductList() {
  const { data: specialProductsData, isLoading: isSpecialProductsLoading } =
    useSpecialProducts()

  const renderProducts = (products: Product[]) => {
    // Filter out special products from regular list
    const regularProducts = products.filter((p) => !p.isSpecialProduct)
    return <ProductItems products={regularProducts} />
  }

  return (
    <div className="relative">
      <div className="sticky top-4 flex justify-end mt-6">
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

      <ProductList>{renderProducts}</ProductList>
    </div>
  )
}
