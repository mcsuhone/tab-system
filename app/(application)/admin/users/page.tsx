import dynamic from 'next/dynamic'

const UsersPageClient = dynamic(() => import('./page-client'), { ssr: false })

export default function Page() {
  return <UsersPageClient />
}
