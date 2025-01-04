'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'

interface PriceInputProps {
  price: string
  onPriceChange: (value: string) => void
  min?: string
  max?: string
}

const PriceInput = ({
  price,
  onPriceChange,
  min = '0',
  max
}: PriceInputProps) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleIncrement = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const newValue = (parseFloat(price) + 0.5).toString()
    if (!max || parseFloat(newValue) <= parseFloat(max)) {
      onPriceChange(newValue)
    }
  }

  const handleDecrement = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const newValue = (parseFloat(price) - 0.5).toString()
    if (parseFloat(newValue) >= parseFloat(min)) {
      onPriceChange(newValue)
    }
  }

  const formatPrice = (value: string) => {
    const number = parseFloat(value)
    return number.toLocaleString('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.currentTarget.blur()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(',', '.')
    onPriceChange(value)
  }

  return (
    <div className="relative w-full max-w-[160px]">
      <motion.div
        key={price}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
        className="h-full"
      >
        {!isFocused && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <span>{formatPrice(price)}&nbsp;€</span>
          </div>
        )}
        <Input
          type="number"
          value={price}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          min={min}
          max={max}
          step="any"
          className={`w-full text-center px-10 ${
            !isFocused ? 'text-transparent' : ''
          } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
        />
      </motion.div>

      <Button
        variant="ghost"
        size="icon"
        tabIndex={-1}
        className="absolute left-0 top-0 h-full w-10 hover:bg-transparent"
        onClick={handleDecrement}
        disabled={parseFloat(price) <= parseFloat(min)}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        tabIndex={-1}
        className="absolute right-0 top-0 h-full w-10 hover:bg-transparent"
        onClick={handleIncrement}
        disabled={max ? parseFloat(price) >= parseFloat(max) : false}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default PriceInput
