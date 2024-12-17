import { auth } from '@/lib/auth'
import UserInfo from '../user-info'
import { AdminNavbar } from './admin-navbar'

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { user } = await auth()
  return (
    <div className="flex flex-col gap-12">
      <UserInfo user={user} />
      <div className="flex flex-col items-center justify-center mb-2">
        <AdminNavbar />
      </div>
      {children}
    </div>
  )
}
