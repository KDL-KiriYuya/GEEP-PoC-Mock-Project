'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface HeaderProps {
  cartItemCount: number
}

export default function Header({ cartItemCount }: HeaderProps) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      setIsLoggedIn(true)
      // Fetch user info
      fetch('http://localhost:8000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => setUsername(data.username))
        .catch(() => {
          // Token invalid, clear it
          localStorage.removeItem('access_token')
          setIsLoggedIn(false)
        })
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    setIsLoggedIn(false)
    setUsername('')
    router.push('/login')
  }

  return (
    <header style={{
      backgroundColor: '#333',
      color: 'white',
      padding: '1rem 2rem',
      marginBottom: '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          <Link href="/">E-Commerce</Link>
        </div>
        
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link href="/products" style={{ 
            padding: '0.5rem 1rem',
            transition: 'opacity 0.2s'
          }}>
            Products
          </Link>
          
          <Link href="/cart" style={{
            padding: '0.5rem 1rem',
            position: 'relative',
            transition: 'opacity 0.2s'
          }}>
            Cart
            {cartItemCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '0',
                right: '0',
                backgroundColor: '#e74c3c',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}>
                {cartItemCount}
              </span>
            )}
          </Link>

          {isLoggedIn ? (
            <>
              <Link href="/profile" style={{ 
                padding: '0.5rem 1rem',
                fontSize: '0.9rem',
                transition: 'opacity 0.2s',
                color: '#ccc'
              }}>
                {username}
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#e74c3c',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c0392b'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e74c3c'}
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3498db',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}>
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
