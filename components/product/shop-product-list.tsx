'use client'

import { Product } from '@/db/schema'
import { ProductList } from './product-list'
import { ProductItems } from './product-items'

export function ShopProductList() {
  return (
    <div className="relative">
      <ProductList>
        {(products) => <ProductItems products={products} />}
      </ProductList>
    </div>
  )
}
