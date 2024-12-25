import { TabPageClient } from './page-client'
import UserInfo from '../user-info'
import { auth } from '@/lib/auth'
import { PageContainer } from '@/components/containers/page-container'
import { TopBar } from './top-bar'

export default async function TabPage() {
  const { user } = await auth()

  return (
    <>
      <TopBar user={user} />
      <PageContainer>
        <TabPageClient />
      </PageContainer>
    </>
  )
}
