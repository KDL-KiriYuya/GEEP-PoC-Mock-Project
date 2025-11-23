'use client'

import { useCart } from '@/hooks/useCart'
import CartItem from '@/components/CartItem'
import Link from 'next/link'

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart()

  // Calculate total amount from cart items
  const totalAmount = cart.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity)
  }, 0)

  return (
    <div style={{ padding: '2rem 0' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        Shopping Cart
      </h1>

      {cart.items.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          backgroundColor: '#f9f9f9',
          borderRadius: '8px'
        }}>
          <p style={{ fontSize: '1.25rem', color: '#666', marginBottom: '1rem' }}>
            Your cart is empty
          </p>
          <Link 
            href="/products"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3498db',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: '500'
            }}
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          {/* Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {cart.items.map((item) => (
              <CartItem
                key={item.product_id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          {/* Cart Summary */}
          <div style={{
            backgroundColor: '#f9f9f9',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                Total Amount:
              </h2>
              <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>
                ¥{totalAmount.toLocaleString()}
              </p>
            </div>

            <Link
              href="/checkout"
              style={{
                display: 'block',
                width: '100%',
                padding: '1rem',
                backgroundColor: '#27ae60',
                color: 'white',
                textAlign: 'center',
                textDecoration: 'none',
                borderRadius: '4px',
                fontSize: '1.125rem',
                fontWeight: '600',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#229954'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#27ae60'}
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
