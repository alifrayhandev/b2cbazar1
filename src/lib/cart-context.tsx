'use client'
import { createContext, useContext, useEffect, useReducer } from 'react'
import type { CartItem } from '@/types'

type CartAction =
  | { type: 'ADD'; item: CartItem }
  | { type: 'REMOVE'; product_id: string }
  | { type: 'UPDATE'; product_id: string; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'LOAD'; items: CartItem[] }

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find(i => i.product_id === action.item.product_id)
      if (existing) {
        const newQty = Math.min(existing.quantity + action.item.quantity, action.item.stock_quantity)
        return state.map(i => i.product_id === action.item.product_id ? { ...i, quantity: newQty } : i)
      }
      return [...state, action.item]
    }
    case 'REMOVE':
      return state.filter(i => i.product_id !== action.product_id)
    case 'UPDATE':
      return state.map(i =>
        i.product_id === action.product_id
          ? { ...i, quantity: Math.max(1, Math.min(action.quantity, i.stock_quantity)) }
          : i
      )
    case 'CLEAR':
      return []
    case 'LOAD':
      return action.items
    default:
      return state
  }
}

interface CartContextType {
  items: CartItem[]
  add: (item: CartItem) => void
  remove: (product_id: string) => void
  update: (product_id: string, quantity: number) => void
  clear: () => void
  totalItems: number
  subtotal: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, [])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('b2cbazar_cart')
      if (saved) dispatch({ type: 'LOAD', items: JSON.parse(saved) })
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('b2cbazar_cart', JSON.stringify(items))
  }, [items])

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items,
      add: (item) => dispatch({ type: 'ADD', item }),
      remove: (id) => dispatch({ type: 'REMOVE', product_id: id }),
      update: (id, qty) => dispatch({ type: 'UPDATE', product_id: id, quantity: qty }),
      clear: () => dispatch({ type: 'CLEAR' }),
      totalItems,
      subtotal,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
