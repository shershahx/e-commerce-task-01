import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, Settings, LogOut, Heart, MapPin, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { Order } from '../types';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-emerald-100 text-emerald-700',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    api.get<Order[]>('/orders')
      .then(setOrders)
      .catch(() => null)
      .finally(() => setOrdersLoading(false));
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xl font-bold mb-4">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
            <p className="text-sm text-slate-500 mb-6">{user.email}</p>

            <nav className="space-y-1">
              <span className="flex items-center gap-3 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-bold">
                <Package className="w-4 h-4" />
                Order History
              </span>
              {[
                { icon: Heart, label: 'Saved Items' },
                { icon: MapPin, label: 'Addresses' },
                { icon: CreditCard, label: 'Payment Methods' },
                { icon: Settings, label: 'Account Settings' },
              ].map(({ icon: Icon, label }) => (
                <button key={label} className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-lg text-sm font-bold transition-colors">
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>

            <div className="border-t border-slate-100 mt-6 pt-6">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-red-500 w-full rounded-lg text-sm font-bold transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="flex-1">
          <h1 className="text-3xl font-light text-slate-800 tracking-tight mb-8">My Orders</h1>

          {ordersLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 h-28 animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
              <Package className="w-10 h-10 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium mb-1">No orders yet</p>
              <p className="text-sm text-slate-400">Your order history will show up here once you make a purchase.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-4 justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Date</p>
                      <p className="text-sm text-slate-700 font-medium">{formatDate(order.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Total</p>
                      <p className="text-sm font-mono font-bold text-indigo-600">${order.total.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Order #</p>
                      <p className="text-sm font-mono text-slate-700">{order.id}</p>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${STATUS_STYLES[order.status] || 'bg-slate-100 text-slate-600'}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex justify-between items-center">
                    <p className="text-sm text-slate-500">
                      {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
                    </p>
                    <button
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      {expandedOrder === order.id ? (
                        <><ChevronUp className="w-3 h-3" /> Hide Details</>
                      ) : (
                        <><ChevronDown className="w-3 h-3" /> View Details</>
                      )}
                    </button>
                  </div>

                  {expandedOrder === order.id && order.items && (
                    <div className="px-6 pb-6 border-t border-slate-50 pt-4">
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-slate-700">{item.name} <span className="text-slate-400">× {item.quantity}</span></span>
                            <span className="font-mono text-slate-600">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="border-t border-slate-100 pt-3 flex justify-between text-xs text-slate-400">
                          <span>Shipping</span>
                          <span className="font-mono">${order.shipping.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
