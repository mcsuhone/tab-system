'use client'

import { Product } from '@/db/schema'
import { Card, CardContent } from '@/components/ui/card'
import { useState } from 'react'
import { AddToCartDialog } from '../cart/add-to-cart-dialog'
import { Beer, Martini, DollarSign } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface SpecialProductsProps {
  products: Product[]
  isLoading?: boolean
}

interface SpecialProductConfig {
  title: string
  icon: React.ReactNode
  color: string
}

interface SpecialProductExtended extends Product {
  isOpenPrice?: boolean
  isTapBeer?: boolean
}

const specialProductConfigs: Record<string, SpecialProductConfig> = {
  'Tap Beer': {
    title: 'Tap Beer',
    icon: <Beer className="h-4 w-4" />,
    color: 'text-foreground'
  },
  Cocktail: {
    title: 'Cocktail',
    icon: <Martini className="h-4 w-4" />,
    color: 'text-foreground'
  },
  'Open Price': {
    title: 'Open Price',
    icon: <DollarSign className="h-4 w-4" />,
    color: 'text-foreground'
  }
}

function SpecialProductSkeleton() {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-5 w-28" />
      </CardContent>
    </Card>
  )
}

export function SpecialProducts({ products, isLoading }: SpecialProductsProps) {
  const [selectedProduct, setSelectedProduct] =
    useState<SpecialProductExtended | null>(null)

  const handleProductClick = (product: Product) => {
    setSelectedProduct({
      ...product,
      isOpenPrice: true,
      ...(product.name === 'Tap Beer' ? { isTapBeer: true } : {})
    })
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Special Products</h2>
      <div className="grid grid-cols-3 gap-1 md:gap-4">
        {isLoading ? (
          <>
            <SpecialProductSkeleton />
            <SpecialProductSkeleton />
            <SpecialProductSkeleton />
          </>
        ) : (
          products.map((product) => {
            const config = specialProductConfigs[product.name]
            if (!config) return null

            return (
              <Card
                key={product.id}
                className="flex cursor-pointer hover:bg-accent items-center justify-center transition-colors"
                onClick={() => handleProductClick(product)}
              >
                <CardContent className="p-2 md:p-4 flex items-center gap-2">
                  <span className={config.color}>{config.icon}</span>
                  <span className="font-medium">{config.title}</span>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {selectedProduct && (
        <AddToCartDialog
          product={selectedProduct}
          open={!!selectedProduct}
          onOpenChange={(open) => !open && setSelectedProduct(null)}
        />
      )}
    </div>
  )
}
