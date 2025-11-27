'use server'

import { Product, OrderCreateRequest } from './types';

// Type declaration for Node.js process in Next.js server context
declare const process: {
  env: {
    BACKEND_URL?: string;
    [key: string]: string | undefined;
  };
};

// Get backend URL from environment variable
// In Next.js server actions, process.env is available at runtime
function getBackendUrl(): string {
  return process.env.BACKEND_URL || 'http://localhost:8000';
}

/**
 * Server Action to fetch paginated products from the backend API
 * @param page - Page number (default: 1)
 * @param pageSize - Number of items per page (default: 20)
 * @returns Product list response with items, total, page, and page_size
 */
export async function getProducts(page: number = 1, pageSize: number = 20) {
  try {
    const response = await fetch(
      `${getBackendUrl()}/api/products?page=${page}&page_size=${pageSize}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Ensure fresh data on each request
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch products' }));
      return {
        error: errorData.detail || `Failed to fetch products: ${response.status}`,
        items: [],
        total: 0,
        page,
        page_size: pageSize,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      error: 'Unable to connect to server. Please check your connection.',
      items: [],
      total: 0,
      page,
      page_size: pageSize,
    };
  }
}

/**
 * Server Action to fetch a single product by ID
 * @param id - Product ID
 * @returns Product details or error
 */
export async function getProduct(id: number) {
  try {
    const response = await fetch(
      `${getBackendUrl()}/api/products/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return {
          error: 'Product not found',
        };
      }
      
      const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch product' }));
      return {
        error: errorData.detail || `Failed to fetch product: ${response.status}`,
      };
    }

    const data: Product = await response.json();
    return { product: data };
  } catch (error) {
    console.error('Error fetching product:', error);
    return {
      error: 'Unable to connect to server. Please check your connection.',
    };
  }
}

/**
 * Server Action to create a new order
 * @param orderData - Order creation request with user_id and items
 * @returns Order response with order_id, status, total_amount, and created_at, or error
 */
export async function createOrder(orderData: OrderCreateRequest) {
  try {
    const response = await fetch(
      `${getBackendUrl()}/api/orders`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Failed to create order' }));
      
      // Handle specific error cases
      if (response.status === 400) {
        // Bad request - likely validation error or insufficient stock
        return {
          error: errorData.detail || 'Invalid order data or insufficient stock',
        };
      }
      
      return {
        error: errorData.detail || `Failed to create order: ${response.status}`,
      };
    }

    const data = await response.json();
    return { order: data };
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      error: 'Unable to connect to server. Please check your connection.',
    };
  }
}
