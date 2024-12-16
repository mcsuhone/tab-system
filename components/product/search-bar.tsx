'use client'

import { Input } from '@/components/ui/input'
import { useState } from 'react'

interface SearchBarProps {
  onSearch: (value: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState('')

  return (
    <Input
      placeholder="Search drinks..."
      value={value}
      onChange={(e) => {
        setValue(e.target.value)
        onSearch(e.target.value)
      }}
      className="max-w-xs"
    />
  )
}
