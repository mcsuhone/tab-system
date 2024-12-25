'use client'

import React from 'react'
import { Button } from '../ui/button'
import { ShoppingCart } from 'lucide-react'
import { useCart } from './cart-provider'
import { useState, useEffect, useRef } from 'react'
import { CartDialog } from './cart-dialog'
import { motion, AnimatePresence } from 'framer-motion'

export function CartButton() {
  const [cartOpen, setCartOpen] = useState(false)
  const { total, items, isLoading } = useCart()
  const [isAnimating, setIsAnimating] = useState(false)
  const prevItemsRef = useRef<number>(0)

  useEffect(() => {
    const uniqueItemCount = items.length
    const prevCount = prevItemsRef.current

    if (uniqueItemCount > prevCount) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 800)
      return () => clearTimeout(timer)
    }
    prevItemsRef.current = uniqueItemCount
  }, [items])

  if (isLoading) {
    return (
      <>
        <Button variant="outline" className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4" />
          <span>Loading...</span>
        </Button>
        <CartDialog open={cartOpen} onOpenChange={setCartOpen} />
      </>
    )
  }

  return (
    <>
      <div className="relative inline-block">
        <AnimatePresence>
          {isAnimating && (
            <motion.div
              initial={{ opacity: 1, y: -20, x: -20 }}
              animate={{ opacity: 0, y: 0, x: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-0 left-1/2 w-3 h-3 bg-primary rounded-full"
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>
        <motion.div
          animate={
            isAnimating
              ? {
                  rotate: [0, -10, 10, -5, 5, 0],
                  transition: { delay: 0.3, duration: 0.5 }
                }
              : {}
          }
        >
          <Button
            onClick={() => setCartOpen(true)}
            className="flex items-center gap-2"
            variant="default"
          >
            <ShoppingCart className="h-4 w-4" />
            <AnimatePresence mode="wait">
              <motion.span
                key={items.length}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="inline-flex items-center gap-2"
              >
                Cart ({items.length})<span>{total.toFixed(2)}€</span>
              </motion.span>
            </AnimatePresence>
          </Button>
        </motion.div>
      </div>
      <CartDialog open={cartOpen} onOpenChange={setCartOpen} />
    </>
  )
}
