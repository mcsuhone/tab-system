'use client'

import { Product } from '@/db/schema'
import { createContext, useContext, useState } from 'react'

interface CartItem {
  product: Product
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity: number) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = (product: Product, quantity: number) => {
    setItems((current) => {
      const existingItem = current.find(
        (item) => item.product.id === product.id
      )
      if (existingItem) {
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...current, { product, quantity }]
    })
  }

  const updateQuantity = (productId: number, quantity: number) => {
    setItems((current) =>
      current.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const removeItem = (productId: number) => {
    setItems((current) =>
      current.filter((item) => item.product.id !== productId)
    )
  }

  const clearCart = () => setItems([])

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
