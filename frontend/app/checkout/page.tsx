'use client'

import { useCart } from '@/hooks/useCart'
import { createOrder } from '@/lib/actions'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CheckoutPage() {
  const { cart, clearCart } = useCart()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState<number | null>(null)

  // Calculate total amount from cart items
  const totalAmount = cart.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity)
  }, 0)

  const handlePlaceOrder = async () => {
    // Clear any previous errors
    setError(null)
    setIsProcessing(true)

    try {
      // Prepare order data
      const orderData = {
        user_id: 'demo-user',
        items: cart.items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        }))
      }

      // Call the createOrder Server Action
      const result = await createOrder(orderData)

      if (result.error) {
        // Display error message to user
        setError(result.error)
        setIsProcessing(false)
      } else if (result.order) {
        // Success - clear cart and show success message
        setSuccess(true)
        setOrderId(result.order.id)
        clearCart()
        setIsProcessing(false)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      setIsProcessing(false)
    }
  }

  // If cart is empty, show message
  if (cart.items.length === 0 && !success) {
    return (
      <div style={{ padding: '2rem 0' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
          Checkout
        </h1>
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
      </div>
    )
  }

  // Success state
  if (success) {
    return (
      <div style={{ padding: '2rem 0' }}>
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: '#d4edda',
          borderRadius: '8px',
          border: '1px solid #c3e6cb'
        }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#155724', marginBottom: '1rem' }}>
            Order Placed Successfully!
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#155724', marginBottom: '0.5rem' }}>
            Thank you for your order.
          </p>
          {orderId && (
            <p style={{ fontSize: '1rem', color: '#155724', marginBottom: '2rem' }}>
              Order ID: #{orderId}
            </p>
          )}
          <Link
            href="/products"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#27ae60',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: '500',
              marginRight: '1rem'
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  // Checkout form
  return (
    <div style={{ padding: '2rem 0' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        Checkout
      </h1>

      {/* Error Message */}
      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          color: '#721c24',
          marginBottom: '1.5rem'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Order Summary */}
      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '1px solid #ddd',
        marginBottom: '2rem'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
          Order Summary
        </h2>

        {/* Order Items */}
        <div style={{ marginBottom: '1.5rem' }}>
          {cart.items.map((item) => (
            <div
              key={item.product_id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 0',
                borderBottom: '1px solid #ddd'
              }}
            >
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                  {item.name}
                </p>
                <p style={{ fontSize: '0.875rem', color: '#666' }}>
                  Quantity: {item.quantity} × ¥{item.price.toLocaleString()}
                </p>
              </div>
              <p style={{ fontWeight: '600', fontSize: '1.125rem' }}>
                ¥{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '1rem',
          borderTop: '2px solid #333'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
            Total Amount:
          </h3>
          <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>
            ¥{totalAmount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link
          href="/cart"
          style={{
            flex: 1,
            padding: '1rem',
            backgroundColor: '#95a5a6',
            color: 'white',
            textAlign: 'center',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '1.125rem',
            fontWeight: '600'
          }}
        >
          Back to Cart
        </Link>
        <button
          onClick={handlePlaceOrder}
          disabled={isProcessing}
          style={{
            flex: 2,
            padding: '1rem',
            backgroundColor: isProcessing ? '#95a5a6' : '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1.125rem',
            fontWeight: '600',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => {
            if (!isProcessing) {
              e.currentTarget.style.backgroundColor = '#229954'
            }
          }}
          onMouseOut={(e) => {
            if (!isProcessing) {
              e.currentTarget.style.backgroundColor = '#27ae60'
            }
          }}
        >
          {isProcessing ? 'Processing...' : 'Place Order'}
        </button>
      </div>
    </div>
  )
}
