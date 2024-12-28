'use client'

import { ProductCategory } from '@/db/schema'
import { categoryDisplayNames } from '@/lib/product-categories'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'

interface CategoryNavProps {
  activeCategory: ProductCategory | undefined
  onCategorySelect: (category: ProductCategory | undefined) => void
  className?: string
}

export function CategoryNav({
  activeCategory,
  onCategorySelect,
  className
}: CategoryNavProps) {
  return (
    <div className={cn('flex gap-2 overflow-x-auto pb-2 -mb-2', className)}>
      <Button
        variant={!activeCategory ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => onCategorySelect(undefined)}
        className="whitespace-nowrap"
      >
        All
      </Button>
      {Object.entries(categoryDisplayNames).map(([category, displayName]) => (
        <Button
          key={category}
          variant={activeCategory === category ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => onCategorySelect(category as ProductCategory)}
          className="whitespace-nowrap"
        >
          {displayName}
        </Button>
      ))}
    </div>
  )
}
