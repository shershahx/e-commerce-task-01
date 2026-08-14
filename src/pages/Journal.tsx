import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Journal() {
  const posts = [
    { id: 1, title: 'The Art of Minimalist Living', date: 'Oct 24, 2024', category: 'Design', img: 'https://images.unsplash.com/photo-1449247709967-d4461a6a4103?w=600' },
    { id: 2, title: 'Sustainable Materials in Modern Furniture', date: 'Oct 12, 2024', category: 'Sustainability', img: 'https://images.unsplash.com/photo-1618220179428-22790b46a011?w=600' },
    { id: 3, title: 'Lighting Your Workspace for Productivity', date: 'Sep 28, 2024', category: 'Guides', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600' },
    { id: 4, title: 'Exploring Geometric Balance', date: 'Sep 14, 2024', category: 'Design', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600' },
    { id: 5, title: 'The Maker\'s Process', date: 'Aug 30, 2024', category: 'Behind the Scenes', img: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=600' },
    { id: 6, title: 'Curating a Calm Bedroom', date: 'Aug 15, 2024', category: 'Guides', img: 'https://images.unsplash.com/photo-1580661869408-55ab23f2ca6e?w=600' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-light text-slate-800 tracking-tight mb-12">The <span className="font-bold">Journal</span></h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map(post => (
          <div key={post.id} className="group cursor-pointer flex flex-col">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-slate-100 border border-slate-100 shadow-sm">
              <img src={post.img} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="flex items-center gap-4 mb-3">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-md">{post.category}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.date}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors tracking-tight">{post.title}</h2>
            <p className="text-sm text-slate-500 mb-6 line-clamp-2">Explore our latest thoughts and insights on design, sustainability, and living a more intentional life through carefully curated spaces.</p>
            <Link to="#" className="mt-auto inline-flex items-center text-[10px] font-bold text-slate-800 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">
              Read Article <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
