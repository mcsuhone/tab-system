import { auth } from '@/lib/auth'
import { TabPageClient } from './page-client'

export default async function TabPage() {
  const { user } = await auth()

  return (
    <>
      <TabPageClient user={user} />
    </>
  )
}
