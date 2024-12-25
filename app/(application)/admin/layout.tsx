import { PageContainer } from '@/components/containers/page-container'
import { AdminNavbar } from './admin-navbar'

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="">
      <PageContainer>
        <AdminNavbar />
        {children}
      </PageContainer>
    </div>
  )
}
