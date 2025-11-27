'use client'

import { CartItem as CartItemType } from '@/lib/types'

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (product_id: number, quantity: number) => void
  onRemove: (product_id: number) => void
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  // BUG-FE-002: No validation on quantity input - allows zero and negative values
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Number(e.target.value);
    const clamped = Math.max(1, Number.isFinite(raw) ? Math.floor(raw) : 1);
    onUpdateQuantity(item.product_id, clamped);
  }

  const subtotal = item.price * item.quantity

  return (
    <div style={{
      display: 'flex',
      gap: '1rem',
      padding: '1rem',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: 'white'
    }}>
      {/* Product Image */}
      <div style={{ flexShrink: 0 }}>
        <img
          src="/product~image.png"
          alt={item.name}
          style={{
            width: '100px',
            height: '100px',
            objectFit: 'cover',
            borderRadius: '4px'
          }}
        />
      </div>

      {/* Product Details */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
          {item.name}
        </h3>
        
        <p style={{ color: '#666', margin: 0 }}>
          Price: ¥{item.price.toLocaleString()}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label htmlFor={`quantity-${item.product_id}`} style={{ fontWeight: '500' }}>
            Quantity:
          </label>
          <input
            id={`quantity-${item.product_id}`}
            type="number"
            value={item.quantity}
            onChange={handleQuantityChange}
            style={{
              width: '80px',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
            // BUG-FE-002: No min attribute to prevent zero/negative values
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <p style={{ fontSize: '1.125rem', fontWeight: 'bold', margin: 0 }}>
            Subtotal: ¥{subtotal.toLocaleString()}
          </p>
          
          <button
            onClick={() => onRemove(item.product_id)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c0392b'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e74c3c'}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}
