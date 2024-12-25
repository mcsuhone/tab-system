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
import { Measurement, Product } from '@/db/schema'
import { useEffect, useState } from 'react'
import { useCart } from './cart-provider'
import { QuantitySelector } from '../input/quantity-selector'
import { getMeasurements } from '@/app/actions/measurements'
import PriceInput from '../input/price-input'

interface AddToCartDialogProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddToCartDialog({
  product,
  open,
  onOpenChange
}: AddToCartDialogProps) {
  const [quantity, setQuantity] = useState('1')
  const [price, setPrice] = useState('')
  const { addItem } = useCart()
  const [measurement, setMeasurement] = useState<Measurement | null>(null)

  // Reset quantity and price when dialog opens with a new product
  useEffect(() => {
    if (open && product) {
      setQuantity('1')
      setPrice(product.price.toFixed(2))
    }
  }, [open, product])

  // Load measurement information when dialog opens
  useEffect(() => {
    const loadMeasurement = async () => {
      if (product?.measureId) {
        const { data } = await getMeasurements()
        if (data) {
          const productMeasurement = data.find(
            (m) => m.id === product.measureId
          )
          if (productMeasurement) {
            setMeasurement(productMeasurement)
          }
        }
      } else if (product?.isSpecialProduct) {
        // Set default measurement for special products
        setMeasurement({ id: 0, amount: 1, unit: 'pcs' })
      } else {
        setMeasurement(null)
      }
    }
    if (open) {
      loadMeasurement()
    }
  }, [open, product?.measureId, product?.isSpecialProduct])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    const qty = parseFloat(quantity)
    const finalPrice = product.isSpecialProduct
      ? parseFloat(price)
      : product.price

    if (
      qty > 0 &&
      (!product.isSpecialProduct || (finalPrice && finalPrice > 0))
    ) {
      const productToAdd = product.isSpecialProduct
        ? { ...product, price: finalPrice }
        : product
      addItem(productToAdd, qty)
      onOpenChange(false)
    }
  }

  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add to Cart - {product.name}</DialogTitle>
          {!product.isSpecialProduct && (
            <DialogDescription>
              {product.price.toFixed(2)}€ per unit
              {measurement && (
                <div className="mt-1 text-sm">
                  1 unit = {measurement.amount} {measurement.unit}
                </div>
              )}
            </DialogDescription>
          )}
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {product.isSpecialProduct && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="price" className="text-right">
                  Price
                </label>
                <div className="col-span-3">
                  <PriceInput quantity={price} onQuantityChange={setPrice} />
                </div>
              </div>
            )}
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
              <div className="flex flex-row justify-between col-span-3 mr-8">
                {(
                  (product.isSpecialProduct
                    ? parseFloat(price) || 0
                    : product.price) * parseFloat(quantity || '0')
                ).toFixed(2)}
                €
                {measurement && (
                  <div className="mt-1 text-sm text-muted-foreground">
                    {(measurement.amount * parseFloat(quantity || '0')).toFixed(
                      2
                    )}{' '}
                    {measurement.unit}
                  </div>
                )}
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
