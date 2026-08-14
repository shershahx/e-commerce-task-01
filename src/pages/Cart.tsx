import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Your cart is empty</h2>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          Looks like you haven't added anything to your cart yet. Discover our latest products and find something you love.
        </p>
        <Link 
          to="/"
          className="inline-flex items-center space-x-2 bg-slate-900 text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors"
        >
          <span>Continue Shopping</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-light text-slate-800 tracking-tight mb-8">Shopping Bag</h1>
      
      <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-start">
        <div className="lg:col-span-8">
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.product.id} className="flex flex-col sm:flex-row items-center sm:items-start bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm relative">
                <Link to={`/product/${item.product.id}`} className="w-full sm:w-32 h-40 sm:h-32 flex-shrink-0 mb-4 sm:mb-0 bg-gray-50 rounded-xl overflow-hidden">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>
                
                <div className="sm:ml-6 flex-1 flex flex-col w-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold text-slate-700 mb-1">
                        <Link to={`/product/${item.product.id}`}>{item.product.name}</Link>
                      </h3>
                      <p className="text-xs text-slate-400 mb-4">{item.product.category}</p>
                    </div>
                    <p className="text-sm font-mono font-bold text-indigo-600">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-10 text-center text-xs font-bold text-slate-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-slate-300 hover:text-red-400 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-4 mt-12 lg:mt-0">
          <div className="bg-white border-l border-slate-200 p-8 sticky top-24">
            <h2 className="font-bold text-sm tracking-tight text-slate-800 mb-6">Shopping Bag</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Shipping</span>
                <span className="font-mono">Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Tax</span>
                <span className="font-mono">Calculated at checkout</span>
              </div>
            </div>
            
            <div className="border-t border-slate-100 pt-6 mb-8 flex justify-between items-end">
              <span className="text-sm font-bold text-slate-800">Total</span>
              <span className="text-xl font-mono text-indigo-600 font-bold">${totalPrice.toFixed(2)}</span>
            </div>
            
            <button
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-center space-x-2 bg-slate-900 text-white py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors"
            >
              <span>Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
