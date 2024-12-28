'use client'

import { getProducts } from '@/app/actions/products'
import { Product, ProductCategory } from '@/db/schema'
import { useEffect, useState, useCallback, useRef } from 'react'

interface ProductWrapperProps {
  children: (
    products: Product[],
    isLoading: boolean,
    hasMore: boolean
  ) => React.ReactNode
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
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const observer = useRef<IntersectionObserver>()
  const loadingRef = useRef<HTMLDivElement>(null)

  const loadProducts = useCallback(
    async (pageNum: number) => {
      try {
        setIsLoading(true)
        const result = await getProducts({
          showDisabled,
          category,
          page: pageNum
        })

        if (result.data) {
          if (pageNum === 1) {
            setProducts(result.data)
          } else {
            setProducts((prev) => [...prev, ...result.data])
          }
          setHasMore(result.pagination?.hasMore ?? false)
        }
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [showDisabled, category]
  )

  useEffect(() => {
    loadProducts(1)
  }, [loadProducts])

  useEffect(() => {
    if (isLoading) return

    if (observer.current) {
      observer.current.disconnect()
    }

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prev) => prev + 1)
        loadProducts(page + 1)
      }
    })

    if (loadingRef.current) {
      observer.current.observe(loadingRef.current)
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [isLoading, hasMore, loadProducts, page])

  return (
    <>
      {children(products, isLoading, hasMore)}
      <div ref={loadingRef} style={{ height: '20px' }} />
    </>
  )
}
