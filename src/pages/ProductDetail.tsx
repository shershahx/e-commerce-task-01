import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Truck, ShieldCheck, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/ToastProvider';
import { api } from '../api/client';
import { Product } from '../types';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast }     = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get<Product>(`/products/${id}`)
      .then(setProduct)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product);
    toast(`${product.name} added to cart`);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-slate-100 rounded-2xl" />
          <div className="space-y-4 py-8">
            <div className="h-4 bg-slate-100 rounded w-1/4" />
            <div className="h-8 bg-slate-100 rounded w-3/4" />
            <div className="h-6 bg-slate-100 rounded w-1/4" />
            <div className="h-24 bg-slate-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Product not found</h2>
        <Link to="/" className="text-indigo-600 hover:underline inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to shop
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
        <div className="bg-slate-50 rounded-2xl overflow-hidden aspect-square border border-slate-100 shadow-sm">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col justify-center">
          <div className="mb-4 flex items-center gap-3">
            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md uppercase tracking-widest">
              {product.category}
            </span>
            {!product.inStock && (
              <span className="px-3 py-1 bg-white border border-slate-200 text-slate-400 text-[10px] font-bold rounded-md uppercase tracking-widest">
                Out of Stock
              </span>
            )}
          </div>

          <h1 className="text-4xl font-light text-slate-800 tracking-tight mb-4">{product.name}</h1>

          <div className="text-3xl font-mono font-bold text-indigo-600 mb-6">
            ${product.price.toFixed(2)}
          </div>

          <p className="text-slate-500 mb-10 leading-relaxed text-sm">{product.description}</p>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || added}
            className={`w-full sm:w-auto flex items-center justify-center gap-3 py-4 px-8 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              !product.inStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : added
                ? 'bg-[#4f39f6] text-white'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            {!product.inStock ? 'Unavailable' : added ? 'Added to cart' : 'Add to Cart'}
          </button>

          <div className="mt-12 pt-8 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-slate-700">Free Shipping</h4>
                <p className="text-xs text-slate-400">On orders over $150</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-slate-700">2-Year Warranty</h4>
                <p className="text-xs text-slate-400">Manufacturing defects covered</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
