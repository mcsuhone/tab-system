'use client'

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { logout } from '@/app/actions/auth-action'
import { useCart } from './cart/cart-provider'

export function LogoutButton() {
  const router = useRouter()
  const { clearCart } = useCart()

  const handleLogout = async () => {
    await logout()
    clearCart()
    localStorage.removeItem('token')
    router.refresh()
    router.push('/login')
  }

  return (
    <Button variant="outline" size="sm" onClick={handleLogout}>
      <LogOut className="h-4 w-4 mr-2" />
      Sign out
    </Button>
  )
}
