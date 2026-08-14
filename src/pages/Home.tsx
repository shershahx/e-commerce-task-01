import React, { useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { mockProducts } from '../data';
import { ArrowRight, Filter, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  const categories = ['All', 'Furniture', 'Lighting', 'Decor', 'Textiles'];
  
  const filteredProducts = activeCategory === 'All' 
    ? mockProducts 
    : mockProducts.filter(p => p.category === activeCategory);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative bg-slate-100 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop" 
            alt="Interior design" 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/10"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-48">
          <div className="max-w-2xl">
            <span className="inline-block py-1 px-3 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest mb-6">
              New Collection 2024
            </span>
            <h1 className="text-5xl md:text-6xl font-light text-white tracking-tight mb-6">
              Artful living, <br/>
              <span className="font-bold">designed for you.</span>
            </h1>
            <p className="text-lg text-slate-300 mb-10 max-w-lg leading-relaxed">
              Discover our latest collection of premium furniture and home essentials. Crafted with sustainable materials and timeless aesthetic.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#shop" className="inline-flex justify-center items-center px-8 py-4 bg-white text-slate-900 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">
                Shop Collection
              </a>
              <a href="#about" className="inline-flex justify-center items-center px-8 py-4 bg-slate-800/50 backdrop-blur text-white border border-slate-700 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">
                Explore Story
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Browse by Category</h2>
            <Link to="/" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: 'Furniture', img: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=400' },
              { name: 'Lighting', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400' },
              { name: 'Textiles', img: 'https://images.unsplash.com/photo-1580661869408-55ab23f2ca6e?w=400' },
              { name: 'Decor', img: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=400' },
            ].map((cat) => (
              <div key={cat.name} className="group relative h-48 md:h-64 rounded-2xl overflow-hidden cursor-pointer">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/40 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white font-bold text-lg tracking-tight bg-white/20 backdrop-blur px-6 py-2 rounded-xl border border-white/30">{cat.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Product Grid */}
      <section id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-light text-slate-800 tracking-tight mb-2">
              Premium <span className="font-bold">Essentials</span>
            </h2>
            <p className="text-sm text-slate-500">
              Showing {filteredProducts.length} curated objects
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl">
              {categories.map(cat => (
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
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <h3 className="text-xl font-bold text-slate-700 mb-2">No products found</h3>
            <p className="text-slate-500">We couldn't find any products in this category.</p>
          </div>
        )}
      </section>
      
      {/* Newsletter Section */}
      <section className="bg-slate-900 py-24 border-t border-slate-800 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-indigo-400 font-bold text-xs uppercase tracking-widest mb-4 block">Join the Club</span>
          <h2 className="text-3xl md:text-4xl font-light text-white tracking-tight mb-6">
            Get 15% off your first order.
          </h2>
          <p className="text-slate-400 mb-10 text-lg max-w-2xl mx-auto">
            Subscribe to our newsletter to receive exclusive offers, design inspiration, and early access to new collections.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-5 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              required
            />
            <button type="submit" className="px-8 py-4 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 transition-colors whitespace-nowrap uppercase tracking-widest">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
