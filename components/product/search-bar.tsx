'use client'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

interface SearchBarProps {
  onSearch: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({
  onSearch,
  placeholder = 'Search drinks...',
  className
}: SearchBarProps) {
  const [value, setValue] = useState('')

  // Add debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value)
    }, 300) // 1 second delay

    return () => clearTimeout(timer)
  }, [value, onSearch])

  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={cn('max-w-xs ring-offset-0', className)}
    />
  )
}
