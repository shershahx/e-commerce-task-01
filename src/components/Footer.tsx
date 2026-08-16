import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="SuperMart" className="h-9 w-auto" />
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              Curated essentials for the modern home. We believe in minimalist design, sustainable materials, and enduring quality.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-slate-800 tracking-tight mb-4 uppercase text-xs">Shop</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">All Products</Link></li>
              <li><Link to="/" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">Furniture</Link></li>
              <li><Link to="/" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">Lighting</Link></li>
              <li><Link to="/" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">Decor & Textiles</Link></li>
              <li><Link to="/" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-slate-800 tracking-tight mb-4 uppercase text-xs">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">Help Center</Link></li>
              <li><Link to="/" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">Track Order</Link></li>
              <li><Link to="/" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">Warranty</Link></li>
              <li><Link to="/" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-slate-800 tracking-tight mb-4 uppercase text-xs">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-slate-500 text-sm">
                <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <span>123 Design Avenue, Suite 400<br/>New York, NY 10001</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-500 text-sm">
                <Phone className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-500 text-sm">
                <Mail className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <span>hello@supermart.shop</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-slate-400 text-xs">
            &copy; {new Date().getFullYear()} SuperMart. All rights reserved.
          </p>
          <div className="flex space-x-6 text-xs text-slate-400">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
