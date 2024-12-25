'use client'

import { ProductCategory } from '@/db/schema'
import { createContext, useContext, useState, ReactNode } from 'react'

interface SearchContextType {
  query: string
  setQuery: (query: string) => void
  category: ProductCategory | null
  setCategory: (category: ProductCategory | null) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function useSearch() {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

interface SearchProviderProps {
  children: ReactNode
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<ProductCategory | null>(null)

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        category,
        setCategory
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}
