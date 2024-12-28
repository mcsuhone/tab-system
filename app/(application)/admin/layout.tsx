import { PageContainer } from '@/components/containers/page-container'
import { AdminNavbar } from './admin-navbar'

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <PageContainer>
      <AdminNavbar />
      <div className="h-full overflow-y-auto">{children}</div>
    </PageContainer>
  )
}
