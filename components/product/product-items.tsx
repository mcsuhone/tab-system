'use client'

import { Product } from '@/db/schema'
import { useState } from 'react'
import { categoryDisplayNames } from '@/lib/product-categories'
import { AddToCartDialog } from '../cart/add-to-cart-dialog'

export function ProductItems({ products }: { products: Product[] }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  return (
    <>
      {products.map((product) => (
        <div
          key={product.id}
          className="flex flex-row p-4 border rounded items-center max-h-24 cursor-pointer hover:bg-accent"
          onClick={() => setSelectedProduct(product)}
        >
          <div className="flex-[60%]">
            <h3 className="font-semibold">{product.name}</h3>
          </div>
          <div className="flex-[30%]">
            <p className="text-sm text-gray-500">
              {categoryDisplayNames[product.category]}
            </p>
          </div>
          <div className="flex-[10%]">
            <p className="text-sm">${product.price.toFixed(2)}</p>
          </div>
        </div>
      ))}

      <AddToCartDialog
        product={selectedProduct!}
        open={!!selectedProduct}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
      />
    </>
  )
}
