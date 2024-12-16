'use client'

import { Button } from '../ui/button'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '../cart/cart-provider'
import { useState } from 'react'
import { CartDialog } from '../cart/cart-dialog'

export function CartButton() {
  const [cartOpen, setCartOpen] = useState(false)
  const { total, items } = useCart()

  return (
    <>
      <div className="flex justify-end">
        <Button
          onClick={() => setCartOpen(true)}
          className="flex items-center gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Cart ({items.length})</span>
          <span>${total.toFixed(2)}</span>
        </Button>
      </div>
      <CartDialog open={cartOpen} onOpenChange={setCartOpen} />
    </>
  )
}
