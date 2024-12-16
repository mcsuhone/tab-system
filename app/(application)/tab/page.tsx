import { getProducts } from '@/app/actions/products'
import { ProductList } from '@/components/product/product-list'
import UserInfo from '../user-info'
import { User } from '@/db/schema'
import { getCurrentUser } from '@/lib/get-current-user'

export default async function TabPage() {
  const { data: products, error } = await getProducts()
  const user = await getCurrentUser()

  return (
    <div className="w-full space-y-6">
      <h1 className="text-3xl font-bold">Drinks</h1>
      <UserInfo user={user} />

      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div>
          <h2 className="mb-4 text-xl font-semibold">Drinks</h2>
          <ProductList products={products || []} />
        </div>
      )}
    </div>
  )
}
