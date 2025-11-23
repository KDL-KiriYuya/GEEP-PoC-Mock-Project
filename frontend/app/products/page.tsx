'use client'

import { useEffect, useState } from 'react';
import { getProducts } from '@/lib/actions';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/hooks/useCart';

interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  page_size: number;
  error?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      
      const result: ProductListResponse = await getProducts(page, pageSize);
      
      if (result.error) {
        setError(result.error);
      } else {
        setProducts(result.items);
        setTotal(result.total);
      }
      
      setLoading(false);
    }

    fetchProducts();
  }, [page, pageSize]);

  const totalPages = Math.ceil(total / pageSize);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Products</h1>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Products</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <>
          {/* Product Grid - BUG-FE-003: Using Math.random() for keys causes hydration error */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard
                key={Math.random()} // BUG-FE-003: This causes hydration mismatch
                product={product}
                onAddToCart={(product) => addToCart(product, 1)}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="text-gray-700">
              Page {page} of {totalPages}
            </span>
            
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
