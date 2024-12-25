import { useEffect, useState, useRef } from 'react'

export function useIntersection(options?: IntersectionObserverInit) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const targetRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    observer.observe(target)

    return () => {
      observer.unobserve(target)
      observer.disconnect()
    }
  }, [options])

  return { targetRef, isIntersecting }
}
