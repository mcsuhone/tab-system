'use client'

import { Product } from '@/db/schema'
import { Card, CardContent } from '@/components/ui/card'
import { useState } from 'react'
import { AddToCartDialog } from '../cart/add-to-cart-dialog'
import { Beer, Martini, DollarSign } from 'lucide-react'

interface SpecialProductsProps {
  products: Product[]
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

export function SpecialProducts({ products }: SpecialProductsProps) {
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => {
          const config = specialProductConfigs[product.name]
          if (!config) return null

          return (
            <Card
              key={product.id}
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => handleProductClick(product)}
            >
              <CardContent className="p-4 flex items-center gap-2">
                <span className={config.color}>{config.icon}</span>
                <span className="font-medium">{config.title}</span>
              </CardContent>
            </Card>
          )
        })}
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
