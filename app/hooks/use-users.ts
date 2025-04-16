import { useInfiniteQuery } from '@tanstack/react-query'
import { getUsers } from '@/app/actions/users'

type SortDirection = 'asc' | 'desc' | null

export interface UsersFilters {
  query?: string
  limit?: number
  sortDirection?: SortDirection
}

export function useUsers(filters: UsersFilters = {}) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch
  } = useInfiniteQuery({
    queryKey: ['users', filters.query, filters.limit, filters.sortDirection],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getUsers({ ...filters, page: pageParam })
      if (!response.success) throw new Error(response.error.description)
      return response.data
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination.hasMore) return undefined
      return lastPage.pagination.currentPage + 1
    },
    initialPageParam: 1
  })

  const allUsers = data?.pages.flatMap((page) => page.data ?? []) ?? []

  return {
    users: allUsers,
    isLoading,
    isLoadingMore: isFetchingNextPage,
    hasMore: hasNextPage,
    error,
    refetch,
    fetchNextPage
  }
}
