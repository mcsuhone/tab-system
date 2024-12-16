'use client'

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { logout } from '@/app/actions/auth-action'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.refresh()
    router.push('/login')
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout}>
      <LogOut className="h-4 w-4 mr-2" />
      Sign out
    </Button>
  )
}
