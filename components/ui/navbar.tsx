'use client'

import { Button } from '@/components/ui/button'
import { User } from '@prisma/client'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export const Navbar = () => {
  const [user, setUser] = useState<User | undefined>(undefined)
  const router = useRouter()

  useEffect(() => {
    const val = localStorage.getItem('user')
    const storedUser = val ? JSON.parse(val) : null
    setUser(storedUser)
  }, [])

  const logout = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

  return (
    <div className="flex flex-row items-center space-x-4 p-4 bg-gray-200">
      <h2 className="text-xl">Tervetuloa {user?.name}</h2>
      <Button onClick={logout}>Kirjaudu ulos</Button>
    </div>
  )
}
