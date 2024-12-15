import { getProducts } from '@/app/actions/products'
import { ProductList } from '@/components/product/product-list'
import { AddProductForm } from '@/components/product/add-product-form'

export default async function TabPage() {
  const { data: products, error } = await getProducts()

  return (
    <div className="w-full max-w-7xl">
      <h1 className="mb-8 text-3xl font-bold">Tab Management</h1>

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Add New Product</h2>
        <AddProductForm />
      </div>

      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div>
          <h2 className="mb-4 text-xl font-semibold">Products</h2>
          <ProductList products={products} />
        </div>
      )}
    </div>
  )
}
