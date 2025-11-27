export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  category?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

export interface Cart {
  items: CartItem[];
  itemCount: number;
  totalAmount: number;
}

export interface OrderItem {
  product_id: number;
  quantity: number;
}

export interface OrderCreateRequest {
  user_id: string;
  items: OrderItem[];
}

export interface Order {
  id: number;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  items?: OrderItemDetail[];
}

export interface OrderItemDetail {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
}
