'use client'

import { getProducts } from '@/app/actions/products'
import { Product, ProductCategory } from '@/db/schema'
import { useEffect, useState } from 'react'

interface ProductWrapperProps {
  children: (products: Product[], isLoading: boolean) => React.ReactNode
  showDisabled?: boolean
  category?: ProductCategory
}

export function ProductWrapper({
  children,
  showDisabled = false,
  category
}: ProductWrapperProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    getProducts({ showDisabled, category })
      .then((result) => {
        if (result.data) {
          setProducts(result.data)
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [showDisabled, category])

  return <>{children(products, isLoading)}</>
}
