'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Minus, Plus } from 'lucide-react'

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
  const handleIncrement = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const newValue = (parseFloat(quantity) + 0.5).toString()
    if (!max || parseFloat(newValue) <= parseFloat(max)) {
      onQuantityChange(newValue)
    }
  }

  const handleDecrement = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const newValue = (parseFloat(quantity) - 0.5).toString()
    if (parseFloat(newValue) >= parseFloat(min)) {
      onQuantityChange(newValue)
    }
  }

  return (
    <div className="relative w-full min-w-[120px] max-w-[160px]">
      <Input
        type="number"
        value={quantity}
        onChange={(e) => onQuantityChange(e.target.value)}
        step="0.5"
        min={min}
        max={max}
        className="w-full text-center px-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-0 h-full w-10 hover:bg-transparent"
        onClick={handleDecrement}
        disabled={parseFloat(quantity) <= parseFloat(min)}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full w-10 hover:bg-transparent"
        onClick={handleIncrement}
        disabled={max ? parseFloat(quantity) >= parseFloat(max) : false}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}
