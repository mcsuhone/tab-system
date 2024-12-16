import { useQuery } from '@tanstack/react-query'
import { ProductFilters, getProducts } from '@/app/actions/products'

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => getProducts(filters)
  })
}
