'use client'

import { useQuery } from '@tanstack/react-query'
import { getProducts } from '@/app/actions/products'

export function useSpecialProducts() {
  return useQuery({
    queryKey: ['special-products'],
    queryFn: async () => {
      const result = await getProducts({})
      return {
        products: result.products?.filter((p) => p.isSpecialProduct) || []
      }
    }
  })
}
