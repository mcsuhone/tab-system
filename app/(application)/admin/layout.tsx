import { PageLayout } from '@/components/containers/page-layout'

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <PageLayout>{children}</PageLayout>
}
