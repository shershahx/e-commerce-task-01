import React from 'react';
import { ProductCard } from '../components/ProductCard';
import { mockProducts } from '../data';

export function NewArrivals() {
  // Taking the last 4 products to simulate new arrivals
  const newProducts = [...mockProducts].reverse().slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-widest mb-4">Just Landed</span>
        <h1 className="text-4xl font-light text-slate-800 tracking-tight">New <span className="font-bold">Arrivals</span></h1>
        <p className="text-slate-500 mt-4 max-w-xl text-sm leading-relaxed">
          The latest additions to our catalog. Discover fresh designs, innovative materials, and our newest takes on modern living.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {newProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
