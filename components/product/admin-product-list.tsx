'use client'

import { Product } from '@/db/schema'
import { categoryDisplayNames } from '@/lib/product-categories'
import { ProductList } from './product-list'
import { Switch } from '@/components/ui/switch'
import { useState } from 'react'
import { updateProduct } from '@/app/actions/products'

interface ProductItemProps {
  product: Product
}

function AdminProductItem({ product: initialProduct }: ProductItemProps) {
  const [isPending, setIsPending] = useState(false)
  const [product, setProduct] = useState(initialProduct)

  const handleToggleStatus = async () => {
    setIsPending(true)
    try {
      const result = await updateProduct(product.id, {
        disabled: !product.disabled
      })
      if (result.success && result.data) {
        setProduct(result.data)
      }
    } catch (error) {
      console.error('Failed to update product:', error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div
      className={`p-4 border rounded flex justify-between items-center ${
        product.disabled ? 'opacity-50' : ''
      }`}
    >
      <div>
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-600">
          {categoryDisplayNames[product.category]}
        </p>
        <p className="text-sm">${product.price.toFixed(2)}</p>
      </div>
      <button
        onClick={handleToggleStatus}
        disabled={isPending}
        className={`px-3 py-1 rounded ${
          product.disabled
            ? 'bg-green-500 hover:bg-green-600'
            : 'bg-red-500 hover:bg-red-600'
        } text-white disabled:opacity-50`}
      >
        {isPending ? 'Updating...' : product.disabled ? 'Enable' : 'Disable'}
      </button>
    </div>
  )
}

export function AdminProductList() {
  const [showDisabled, setShowDisabled] = useState(false)

  const renderProducts = (products: Product[]) => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          checked={showDisabled}
          onCheckedChange={setShowDisabled}
          id="show-disabled"
        />
        <label htmlFor="show-disabled">Show disabled products</label>
      </div>

      <div className="grid gap-4">
        {products.map((product) => (
          <AdminProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  )

  return <ProductList showDisabled={showDisabled}>{renderProducts}</ProductList>
}
