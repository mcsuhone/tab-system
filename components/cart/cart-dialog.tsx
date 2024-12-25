'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useCart } from './cart-provider'
import { createTransaction } from '@/app/actions/transactions'
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { QuantitySelector } from '../input/quantity-selector'
import { Trash2 } from 'lucide-react'

interface CartDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartDialog({ open, onOpenChange }: CartDialogProps) {
  const { items, removeItem, total, clearCart, updateQuantity } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const { toast } = useToast()

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true)
      await createTransaction({
        items: items.map((item) => ({
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
  }

  const handleQuantityChange = (
    item: (typeof items)[0],
    newQuantity: string
  ) => {
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
        <div className="grid gap-6 py-4">
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
              <div className="grid grid-cols-3 text-sm text-gray-500 items-center">
                <div>{item.product.price.toFixed(2)}€ each</div>
                <div className="w-full flex justify-center">
                  <QuantitySelector
                    quantity={item.quantity.toString()}
                    onQuantityChange={(qty) => handleQuantityChange(item, qty)}
                  />
                </div>
                <div className="text-right font-medium text-gray-400">
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
