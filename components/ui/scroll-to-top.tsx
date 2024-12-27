'use client'

import { Button } from '@/components/ui/button'
import { useIntersection } from '@/hooks/use-intersection'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import React from 'react'

export function ScrollToTopButton() {
  const { targetRef, isIntersecting } = useIntersection({
    threshold: 0,
    root: null,
    rootMargin: '0px'
  })

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <div
        ref={targetRef as React.RefObject<HTMLDivElement>}
        className="h-1 w-full absolute top-0"
      />
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