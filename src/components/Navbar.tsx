import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User as UserIcon, LogOut, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          <Link to="/" className="flex items-center space-x-2 text-indigo-600 font-black text-2xl tracking-tighter">
            <Package className="w-6 h-6" />
            <span>EQUIS.</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-slate-500">
            <Link to="/" className="text-slate-900 border-b-2 border-indigo-600 pb-1">Shop</Link>
            <Link to="/" className="hover:text-slate-900 transition-colors">Collections</Link>
            <Link to="/" className="hover:text-slate-900 transition-colors">New Arrivals</Link>
            <Link to="/" className="hover:text-slate-900 transition-colors">Journal</Link>
          </div>
          
          <div className="flex items-center space-x-6">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="text-sm font-bold text-slate-700 hidden sm:block hover:text-indigo-600 transition-colors">
                  My Account
                </Link>
                <button 
                  onClick={logout}
                  className="text-slate-500 hover:text-slate-900 flex items-center space-x-1 text-sm font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link 
                to="/auth" 
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center space-x-1"
              >
                <UserIcon className="w-4 h-4" />
                <span className="hidden sm:block">LOG IN</span>
              </Link>
            )}

            <Link 
              to="/cart" 
              className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-indigo-600 rounded">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
