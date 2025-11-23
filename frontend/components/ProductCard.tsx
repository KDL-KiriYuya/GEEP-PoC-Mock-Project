'use client'

import Link from 'next/link';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <img 
        src={product.image_url} 
        alt={product.name}
        className="w-full h-48 object-cover rounded mb-4"
      />
      <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
      <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
      <p className="text-2xl font-bold text-blue-600 mb-4">
        ¥{product.price.toLocaleString()}
      </p>
      <p className="text-sm text-gray-500 mb-4">
        Stock: {product.stock}
      </p>
      <div className="flex gap-2">
        <Link 
          href={`/products/${product.id}`}
          className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center"
        >
          View Details
        </Link>
        <button 
          className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => onAddToCart(product)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
