'use client'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ProductCategory, productCategoryEnum } from '@/db/schema'
import { categoryDisplayNames } from '@/lib/product-categories'
import { PanelLeft } from 'lucide-react'
import { useEffect, useState } from 'react'

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
  const [shouldNudge, setShouldNudge] = useState(false)

  useEffect(() => {
    const handleIntersection = (e: Event) => {
      const customEvent = e as CustomEvent
      setShouldNudge(!customEvent.detail.isIntersecting)
    }

    window.addEventListener('search-intersection', handleIntersection)
    return () => {
      window.removeEventListener('search-intersection', handleIntersection)
    }
  }, [])

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden">
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
      <nav
        className={`hidden md:block transition-all duration-200 ${shouldNudge ? 'ml-4' : ''}`}
      >
        <CategoryList
          activeCategory={activeCategory}
          onCategorySelect={onCategorySelect}
        />
      </nav>
    </>
  )
}
