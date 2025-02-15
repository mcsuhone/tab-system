'use client'

import { Product } from '@/db/schema'
import { categoryDisplayNames } from '@/lib/product-categories'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/components/cart/cart-provider'
import { QuantitySelector } from '@/components/input/quantity-selector'
import { ProductSkeleton } from '@/components/product/product-skeleton'
import { getPriceString, getQuantityString } from '@/lib/get-display-string'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02
    }
  }
}

const item = {
  hidden: {
    opacity: 0,
    y: -10,
    marginTop: 0
  },
  show: {
    opacity: 1,
    y: 0,
    marginTop: 10,
    transition: {
      type: 'spring',
      stiffness: 700,
      damping: 35,
      mass: 0.35
    }
  }
}

interface ProductItemsProps {
  products: Product[]
  isLoading?: boolean
}

export function ProductItems({ products, isLoading }: ProductItemsProps) {
  const { items, addItem, removeItem, updateQuantity } = useCart()

  const handleProductClick = (product: Product) => {
    const existingItem = items.find((item) => item.product.id === product.id)
    if (!existingItem) {
      addItem(product, 1)
    }
  }

  if (isLoading) {
    return <ProductSkeleton />
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="product-list"
        variants={container}
        initial="hidden"
        animate="show"
        exit="hidden"
        className="space-y-0"
      >
        {products.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">
              No products found with provided filters
            </p>
          </div>
        )}
        {products.map((product) => {
          const existingItem = items.find(
            (item) => item.product.id === product.id
          )
          return (
            <motion.div
              key={product.id}
              variants={item}
              className={cn(
                'grid grid-cols-[3fr_1fr_1fr] md:grid-cols-[2fr_1fr_1fr] hover:bg-accent items-center gap-4 px-4 py-3 h-16 rounded-lg border transition-colors',
                !existingItem && 'cursor-pointer',
                existingItem &&
                  'ring-1 ring-inset ring-selected grid-cols-[3fr_3fr_1fr] md:grid-cols-[2fr_1fr_3fr_1fr]'
              )}
              onClick={() => handleProductClick(product)}
            >
              <div className="overflow-hidden">
                <p className="font-medium text-sm line-clamp-2">
                  {product.name}
                </p>
              </div>
              <div className={cn(existingItem && 'hidden md:block')}>
                <p className="text-sm text-muted-foreground select-none">
                  {categoryDisplayNames[product.category]}
                </p>
              </div>
              {existingItem && existingItem.quantity > 0 && (
                <div className="flex justify-center">
                  <div className="group flex flex-row items-center gap-1">
                    <QuantitySelector
                      quantity={String(existingItem.quantity)}
                      allowEmpty={true}
                      onQuantityChange={(quantity) => {
                        const newQuantity = Number(quantity)
                        if (newQuantity === 0) {
                          removeItem(product.id)
                        } else {
                          updateQuantity(product.id, newQuantity)
                        }
                      }}
                      className="group-hover:bg-accent"
                    />
                    <span className="text-sm text-muted-foreground text-center min-w-8">
                      {getQuantityString(existingItem)}
                    </span>
                  </div>
                </div>
              )}
              <div className="text-right">
                <p className="text-sm">
                  {getPriceString(
                    existingItem || { product: product, quantity: 1 }
                  )}
                </p>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </AnimatePresence>
  )
}
