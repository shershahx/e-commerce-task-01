import React, { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { api } from '../api/client';
import { Product } from '../types';

export function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Product[]>('/products')
      .then(data => {
        // Most recent 4 — sorted by name descending as a proxy for "new"
        setProducts([...data].reverse().slice(0, 4));
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-widest mb-4">
          Just Landed
        </span>
        <h1 className="text-4xl font-light text-slate-800 tracking-tight">
          New <span className="font-bold">Arrivals</span>
        </h1>
        <p className="text-slate-500 mt-4 max-w-xl text-sm leading-relaxed">
          The latest additions to the catalog.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
