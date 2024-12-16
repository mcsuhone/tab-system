'use client'

import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'

interface SearchBarProps {
  onSearch: (value: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState('')
  const [debouncedValue, setDebouncedValue] = useState('')

  // Add debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, 300) // 1 second delay

    return () => clearTimeout(timer)
  }, [value])

  // Trigger search only when debounced value changes
  useEffect(() => {
    onSearch(debouncedValue)
  }, [debouncedValue, onSearch])

  return (
    <Input
      placeholder="Search drinks..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="max-w-xs"
    />
  )
}
