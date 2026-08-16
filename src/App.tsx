import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './components/ToastProvider';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Auth } from './pages/Auth';
import { Profile } from './pages/Profile';
import { Collections } from './pages/Collections';
import { NewArrivals } from './pages/NewArrivals';
import { Journal } from './pages/Journal';
import { Story } from './pages/Story';
import { Footer } from './components/Footer';

// ── Animated route shell ──────────────────────────────────────────────────────
// Must live inside <Router> so it can call useLocation.

function AppShell() {
  const location = useLocation();

  // Scroll to top whenever the route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/*
          AnimatePresence with mode="wait" plays the exit animation before
          the entering page appears — keeps things clean and flicker-free.
          initial={false} skips the animation on the very first page load.
        */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 0.18, ease: 'easeOut' },
              y:       { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] },
            }}
          >
            <Routes location={location}>
              <Route path="/"             element={<Home />} />
              <Route path="/product/:id"  element={<ProductDetail />} />
              <Route path="/cart"         element={<Cart />} />
              <Route path="/checkout"     element={<Checkout />} />
              <Route path="/auth"         element={<Auth />} />
              <Route path="/profile"      element={<Profile />} />
              <Route path="/collections"  element={<Collections />} />
              <Route path="/new-arrivals" element={<NewArrivals />} />
              <Route path="/journal"      element={<Journal />} />
              <Route path="/story"        element={<Story />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <Router>
            <AppShell />
          </Router>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}
