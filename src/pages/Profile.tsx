import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, Settings, LogOut, Heart, MapPin, CreditCard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const mockOrders = [
    { id: 'ORD-7392-XL', date: 'Oct 12, 2023', total: 325.00, status: 'Delivered', items: 3 },
    { id: 'ORD-8941-AB', date: 'Sep 28, 2023', total: 145.50, status: 'Delivered', items: 1 },
    { id: 'ORD-9102-CZ', date: 'Sep 05, 2023', total: 890.00, status: 'Processing', items: 4 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xl font-bold mb-4">
              {user.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
            <p className="text-sm text-slate-500 mb-6">{user.email}</p>

            <nav className="space-y-1">
              <a href="#" className="flex items-center space-x-3 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-bold transition-colors">
                <Package className="w-4 h-4" />
                <span>Order History</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-lg text-sm font-bold transition-colors">
                <Heart className="w-4 h-4" />
                <span>Saved Items</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-lg text-sm font-bold transition-colors">
                <MapPin className="w-4 h-4" />
                <span>Addresses</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-lg text-sm font-bold transition-colors">
                <CreditCard className="w-4 h-4" />
                <span>Payment Methods</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-lg text-sm font-bold transition-colors">
                <Settings className="w-4 h-4" />
                <span>Account Settings</span>
              </a>
            </nav>

            <div className="border-t border-slate-100 mt-6 pt-6">
              <button onClick={handleLogout} className="flex items-center space-x-3 px-3 py-2 text-slate-400 hover:text-red-500 w-full rounded-lg text-sm font-bold transition-colors">
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h1 className="text-3xl font-light text-slate-800 tracking-tight mb-8">My Orders</h1>
          
          <div className="space-y-6">
            {mockOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-4 justify-between items-center">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Order Placed</p>
                    <p className="text-sm text-slate-700 font-medium">{order.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Total</p>
                    <p className="text-sm font-mono font-bold text-indigo-600">${order.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Order #</p>
                    <p className="text-sm font-mono text-slate-700">{order.id}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="flex -space-x-2">
                      {[...Array(Math.min(3, order.items))].map((_, i) => (
                        <div key={i} className="w-12 h-12 rounded-lg bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center">
                          <Package className="w-5 h-5 text-slate-400" />
                        </div>
                      ))}
                      {order.items > 3 && (
                        <div className="w-12 h-12 rounded-lg bg-slate-50 border-2 border-white shadow-sm flex items-center justify-center text-xs font-bold text-slate-500">
                          +{order.items - 3}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-slate-500">
                      {order.items} {order.items === 1 ? 'item' : 'items'}
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
