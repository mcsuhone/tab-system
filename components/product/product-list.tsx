'use client'

import { deleteProduct } from '@/app/actions/products'
import { useTransition } from 'react'

type Product = {
  id: number
  name: string
  category: string
  price: number
}

export function ProductList({ products }: { products: Product[] }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="grid gap-4">
      {products?.map((product) => (
        <div
          key={product.id}
          className="p-4 border rounded flex justify-between items-center"
        >
          <div>
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.category}</p>
            <p className="text-sm">${product.price.toFixed(2)}</p>
          </div>
          <button
            onClick={() => {
              startTransition(async () => {
                await deleteProduct(product.id)
              })
            }}
            disabled={isPending}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300"
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      ))}
    </div>
  )
}
