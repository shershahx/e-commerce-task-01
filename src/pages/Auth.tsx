import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Lock, Mail, User as UserIcon, AlertCircle, Eye, EyeOff } from 'lucide-react';

// ── Validation ────────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_RE  = /^[a-zA-Z\s\-']+$/;

function validateLogin(email: string, password: string) {
  const e: Record<string, string> = {};
  if (!email.trim())          e.email    = 'Email is required';
  else if (!EMAIL_RE.test(email)) e.email = 'Enter a valid email address';

  if (!password)              e.password = 'Password is required';
  else if (password.length < 6) e.password = 'Password must be at least 6 characters';

  return e;
}

function validateRegister(name: string, email: string, password: string, confirm: string) {
  const e: Record<string, string> = {};

  if (!name.trim())                    e.name = 'Name is required';
  else if (name.trim().length < 2)     e.name = 'Name must be at least 2 characters';
  else if (name.trim().length > 50)    e.name = 'Name is too long (50 chars max)';
  else if (!NAME_RE.test(name.trim())) e.name = 'Letters, spaces, hyphens and apostrophes only';

  if (!email.trim())               e.email = 'Email is required';
  else if (!EMAIL_RE.test(email))  e.email = 'Enter a valid email address';

  if (!password)                   e.password = 'Password is required';
  else if (password.length < 6)    e.password = 'Password must be at least 6 characters';

  if (!confirm)                    e.confirm = 'Please confirm your password';
  else if (confirm !== password)   e.confirm = 'Passwords do not match';

  return e;
}

function getStrength(pwd: string): { label: string; color: string; pct: string } | null {
  if (!pwd) return null;
  const checks = [
    pwd.length >= 8,
    /[A-Z]/.test(pwd),
    /[a-z]/.test(pwd),
    /\d/.test(pwd),
    /[^A-Za-z0-9]/.test(pwd),
  ];
  const score = checks.filter(Boolean).length;
  if (score <= 2) return { label: 'Weak',   color: 'bg-red-400',    pct: 'w-1/3' };
  if (score <= 3) return { label: 'Fair',   color: 'bg-amber-400',  pct: 'w-2/3' };
  return            { label: 'Strong', color: 'bg-emerald-500', pct: 'w-full' };
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FieldError({ msg }: { msg: string }) {
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
      <AlertCircle className="w-3 h-3 flex-shrink-0" />
      {msg}
    </p>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

type Fields = { name: string; email: string; password: string; confirm: string };

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const [fields,  setFields]  = useState<Fields>({ name: '', email: '', password: '', confirm: '' });
  const [errors,  setErrors]  = useState<Partial<Fields>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});

  const [showPwd,     setShowPwd]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError,    setApiError]    = useState('');
  const [submitting,  setSubmitting]  = useState(false);

  const { login, register } = useAuth();
  const { loadServerCart }  = useCart();
  const navigate = useNavigate();

  // Update a field and re-validate it if already touched
  const update = (field: keyof Fields, value: string) => {
    const next = { ...fields, [field]: value };
    setFields(next);

    if (touched[field] || errors[field]) {
      const errs = isLogin
        ? validateLogin(next.email, next.password)
        : validateRegister(next.name, next.email, next.password, next.confirm);
      setErrors(prev => ({ ...prev, [field]: errs[field] ?? '' }));
    }
  };

  const handleBlur = (field: keyof Fields) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const errs = isLogin
      ? validateLogin(fields.email, fields.password)
      : validateRegister(fields.name, fields.email, fields.password, fields.confirm);
    setErrors(prev => ({ ...prev, [field]: errs[field] ?? '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    const errs = isLogin
      ? validateLogin(fields.email, fields.password)
      : validateRegister(fields.name, fields.email, fields.password, fields.confirm);

    setErrors(errs);
    setTouched({ name: true, email: true, password: true, confirm: true });

    if (Object.values(errs).some(Boolean)) return;

    setSubmitting(true);
    try {
      if (isLogin) {
        await login(fields.email, fields.password);
      } else {
        await register(fields.name, fields.email, fields.password);
      }
      await loadServerCart();
      navigate('/');
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = () => {
    setIsLogin(v => !v);
    setFields({ name: '', email: '', password: '', confirm: '' });
    setErrors({});
    setTouched({});
    setApiError('');
  };

  // Returns the border/ring classes for a given field
  const fieldCls = (field: keyof Fields) =>
    errors[field]
      ? 'border-red-400 bg-red-50/30 focus:ring-2 focus:ring-red-300 focus:border-red-400'
      : 'border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500';

  const strength = !isLogin ? getStrength(fields.password) : null;

  return (
    <div className="max-w-md mx-auto px-4 py-24">
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-light tracking-tight text-slate-800 mb-2">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-slate-500 text-sm">
            {isLogin ? 'Sign in to your SuperMart account' : 'Start shopping with SuperMart'}
          </p>
        </div>

        {apiError && (
          <div className="mb-5 flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          {/* ── Name (register only) ── */}
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-4 w-4 text-slate-400" />
                </span>
                <input
                  type="text"
                  value={fields.name}
                  onChange={e => update('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  placeholder="Jane Smith"
                  className={`pl-10 w-full px-4 py-3 border rounded-lg outline-none transition-shadow text-sm ${fieldCls('name')}`}
                />
              </div>
              {errors.name && <FieldError msg={errors.name} />}
            </div>
          )}

          {/* ── Email ── */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
              Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-slate-400" />
              </span>
              <input
                type="email"
                value={fields.email}
                onChange={e => update('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="you@example.com"
                className={`pl-10 w-full px-4 py-3 border rounded-lg outline-none transition-shadow text-sm ${fieldCls('email')}`}
              />
            </div>
            {errors.email && <FieldError msg={errors.email} />}
          </div>

          {/* ── Password ── */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-slate-400" />
              </span>
              <input
                type={showPwd ? 'text' : 'password'}
                value={fields.password}
                onChange={e => update('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                placeholder="••••••••"
                className={`pl-10 pr-10 w-full px-4 py-3 border rounded-lg outline-none transition-shadow text-sm ${fieldCls('password')}`}
              />
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
                aria-label={showPwd ? 'Hide password' : 'Show password'}
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <FieldError msg={errors.password} />}

            {/* Strength meter — register mode only */}
            {!isLogin && strength && !errors.password && (
              <div className="mt-2">
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.pct}`}
                  />
                </div>
                <p className={`text-xs mt-1 font-medium ${
                  strength.label === 'Weak'   ? 'text-red-500'    :
                  strength.label === 'Fair'   ? 'text-amber-500'  :
                                                'text-emerald-600'
                }`}>
                  {strength.label} password
                </p>
              </div>
            )}
          </div>

          {/* ── Confirm Password (register only) ── */}
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </span>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={fields.confirm}
                  onChange={e => update('confirm', e.target.value)}
                  onBlur={() => handleBlur('confirm')}
                  placeholder="••••••••"
                  className={`pl-10 pr-10 w-full px-4 py-3 border rounded-lg outline-none transition-shadow text-sm ${fieldCls('confirm')}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirm && <FieldError msg={errors.confirm} />}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-slate-900 text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isLogin ? 'Signing in...' : 'Creating account...'}
              </span>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={switchMode}
              className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
