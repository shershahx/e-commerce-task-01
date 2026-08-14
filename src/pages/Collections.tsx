import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function Collections() {
  const collections = [
    { id: 1, name: 'Nordic Living', desc: 'Minimalist approach to everyday spaces.', img: 'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=800' },
    { id: 2, name: 'Workspace', desc: 'Elevate your productivity with clean lines.', img: 'https://images.unsplash.com/photo-1499933374294-4584851497cc?w=800' },
    { id: 3, name: 'Outdoor Essentials', desc: 'Bring the comfort of inside, outside.', img: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
       <h1 className="text-4xl font-light text-slate-800 tracking-tight mb-12">Curated <span className="font-bold">Collections</span></h1>
       <div className="flex flex-col gap-8">
          {collections.map(c => (
             <div key={c.id} className="group relative h-[400px] rounded-3xl overflow-hidden flex items-center justify-center">
                <img src={c.img} alt={c.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/40 transition-colors"></div>
                <div className="relative z-10 text-center px-4">
                   <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">{c.name}</h2>
                   <p className="text-slate-100 mb-8 max-w-md mx-auto text-sm md:text-base">{c.desc}</p>
                   <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors shadow-lg shadow-black/10">
                     Shop Collection <ArrowRight className="w-4 h-4" />
                   </Link>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
}
