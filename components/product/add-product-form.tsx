'use client'

import { addProduct } from '@/app/actions/products'
import { useTransition } from 'react'

export function AddProductForm() {
  const [isPending, startTransition] = useTransition()

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          await addProduct(formData)
        })
      }}
      className="flex flex-col gap-4 max-w-md"
    >
      <input
        type="text"
        name="name"
        placeholder="Product name"
        required
        className="px-4 py-2 border rounded"
      />
      <input
        type="text"
        name="category"
        placeholder="Category"
        required
        className="px-4 py-2 border rounded"
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        step="0.01"
        required
        className="px-4 py-2 border rounded"
      />
      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {isPending ? 'Adding...' : 'Add Product'}
      </button>
    </form>
  )
}
