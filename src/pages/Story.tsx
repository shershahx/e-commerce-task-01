import React from 'react';
import { Link } from 'react-router-dom';

export function Story() {
  return (
    <div className="w-full flex flex-col">
      <div className="relative h-[60vh] bg-slate-900 flex items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" alt="Studio" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80"></div>
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-light text-white tracking-tight mb-6">Our <span className="font-bold">Story</span></h1>
          <p className="text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
            Crafting intentional spaces through purposeful design. We believe the objects we surround ourselves with profoundly impact our daily lives.
          </p>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto px-4 py-24">
        <div className="prose prose-slate prose-lg max-w-none">
          <p className="text-xl text-slate-600 leading-relaxed mb-12 text-center font-medium">
            Founded in 2024, SuperMart was born out of a desire to create furniture and home goods that balance aesthetic beauty with everyday functionality.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">The Philosophy</h2>
              <p className="text-slate-500 leading-relaxed text-sm">
                We believe that the objects we surround ourselves with profoundly impact our daily lives. That's why we focus on geometric balance, clean lines, and honest materials. Every piece in our collection is designed to bring a sense of calm and order to your environment.
              </p>
            </div>
            <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden border border-slate-200">
              <img src="https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600" className="w-full h-full object-cover" alt="Philosophy" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 md:order-1 aspect-square bg-slate-100 rounded-3xl overflow-hidden border border-slate-200">
              <img src="https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=600" className="w-full h-full object-cover" alt="Sustainable Craft" />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">Sustainable Craft</h2>
              <p className="text-slate-500 leading-relaxed text-sm">
                Sustainability isn't an afterthought—it's woven into our design process. We partner with ethical manufacturers and source sustainable materials to ensure that our products are as gentle on the earth as they are on the eyes. 
              </p>
            </div>
          </div>

          <div className="text-center pt-12 border-t border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 tracking-tight">Ready to elevate your space?</h2>
            <Link to="/" className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-xl shadow-slate-900/10">
              Explore the Shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
