import { PageContainer } from '@/components/containers/page-container'
import { AdminNavbar } from './admin-navbar'

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <PageContainer>
      <div className="flex flex-col h-full w-full overflow-hidden">
        <AdminNavbar />
        <div className="flex-1 mt-4 min-h-0 overflow-hidden">{children}</div>
      </div>
    </PageContainer>
  )
}
