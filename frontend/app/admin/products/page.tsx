'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  image_url: string
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
  })

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem('access_token')
      if (!token) {
        router.push('/login')
        return
      }

      try {
        const res = await fetch('http://localhost:8000/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const user = await res.json()
        
        if (!user.is_superuser) {
          router.push('/products')
          return
        }
        
        setIsAdmin(true)
        fetchProducts()
      } catch (error) {
        router.push('/login')
      }
    }

    checkAdmin()
  }, [router])

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/products?page=1&page_size=100')
      const data = await res.json()
      setProducts(data.items)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    const token = localStorage.getItem('access_token')
    try {
      const res = await fetch('http://localhost:8000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          image_url: '/product-image.jpg'
        })
      })

      if (res.ok) {
        setIsCreating(false)
        setFormData({ name: '', description: '', price: 0, stock: 0 })
        fetchProducts()
      }
    } catch (error) {
      console.error('Failed to create product:', error)
    }
  }

  const handleUpdate = async () => {
    if (!editingProduct) return
    
    const token = localStorage.getItem('access_token')
    try {
      const res = await fetch(`http://localhost:8000/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setEditingProduct(null)
        setFormData({ name: '', description: '', price: 0, stock: 0 })
        fetchProducts()
      }
    } catch (error) {
      console.error('Failed to update product:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    const token = localStorage.getItem('access_token')
    try {
      const res = await fetch(`http://localhost:8000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (res.ok) {
        fetchProducts()
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }

  const startEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
    })
    setIsCreating(false)
  }

  const startCreate = () => {
    setIsCreating(true)
    setEditingProduct(null)
    setFormData({ name: '', description: '', price: 0, stock: 0 })
  }

  const cancelEdit = () => {
    setEditingProduct(null)
    setIsCreating(false)
    setFormData({ name: '', description: '', price: 0, stock: 0 })
  }

  if (loading || !isAdmin) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Manage Products</h1>
        <Button onClick={startCreate}>Add New Product</Button>
      </div>

      {(isCreating || editingProduct) && (
        <Card style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            {isCreating ? 'Create New Product' : 'Edit Product'}
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <Label>Name</Label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  marginTop: '0.25rem'
                }}
              />
            </div>

            <div>
              <Label>Description</Label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  marginTop: '0.25rem',
                  minHeight: '100px'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <Label>Price (¥)</Label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    marginTop: '0.25rem'
                  }}
                />
              </div>

              <div>
                <Label>Stock</Label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    marginTop: '0.25rem'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <Button onClick={isCreating ? handleCreate : handleUpdate}>
                {isCreating ? 'Create' : 'Update'}
              </Button>
              <Button onClick={cancelEdit} variant="outline">Cancel</Button>
            </div>
          </div>
        </Card>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {products.map((product) => (
          <Card key={product.id} style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <img
                src="/product~image.png"
                alt={product.name}
                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
              />
              
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {product.name}
                </h3>
                <p style={{ color: '#666', marginBottom: '0.5rem' }}>{product.description}</p>
                <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
                  <span style={{ fontWeight: 'bold' }}>¥{product.price.toLocaleString()}</span>
                  <span>Stock: {product.stock}</span>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Button onClick={() => startEdit(product)} size="sm">Edit</Button>
                  <Button onClick={() => handleDelete(product.id)} variant="destructive" size="sm">
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
