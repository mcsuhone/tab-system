'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Minus, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface QuantitySelectorProps {
  quantity: string
  onQuantityChange: (newQuantity: string) => void
  min?: string
  max?: string
  allowEmpty?: boolean
  className?: string
}

export function QuantitySelector({
  quantity,
  onQuantityChange,
  min = '0.5',
  max,
  allowEmpty = false,
  className
}: QuantitySelectorProps) {
  const effectiveMin = allowEmpty ? '0' : min

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
    if (parseFloat(newValue) >= parseFloat(effectiveMin)) {
      onQuantityChange(newValue)
    }
  }

  return (
    <div className="relative w-full min-w-[80px] max-w-[160px]">
      <motion.div
        key={quantity}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
        className="h-full"
      >
        <Input
          type="number"
          value={quantity}
          onChange={(e) => onQuantityChange(e.target.value)}
          step="0.5"
          min={effectiveMin}
          max={max}
          className={cn(
            'w-full h-full text-center px-6 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
            className
          )}
        />
      </motion.div>
      <Button
        variant="ghost"
        size="icon"
        tabIndex={-1}
        className="absolute left-0 top-0 h-full w-10 hover:bg-transparent focus:bg-transparent active:bg-transparent px-0"
        onClick={handleDecrement}
        disabled={parseFloat(quantity) <= parseFloat(effectiveMin)}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        tabIndex={-1}
        className="absolute right-0 top-0 h-full w-10 hover:bg-transparent focus:bg-transparent active:bg-transparent px-0"
        onClick={handleIncrement}
        disabled={max ? parseFloat(quantity) >= parseFloat(max) : false}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  )
}
