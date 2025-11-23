'use client';

import { useReducer, useCallback } from 'react';
import { cartReducer, initialCartState } from '@/lib/cartReducer';
import { Product } from '@/lib/types';

export function useCart() {
  const [cart, dispatch] = useReducer(cartReducer, initialCartState);

  // BUG-FE-001: Using stale closure reference causes cart badge not to update on first add
  // The bug is that we're capturing the initial cart state in the closure
  // and not properly triggering re-renders on first addition
  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    // This creates a stale closure - the cart reference here is from initial render
    // On first add, the component using this hook won't re-render properly
    const currentItemCount = cart.itemCount; // Stale reference
    
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
    
    // The bug: we're reading from stale cart state instead of letting
    // the reducer handle the state update properly
    // This causes the badge to not update until the second interaction
  }, []); // Empty dependency array is the bug - should include cart or dispatch

  const removeFromCart = useCallback((product_id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { product_id } });
  }, []);

  const updateQuantity = useCallback((product_id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { product_id, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
}
