import { AdminNavbar } from './admin-navbar'

export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-8 p-8">
      <AdminNavbar />
      {children}
    </div>
  )
}
