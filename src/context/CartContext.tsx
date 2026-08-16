import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '../types';
import { api } from '../api/client';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loadServerCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function loadLocalCart(): CartItem[] {
  try {
    const raw = localStorage.getItem('cart_items');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadLocalCart);

  const isAuthed = () => !!localStorage.getItem('auth_token');

  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(items));
  }, [items]);

  const loadServerCart = async () => {
    if (!isAuthed()) return;
    try {
      const serverCart = await api.get<CartItem[]>('/cart');
      setItems(serverCart);
    } catch {
      // keep local cart if server is unreachable
    }
  };

  const addToCart = async (product: Product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { product, quantity }];
    });

    if (isAuthed()) {
      api.post('/cart', { productId: product.id, quantity }).catch(() => null);
    }
  };

  const removeFromCart = async (productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
    if (isAuthed()) {
      api.delete(`/cart/${productId}`).catch(() => null);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(i => i.product.id === productId ? { ...i, quantity } : i)
    );
    if (isAuthed()) {
      api.put(`/cart/${productId}`, { quantity }).catch(() => null);
    }
  };

  const clearCart = async () => {
    setItems([]);
    if (isAuthed()) {
      api.delete('/cart').catch(() => null);
    }
  };

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart,
      loadServerCart, totalItems, totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
