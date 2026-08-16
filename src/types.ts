export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  subtotal: number;
  shipping: number;
  total: number;
  email?: string;
  createdAt: string;
  itemCount?: number;
  items?: OrderItem[];
}
