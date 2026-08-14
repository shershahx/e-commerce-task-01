import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import { mockProducts } from '../data';
import { useCart } from '../context/CartContext';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const product = mockProducts.find(p => p.id === id);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Product not found</h2>
        <Link to="/" className="text-indigo-600 hover:underline flex items-center justify-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-slate-500 hover:text-slate-900 transition-colors mb-8 text-sm font-bold"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        BACK
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="bg-slate-50 rounded-2xl overflow-hidden aspect-square border border-slate-100 shadow-sm">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <div className="mb-4 flex items-center space-x-3">
            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md uppercase tracking-widest">
              {product.category}
            </span>
            {!product.inStock && (
              <span className="px-3 py-1 bg-white border border-slate-200 text-slate-400 text-[10px] font-bold rounded-md uppercase tracking-widest">
                Out of Stock
              </span>
            )}
          </div>
          
          <h1 className="text-4xl font-light text-slate-800 tracking-tight mb-4">
            {product.name}
          </h1>
          
          <div className="text-3xl font-mono font-bold text-indigo-600 mb-6">
            ${product.price.toFixed(2)}
          </div>
          
          <p className="text-slate-500 mb-10 leading-relaxed text-sm">
            {product.description}
          </p>

          <button
            onClick={() => {
              addToCart(product);
              navigate('/cart');
            }}
            disabled={!product.inStock}
            className={`w-full sm:w-auto flex items-center justify-center space-x-3 py-4 px-8 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              product.inStock
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{product.inStock ? 'Add to Cart' : 'Unavailable'}</span>
          </button>

          {/* Value Props */}
          <div className="mt-12 pt-8 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <Truck className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-slate-700">Free Shipping</h4>
                <p className="text-xs text-slate-400">On all orders over $150</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-slate-700">2-Year Warranty</h4>
                <p className="text-xs text-slate-400">Guaranteed quality</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
