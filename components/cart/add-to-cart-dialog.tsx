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
import { Product } from '@/db/schema'
import { useState, useEffect } from 'react'
import { useCart } from './cart-provider'
import { QuantitySelector } from './quantity-selector'

interface AddToCartDialogProps {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddToCartDialog({
  product,
  open,
  onOpenChange
}: AddToCartDialogProps) {
  const [quantity, setQuantity] = useState('1')
  const { addItem } = useCart()

  // Reset quantity to 1 when dialog opens with a new product
  useEffect(() => {
    if (open) {
      setQuantity('1')
    }
  }, [open, product?.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const qty = parseFloat(quantity)
    if (qty > 0) {
      addItem(product, qty)
      onOpenChange(false)
    }
  }

  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add to Cart - {product.name}</DialogTitle>
          <DialogDescription>
            ${product.price.toFixed(2)} per unit
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="quantity" className="text-right">
                Quantity
              </label>
              <div className="col-span-3">
                <QuantitySelector
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">Total</label>
              <div className="col-span-3">
                ${(product.price * parseFloat(quantity || '0')).toFixed(2)}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add to Cart</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
