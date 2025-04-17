'use client'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useEffect, useState, memo } from 'react'

interface SearchBarProps {
  value: string
  onSearch: (value: string) => void
  placeholder?: string
  className?: string
}

export const SearchBar = memo(
  ({
    value,
    onSearch,
    placeholder = 'Search drinks...',
    className
  }: SearchBarProps) => {
    const [internalValue, setInternalValue] = useState(value)

    useEffect(() => {
      setInternalValue(value)
    }, [value])

    useEffect(() => {
      const timer = setTimeout(() => {
        onSearch(internalValue)
      }, 300)

      return () => clearTimeout(timer)
    }, [internalValue, onSearch])

    return (
      <Input
        placeholder={placeholder}
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        className={cn('max-w-xs ring-offset-0', className)}
      />
    )
  }
)
SearchBar.displayName = 'SearchBar'
