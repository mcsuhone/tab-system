'use client'

import { Input } from '@/components/ui/input'

interface QuantitySelectorProps {
  quantity: string
  onQuantityChange: (newQuantity: string) => void
  min?: string
  max?: string
}

export function QuantitySelector({
  quantity,
  onQuantityChange,
  min = '0.5',
  max
}: QuantitySelectorProps) {
  return (
    <Input
      type="number"
      value={quantity}
      onChange={(e) => onQuantityChange(e.target.value)}
      step="0.5"
      min={min}
      max={max}
      className="w-24 text-center"
    />
  )
}
