import { Button } from '@/components/ui/button'
import { useIntersection } from '@/hooks/use-intersection'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import React, { useEffect, useRef } from 'react'

interface ScrollToTopButtonProps {
  children?: React.ReactNode
  containerRef?: React.RefObject<HTMLDivElement>
}

export function ScrollToTopButton({
  children,
  containerRef
}: ScrollToTopButtonProps) {
  const defaultRef = useRef<HTMLDivElement>(null)
  const { targetRef, isIntersecting } = useIntersection({
    threshold: 0,
    root: containerRef?.current || defaultRef.current,
    rootMargin: '0px'
  })

  const scrollToTop = () => {
    const container = containerRef?.current
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // Fallback to window scroll if no container ref is provided
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Set up an observer target at the top of the container
  useEffect(() => {
    const container = containerRef?.current
    if (container && targetRef.current) {
      const target = targetRef.current
      target.style.position = 'absolute'
      target.style.top = '0'
      target.style.height = '1px'
      target.style.width = '100%'
      container.insertBefore(target, container.firstChild)
    }
  }, [containerRef, targetRef])

  return (
    <>
      <div ref={targetRef as React.RefObject<HTMLDivElement>} />
      {children}
      <AnimatePresence>
        {!isIntersecting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full shadow-lg"
              onClick={scrollToTop}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
