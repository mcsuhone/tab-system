import { useInfiniteQuery } from '@tanstack/react-query'
import { ProductFilters, getProducts } from '@/app/actions/products'

export function useProducts(filters: ProductFilters = {}) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useInfiniteQuery({
    queryKey: ['products', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getProducts({ ...filters, page: pageParam })
      return response
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination?.hasMore) return undefined
      return lastPage.pagination.currentPage + 1
    },
    initialPageParam: 1
  })

  const allProducts = data?.pages.flatMap((page) => page.data ?? []) ?? []
  const isLoadingMore = isFetchingNextPage

  return {
    data: { products: allProducts },
    isLoading,
    isLoadingMore,
    hasMore: hasNextPage,
    error,
    fetchNextPage
  }
}
