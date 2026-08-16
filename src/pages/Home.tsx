import React, { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { ArrowRight, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { Product } from '../types';

const CATEGORIES = ['All', 'Furniture', 'Lighting', 'Decor', 'Textiles'];

export function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    api.get<Product[]>('/products')
      .then(setProducts)
      .catch(err => setFetchError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="relative bg-slate-100 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"
            alt="Interior"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/10" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-48">
          <div className="max-w-2xl">
            <span className="inline-block py-1 px-3 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest mb-6">
              New Collection 2026
            </span>
            <h1 className="text-5xl md:text-6xl font-light text-white tracking-tight mb-6">
              Furniture that<br />
              <span className="font-bold">earns its place.</span>
            </h1>
            <p className="text-lg text-slate-300 mb-10 max-w-lg leading-relaxed">
              Every piece is designed to be used, not photographed. Solid materials, honest construction, no trends.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#shop" className="inline-flex justify-center items-center px-8 py-4 bg-white text-slate-900 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">
                Shop Now
              </a>
              <Link to="/story" className="inline-flex justify-center items-center px-8 py-4 bg-slate-800/50 backdrop-blur text-white border border-slate-700 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category tiles */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Shop by Category</h2>
            <a href="#shop" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: 'Furniture', img: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=400' },
              { name: 'Lighting', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400' },
              { name: 'Textiles', img: 'https://images.unsplash.com/photo-1580661869408-55ab23f2ca6e?w=400' },
              { name: 'Decor', img: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=400' },
            ].map(cat => (
              <button
                key={cat.name}
                onClick={() => {
                  setActiveCategory(cat.name);
                  document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative h-48 md:h-64 rounded-2xl overflow-hidden cursor-pointer text-left"
              >
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/45 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white font-bold text-lg tracking-tight bg-white/20 backdrop-blur px-6 py-2 rounded-xl border border-white/30">
                    {cat.name}
                  </h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-light text-slate-800 tracking-tight mb-2">
              The <span className="font-bold">Collection</span>
            </h2>
            <p className="text-sm text-slate-500">
              {loading ? 'Loading...' : `${filtered.length} items`}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeCategory === cat
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {fetchError && (
          <div className="py-12 text-center text-red-500 text-sm">
            Could not load products — {fetchError}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
                <div className="aspect-square bg-slate-100" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && !fetchError && filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-500">Nothing in this category right now.</p>
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="bg-slate-900 py-24 border-t border-slate-800 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-indigo-400 font-bold text-xs uppercase tracking-widest mb-4 block">First Order Offer</span>
          <h2 className="text-3xl md:text-4xl font-light text-white tracking-tight mb-6">
            15% off when you subscribe.
          </h2>
          <p className="text-slate-400 mb-10 text-lg max-w-2xl mx-auto">
            New arrivals, restock notifications, and occasional thoughts on living with less.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-5 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              required
            />
            <button
              type="submit"
              className="px-8 py-4 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 transition-colors whitespace-nowrap uppercase tracking-widest"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
