'use client'

import { Product } from '@/db/schema'
import { useState } from 'react'
import { categoryDisplayNames } from '@/lib/product-categories'
import { AddToCartDialog } from '../cart/add-to-cart-dialog'
import { motion } from 'framer-motion'

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

export function ProductItems({ products }: { products: Product[] }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-0"
    >
      {products.map((product) => (
        <motion.div
          key={product.id}
          variants={item}
          className="flex items-center gap-4 px-4 py-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
          onClick={() => setSelectedProduct(product)}
        >
          <div className="flex-[60%]">
            <p className="font-medium text-sm">{product.name}</p>
          </div>
          <div className="flex-[30%]">
            <p className="text-sm text-gray-500">
              {categoryDisplayNames[product.category]}
            </p>
          </div>
          <div className="flex-[10%]">
            <p className="text-sm">{product.price.toFixed(2)}€</p>
          </div>
        </motion.div>
      ))}

      <AddToCartDialog
        product={selectedProduct!}
        open={!!selectedProduct}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
      />
    </motion.div>
  )
}
