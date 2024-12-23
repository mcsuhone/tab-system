'use client'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ProductCategory, productCategoryEnum } from '@/db/schema'
import { categoryDisplayNames } from '@/lib/product-categories'
import { PanelLeft } from 'lucide-react'

const PRODUCT_CATEGORIES = Object.values(
  productCategoryEnum.enumValues
) as ProductCategory[]

interface CategoryNavProps {
  activeCategory: ProductCategory | null
  onCategorySelect: (category: ProductCategory | null) => void
}

function CategoryList({ activeCategory, onCategorySelect }: CategoryNavProps) {
  return (
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
  )
}

export function CategoryNav({
  activeCategory,
  onCategorySelect
}: CategoryNavProps) {
  return (
    <>
      {/* Mobile View */}
      <div className="sm:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <PanelLeft className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <div className="mt-8">
              <CategoryList
                activeCategory={activeCategory}
                onCategorySelect={onCategorySelect}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop View */}
      <nav className="hidden sm:block w-48 pr-4 border-r">
        <CategoryList
          activeCategory={activeCategory}
          onCategorySelect={onCategorySelect}
        />
      </nav>
    </>
  )
}
