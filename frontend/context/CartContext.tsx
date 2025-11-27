'use client'

import { createContext, useContext, useMemo, useReducer, useCallback } from 'react'
import { cartReducer, initialCartState } from '@/lib/cartReducer'
import { Cart, Product } from '@/lib/types'

type CartContextValue = {
  cart: Cart
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (product_id: number) => void
  updateQuantity: (product_id: number, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, initialCartState)

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } })
  }, [])

  const removeFromCart = useCallback((product_id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { product_id } })
  }, [])

  const updateQuantity = useCallback((product_id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { product_id, quantity } })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' })
  }, [])

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [cart, addToCart, removeFromCart, updateQuantity, clearCart]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCartContext(): CartContextValue {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

