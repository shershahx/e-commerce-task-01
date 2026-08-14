import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
      <Link to={`/product/${product.id}`} className="aspect-square bg-slate-50 rounded-xl mb-4 relative overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {!product.inStock && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-white/80 backdrop-blur text-[10px] font-bold rounded-md uppercase tracking-wide">
            Out of Stock
          </div>
        )}
      </Link>
      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <Link to={`/product/${product.id}`}>
              <h4 className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{product.name}</h4>
            </Link>
            <p className="text-xs text-slate-400">{product.category}</p>
          </div>
          <span className="text-sm font-mono font-bold text-indigo-600">${product.price.toFixed(2)}</span>
        </div>
        
        <button
          onClick={() => addToCart(product)}
          disabled={!product.inStock}
          className={`w-full mt-auto py-2 border-2 rounded-xl text-xs font-bold transition-all ${
            product.inStock 
              ? 'border-slate-100 group-hover:border-indigo-600 group-hover:text-indigo-600 bg-white text-slate-800' 
              : 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed'
          }`}
        >
          {product.inStock ? 'Add to Cart' : 'Sold Out'}
        </button>
      </div>
    </div>
  );
}
