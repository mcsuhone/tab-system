import React from 'react'
import { getProducts } from '@/app/actions/products'
import { AdminProductList } from '@/components/product/admin-product-list'
import { AddProductForm } from '@/components/product/add-product-form'

export default async function AdminProductsPage() {
  const products = await getProducts({})

  return (
    <div className="w-full max-w-7xl">
      <h1 className="mb-8 text-3xl font-bold">Product Management</h1>

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Add New Product</h2>
        <AddProductForm />
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Products</h2>
        <AdminProductList />
      </div>
    </div>
  )
}
