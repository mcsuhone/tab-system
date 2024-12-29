'use client'

import { Product } from '@/db/schema'
import { categoryDisplayNames } from '@/lib/product-categories'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/components/cart/cart-provider'
import { QuantitySelector } from '@/components/input/quantity-selector'
import { ProductSkeleton } from '@/components/product/product-skeleton'

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
        {products.map((product) => {
          const existingItem = items.find(
            (item) => item.product.id === product.id
          )
          return (
            <motion.div
              key={product.id}
              variants={item}
              className={cn(
                'flex items-center gap-4 px-4 py-3 rounded-lg border transition-colors',
                !existingItem && 'hover:bg-accent cursor-pointer'
              )}
              onClick={() => handleProductClick(product)}
            >
              <div className="flex-[50%]">
                <p className="font-medium text-sm">{product.name}</p>
              </div>
              <div className="flex-[15%]">
                <p className="text-sm text-muted-foreground">
                  {categoryDisplayNames[product.category]}
                </p>
              </div>
              <div className="flex-[25%] flex justify-center">
                {existingItem && existingItem.quantity > 0 && (
                  <div className="group">
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
                  </div>
                )}
              </div>
              <div className="flex-[10%] text-right">
                <p className="text-sm">{product.price.toFixed(2)}€</p>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </AnimatePresence>
  )
}
