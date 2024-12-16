'use client'

import { Product } from '@/db/schema'
import { ProductList } from './product-list'
import { ProductItems } from './product-items'
import { CartButton } from './cart-button'

export function ShopProductList() {
  return (
    <div className="relative">
      <div className="absolute right-0 top-[3.25rem] z-20">
        <CartButton />
      </div>
      <ProductList>
        {(products) => <ProductItems products={products} />}
      </ProductList>
    </div>
  )
}
