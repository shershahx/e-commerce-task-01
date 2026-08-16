import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

// ── Context ───────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// ── Provider + container ──────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const dismiss = (id: number) =>
    setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Fixed toast stack — bottom-right */}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2.5 pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 48, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 48, scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className={`pointer-events-auto flex items-center gap-3 pl-4 pr-3 py-3 rounded-xl shadow-lg text-sm font-medium w-72 ${
                t.type === 'success' ? 'bg-slate-900 text-white' :
                t.type === 'error'   ? 'bg-red-600  text-white' :
                                       'bg-indigo-600 text-white'
              }`}
            >
              {/* Icon */}
              {t.type === 'success' && <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-400" />}
              {t.type === 'error'   && <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-200" />}
              {t.type === 'info'    && <Info         className="w-4 h-4 flex-shrink-0 text-indigo-200" />}

              <span className="flex-1 leading-snug">{t.message}</span>

              <button
                onClick={() => dismiss(t.id)}
                className="opacity-50 hover:opacity-100 transition-opacity flex-shrink-0"
                aria-label="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
