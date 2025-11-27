import type { Metadata } from 'next'
import './globals.css'
import LayoutWrapper from '@/components/LayoutWrapper'
import { CartProvider } from '@/context/CartContext'

export const metadata: Metadata = {
  title: 'E-Commerce Mock Site',
  description: 'A simple e-commerce site for practicing spec-driven development',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </CartProvider>
      </body>
    </html>
  )
}
