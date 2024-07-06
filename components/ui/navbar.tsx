'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/router'

export const Navbar = () => {
  const router = useRouter()

  const logout = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

  return (
    <div className="flex flex-row justify-between items-center space-x-4 p-4 bg-gray-200">
      <Link href="/tab" className="text-xl w-36">
        Piikki
      </Link>
      <Link href="/admin" className="text-md hover:bg-grey-100">
        Admin sivulle
      </Link>
      <Button onClick={logout} className="w-30">
        Kirjaudu ulos
      </Button>
    </div>
  )
}
