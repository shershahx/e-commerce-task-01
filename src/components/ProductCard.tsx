import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useToast } from './ToastProvider';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast }     = useToast();
  const [added, setAdded] = useState(false);

  const handleAdd = async () => {
    await addToCart(product);
    toast(`${product.name} added to cart`);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col"
    >
      <Link
        to={`/product/${product.id}`}
        className="aspect-square bg-slate-50 rounded-xl mb-4 relative overflow-hidden block"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {!product.inStock && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-white/80 backdrop-blur text-[10px] font-bold rounded-md uppercase tracking-wide">
            Out of Stock
          </div>
        )}
      </Link>

      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <div>
            <Link to={`/product/${product.id}`}>
              <h4 className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                {product.name}
              </h4>
            </Link>
            <p className="text-xs text-slate-400">{product.category}</p>
          </div>
          <span className="text-sm font-mono font-bold text-indigo-600 ml-2 flex-shrink-0">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <motion.button
          whileTap={product.inStock && !added ? { scale: 0.96 } : {}}
          onClick={handleAdd}
          disabled={!product.inStock || added}
          className={`w-full mt-auto py-2 border-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
            !product.inStock
              ? 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed'
              : added
              ? 'border-[#4f39f6] bg-[#4f39f6]/10 text-[#4f39f6]'
              : 'border-slate-100 group-hover:border-indigo-600 group-hover:text-indigo-600 bg-white text-slate-800'
          }`}
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Added
            </>
          ) : product.inStock ? (
            <>
              <ShoppingCart className="w-3.5 h-3.5" />
              Add to Cart
            </>
          ) : (
            'Sold Out'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
