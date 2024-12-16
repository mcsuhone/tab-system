import { ShopProductList } from '@/components/product/shop-product-list'
import UserInfo from '../user-info'
import { auth } from '@/lib/auth'

export default async function TabPage() {
  const { user } = await auth()

  return (
    <>
      <UserInfo user={user} className="mb-4" />
      <ShopProductList />
    </>
  )
}
