import { PageContainer } from '@/components/containers/page-container'
import { AdminNavbar } from './admin-navbar'
import { PageLayout } from '@/components/containers/page-layout'
import { TopBar } from '@/components/containers/top-bar'

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <PageLayout>
      <AdminNavbar />
      {children}
    </PageLayout>
  )
}
