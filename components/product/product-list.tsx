'use client'

import { Product, ProductCategory } from '@/db/schema'
import { useTransition, useState } from 'react'
import { categoryDisplayNames } from '@/lib/product-categories'
import { CategoryNav } from './category-nav'
import { AddToCartDialog } from '../cart/add-to-cart-dialog'
import { Button } from '../ui/button'
import { CartDialog } from '../cart/cart-dialog'
import { useCart } from '../cart/cart-provider'
import { ShoppingCart } from 'lucide-react'

export function ProductList({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | null>(
    null
  )
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const { total, items } = useCart()

  const filteredProducts = activeCategory
    ? products.filter((product) => product.category === activeCategory)
    : products

  return (
    <div className="flex gap-6">
      <CategoryNav
        activeCategory={activeCategory}
        onCategorySelect={setActiveCategory}
      />
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-end">
          <Button
            onClick={() => setCartOpen(true)}
            className="flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Cart ({items.length})</span>
            <span>${total.toFixed(2)}</span>
          </Button>
        </div>
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="flex flex-row p-4 border rounded items-center max-h-24 cursor-pointer hover:bg-accent"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="flex-[60%]">
              <h3 className="font-semibold">{product.name}</h3>
            </div>
            <div className="flex-[30%]">
              <p className="text-sm text-gray-600">
                {categoryDisplayNames[product.category]}
              </p>
            </div>
            <div className="flex-[10%]">
              <p className="text-sm">${product.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      <AddToCartDialog
        product={selectedProduct!}
        open={!!selectedProduct}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
      />

      <CartDialog open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  )
}
