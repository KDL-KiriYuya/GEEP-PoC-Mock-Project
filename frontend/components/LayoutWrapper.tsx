'use client'

import { useCart } from '@/hooks/useCart'
import Header from './Header'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { cart } = useCart()
  
  return (
    <>
      <Header cartItemCount={cart.itemCount} />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        {children}
      </main>
    </>
  )
}
