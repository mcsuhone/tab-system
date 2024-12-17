'use client'

import { ProductCategory, productCategoryEnum } from '@/db/schema'
import { categoryDisplayNames } from '@/lib/product-categories'
import Link from 'next/link'

const PRODUCT_CATEGORIES = Object.values(
  productCategoryEnum.enumValues
) as ProductCategory[]

interface CategoryNavProps {
  activeCategory: ProductCategory | null
  onCategorySelect: (category: ProductCategory | null) => void
}

export function CategoryNav({
  activeCategory,
  onCategorySelect
}: CategoryNavProps) {
  return (
    <nav className="w-48 pr-4 border-r">
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => onCategorySelect(null)}
            className={`w-full text-left block p-2 rounded-md hover:bg-accent ${
              activeCategory === null ? 'bg-accent text-sm' : 'text-sm'
            }`}
          >
            All Products
          </button>
        </li>
        {PRODUCT_CATEGORIES.map((category) => (
          <li key={category}>
            <button
              onClick={() => onCategorySelect(category)}
              className={`w-full text-left block p-2 rounded-md hover:bg-accent ${
                activeCategory === category ? 'bg-accent text-sm' : 'text-sm'
              }`}
            >
              {categoryDisplayNames[category]}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
