import { getCurrentUser } from '@/lib/get-current-user'
import UserInfo from '../user-info'
import { ProductList } from '@/components/product/product-list'

export default async function TabPage() {
  const user = await getCurrentUser()

  return (
    <>
      <UserInfo user={user} />
      <ProductList />
    </>
  )
}
