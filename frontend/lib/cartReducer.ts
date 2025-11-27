import { Cart, CartItem, Product } from './types';

export type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { product_id: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { product_id: number; quantity: number } }
  | { type: 'CLEAR_CART' };

export const initialCartState: Cart = {
  items: [],
  itemCount: 0,
  totalAmount: 0,
};

function calculateCartTotals(items: CartItem[]): { itemCount: number; totalAmount: number } {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { itemCount, totalAmount };
}

export function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.product_id === product.id
      );

      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        // Update existing item
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity,
          image_url: product.image_url,
        };
        newItems = [...state.items, newItem];
      }

      const totals = calculateCartTotals(newItems);
      return {
        items: newItems,
        ...totals,
      };
    }

    case 'REMOVE_ITEM': {
      const { product_id } = action.payload;
      const newItems = state.items.filter((item) => item.product_id !== product_id);
      const totals = calculateCartTotals(newItems);
      return {
        items: newItems,
        ...totals,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { product_id, quantity } = action.payload;
      // BUG-FE-002: No validation on quantity - allows zero and negative values
      const newItems = state.items.map((item) =>
        item.product_id === product_id ? { ...item, quantity } : item
      );
      const totals = calculateCartTotals(newItems);
      return {
        items: newItems,
        ...totals,
      };
    }

    case 'CLEAR_CART': {
      return initialCartState;
    }

    default:
      return state;
  }
}
