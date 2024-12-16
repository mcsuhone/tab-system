'use client'

import { useQuery } from '@tanstack/react-query'
import { getProducts } from '@/app/actions/products'

export function useSpecialProducts() {
  return useQuery({
    queryKey: ['special-products'],
    queryFn: async () => {
      const result = await getProducts({})
      return {
        data: result.data?.filter((p) => p.isSpecialProduct) || []
      }
    }
  })
}
