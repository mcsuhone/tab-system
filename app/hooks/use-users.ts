import { useInfiniteQuery } from '@tanstack/react-query'
import { getUsers } from '@/app/actions/users'
import { useEffect } from 'react'

export interface UsersFilters {
  query?: string
  limit?: number
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
    queryKey: ['users', filters],
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

  useEffect(() => {
    const handleScroll = () => {
      const scrolledToBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100
      if (scrolledToBottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

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
