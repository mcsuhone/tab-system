'use client'

import { useSpecialProducts } from '@/app/hooks/use-special-products'
import { PageLayout } from '@/components/containers/page-layout'
import { TopBar } from '@/components/containers/top-bar'
import { ProductWrapper } from '@/components/product/product-wrapper'
import { SpecialProducts } from '@/components/product/special-products'
import { Product, User } from '@/db/schema'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { UserInfo } from '../user-info'
import { ProductItems } from './product-items'

export function TabPageClient({ user }: { user: User | null }) {
  const { data: specialProductsData, isLoading: isSpecialProductsLoading } =
    useSpecialProducts()
  const [isSearching, setIsSearching] = useState(false)

  const renderProducts = (products: Product[]) => {
    // Filter out special products from regular list
    const regularProducts = products.filter(
      (p) => !p.isSpecialProduct && !p.disabled
    )

    return (
      <>
        <AnimatePresence mode="wait">
          {!isSearching &&
            !isSpecialProductsLoading &&
            specialProductsData?.products && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <SpecialProducts
                  products={specialProductsData.products}
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

  return (
    <PageLayout>
      <TopBar>
        <UserInfo user={user} />
      </TopBar>
      <ProductWrapper onSearchStatusChange={setIsSearching}>
        {renderProducts}
      </ProductWrapper>
    </PageLayout>
  )
}
