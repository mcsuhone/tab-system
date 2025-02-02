'use client'

import { createTransaction } from '@/app/actions/transactions'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { CartItem } from '@/db/schema'
import { useToast } from '@/hooks/use-toast'
import { getQuantityString } from '@/lib/get-quantity-string'
import { Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { QuantitySelector } from '../input/quantity-selector'
import { useCart } from './cart-provider'

interface CartDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartDialog({ open, onOpenChange }: CartDialogProps) {
  const { items, removeItem, total, clearCart, updateQuantity } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const { toast } = useToast()

  const handleCheckout = useCallback(async () => {
    if (isCheckingOut || items.length === 0) return
    setIsCheckingOut(true)
    try {
      await createTransaction({
        items: items.map((item: CartItem) => ({
          productId: item.product.id,
          quantity: item.quantity,
          pricePerUnit: item.product.price
        }))
      })

      clearCart()
      onOpenChange(false)
      toast({
        title: 'Success',
        description: 'Order placed successfully!'
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to place order'
      })
    } finally {
      setIsCheckingOut(false)
    }
  }, [isCheckingOut, items, clearCart, onOpenChange, toast])

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (
        e.key === 'Enter' &&
        open &&
        document.activeElement?.tagName !== 'INPUT' &&
        !isCheckingOut &&
        items.length > 0
      ) {
        e.preventDefault()
        handleCheckout()
      }
    }

    if (open) {
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, items.length, isCheckingOut, handleCheckout])

  const handleQuantityChange = (item: CartItem, newQuantity: string) => {
    const qty = parseFloat(newQuantity)
    if (qty <= 0) {
      removeItem(item.product.id)
    } else {
      updateQuantity(item.product.id, qty)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Shopping Cart</DialogTitle>
          <DialogDescription>Total: {total.toFixed(2)}€</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-8">
          {items.map((item) => (
            <div key={item.product.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-medium">{item.product.name}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.product.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-[1.4fr_2fr_1fr_1fr] items-center gap-2">
                <div className="text-sm text-gray-400">
                  {item.product.price.toFixed(2)}€{' '}
                  {item.product.isSpecialProduct ? '' : 'each'}
                </div>
                <div className="flex justify-center">
                  <QuantitySelector
                    quantity={item.quantity.toString()}
                    onQuantityChange={(qty) => handleQuantityChange(item, qty)}
                  />
                </div>
                <div className="text-sm text-gray-400">
                  <div className="flex flex-col items-center gap-1">
                    {getQuantityString(item)}
                  </div>
                </div>
                <div className="text-right font-medium text-gray-300">
                  {(item.product.price * item.quantity).toFixed(2)}€
                </div>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button
            onClick={handleCheckout}
            disabled={items.length === 0 || isCheckingOut}
          >
            {isCheckingOut ? 'Processing...' : `Checkout ${total.toFixed(2)}€`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
