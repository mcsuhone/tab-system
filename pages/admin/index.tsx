import { Button } from '@/components/ui/button'
import { useRouter } from 'next/router'

export default () => {
  const router = useRouter()

  return (
    <div className="flex flex-col space-y-4 items-center">
      <h2 className="text-4xl mb-8">Admin</h2>
      <Button onClick={() => router.push('/admin/products')}>
        Lisää tuotteita
      </Button>
      <Button onClick={() => router.push('/admin/users')}>
        Lisää käyttäjiä
      </Button>
    </div>
  )
}
