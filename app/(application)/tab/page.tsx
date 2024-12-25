import { CartButton } from '@/components/cart/cart-button'
import { PageContainer } from '@/components/containers/page-container'
import { auth } from '@/lib/auth'
import { TopBar } from '../../../components/containers/top-bar'
import UserInfo from '../user-info'
import { TabPageClient } from './page-client'

export default async function TabPage() {
  const { user } = await auth()

  return (
    <>
      <TopBar>
        <UserInfo user={user} />

        <div className="flex flex-row justify-end">
          <CartButton />
        </div>
      </TopBar>
      <PageContainer>
        <TabPageClient />
      </PageContainer>
    </>
  )
}
