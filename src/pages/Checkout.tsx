import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../api/client';

// ── Types ─────────────────────────────────────────────────────────────────────

type FormFields = {
  firstName: string; lastName: string; email: string;
  address:   string; city:      string; zip:   string;
  cardNumber: string; expiry:   string; cvv:   string;
};

type FormErrors = Partial<Record<keyof FormFields, string>>;

// ── Validation helpers ────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_RE  = /^[a-zA-Z\s\-']+$/;

/** Luhn algorithm — catches most mis-typed card numbers */
function luhn(raw: string): boolean {
  const digits = raw.replace(/\s/g, '');
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function validateExpiry(value: string): string {
  if (!value.trim()) return 'Expiry date is required';
  if (!/^\d{2}\/\d{2}$/.test(value)) return 'Use MM/YY format (e.g. 08/26)';
  const [mm, yy] = value.split('/').map(Number);
  if (mm < 1 || mm > 12) return 'Month must be between 01 and 12';
  const now = new Date();
  const expYear  = 2000 + yy;
  const expMonth = mm; // 1-indexed
  if (
    expYear < now.getFullYear() ||
    (expYear === now.getFullYear() && expMonth < now.getMonth() + 1)
  ) return 'This card has expired';
  return '';
}

function validateAll(f: FormFields): FormErrors {
  const e: FormErrors = {};

  // Contact
  if (!f.firstName.trim())            e.firstName = 'First name is required';
  else if (f.firstName.trim().length < 2)  e.firstName = 'Too short — enter your full first name';
  else if (!NAME_RE.test(f.firstName)) e.firstName = 'Letters, spaces, hyphens and apostrophes only';

  if (!f.lastName.trim())             e.lastName = 'Last name is required';
  else if (f.lastName.trim().length < 2)   e.lastName = 'Too short — enter your full last name';
  else if (!NAME_RE.test(f.lastName))  e.lastName = 'Letters, spaces, hyphens and apostrophes only';

  if (!f.email.trim())                e.email = 'Email is required';
  else if (!EMAIL_RE.test(f.email))   e.email = 'Enter a valid email address';

  // Shipping
  if (!f.address.trim())              e.address = 'Street address is required';
  else if (f.address.trim().length < 5) e.address = 'Enter a complete street address';

  if (!f.city.trim())                 e.city = 'City is required';
  else if (f.city.trim().length < 2)  e.city = 'Enter a valid city name';

  if (!f.zip.trim()) {
    e.zip = 'ZIP / postal code is required';
  } else if (!/^\d{5}(-\d{4})?$/.test(f.zip.trim()) && !/^[A-Z0-9]{3,10}$/i.test(f.zip.trim())) {
    e.zip = 'Enter a valid ZIP or postal code';
  }

  // Payment
  const rawCard = f.cardNumber.replace(/\s/g, '');
  if (!rawCard)                           e.cardNumber = 'Card number is required';
  else if (!/^\d{13,19}$/.test(rawCard))  e.cardNumber = 'Enter a 13–19 digit card number';
  else if (!luhn(rawCard))                e.cardNumber = 'Invalid card number — please double-check';

  const expiryErr = validateExpiry(f.expiry);
  if (expiryErr) e.expiry = expiryErr;

  if (!f.cvv.trim())                  e.cvv = 'CVV is required';
  else if (!/^\d{3,4}$/.test(f.cvv)) e.cvv = 'CVV must be 3 or 4 digits';

  return e;
}

// ── Auto-formatters ───────────────────────────────────────────────────────────

/** Formats digits into groups of 4: "4111111111111111" → "4111 1111 1111 1111" */
function fmtCard(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 19);
  return digits.replace(/(.{4})(?=.)/g, '$1 ');
}

/** Auto-inserts slash: "1226" → "12/26", strips non-digits */
function fmtExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  return digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
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

function inputCls(err?: string) {
  return `w-full px-4 py-2 border rounded-lg outline-none transition-colors ${
    err
      ? 'border-red-400 bg-red-50/30 focus:ring-2 focus:ring-red-300 focus:border-red-400'
      : 'border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
  }`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [submitting,  setSubmitting]  = useState(false);
  const [orderId,     setOrderId]     = useState('');
  const [apiError,    setApiError]    = useState('');

  const [form, setForm] = useState<FormFields>({
    firstName: '', lastName: '', email: '',
    address: '', city: '', zip: '',
    cardNumber: '', expiry: '', cvv: '',
  });

  const [errors,  setErrors]  = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormFields, boolean>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let v = value;

    // Auto-format payment fields
    if (name === 'cardNumber') v = fmtCard(value);
    if (name === 'expiry')     v = fmtExpiry(value);
    if (name === 'cvv')        v = value.replace(/\D/g, '').slice(0, 4);

    const next = { ...form, [name]: v };
    setForm(next);

    // Re-validate this field live once it's been touched
    if (touched[name as keyof FormFields]) {
      const allErrs = validateAll(next);
      setErrors(prev => ({ ...prev, [name]: allErrs[name as keyof FormFields] ?? '' }));
    }
  };

  const handleBlur = (field: keyof FormFields) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const allErrs = validateAll(form);
    setErrors(prev => ({ ...prev, [field]: allErrs[field] ?? '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    const allErrs = validateAll(form);
    setErrors(allErrs);
    // Mark every field as touched so all errors become visible
    const allTouched = (Object.keys(form) as (keyof FormFields)[]).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {} as Record<keyof FormFields, boolean>
    );
    setTouched(allTouched);

    if (Object.values(allErrs).some(Boolean)) return;

    setSubmitting(true);
    try {
      const orderItems = items.map(i => ({
        productId: i.product.id,
        name:      i.product.name,
        price:     i.product.price,
        quantity:  i.quantity,
      }));

      const result = await api.post<{ orderId: string; total: number }>('/orders', {
        items:     orderItems,
        firstName: form.firstName,
        lastName:  form.lastName,
        email:     form.email,
        address:   form.address,
        city:      form.city,
        zip:       form.zip,
      });

      await clearCart();
      setOrderId(result.orderId);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ────────────────────────────────────────────────────────

  if (orderId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-50 rounded-full mb-8">
          <CheckCircle className="w-12 h-12 text-emerald-500" />
        </div>
        <h1 className="text-4xl font-light tracking-tight text-slate-800 mb-4">Order Confirmed</h1>
        <p className="text-slate-500 mb-2">
          Confirmation sent to <strong>{form.email}</strong>
        </p>
        <p className="text-xs font-mono text-slate-400 mb-10">Order #{orderId}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate('/profile')}
            className="inline-flex bg-indigo-600 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-colors"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate('/')}
            className="inline-flex bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors"
          >
            Keep Shopping
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const shipping = 10;

  // ── Checkout form ─────────────────────────────────────────────────────────

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-light text-slate-800 tracking-tight mb-8">Checkout</h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-start">
        <div className="lg:col-span-7">

          {apiError && (
            <div className="mb-6 flex items-start gap-2 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-8">

            {/* ── Contact Information ── */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4 tracking-tight">Contact Information</h2>
              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                    First Name
                  </label>
                  <input
                    type="text" name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    onBlur={() => handleBlur('firstName')}
                    className={inputCls(errors.firstName)}
                  />
                  {errors.firstName && <FieldError msg={errors.firstName} />}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                    Last Name
                  </label>
                  <input
                    type="text" name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    onBlur={() => handleBlur('lastName')}
                    className={inputCls(errors.lastName)}
                  />
                  {errors.lastName && <FieldError msg={errors.lastName} />}
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                    Email
                  </label>
                  <input
                    type="email" name="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur('email')}
                    className={inputCls(errors.email)}
                  />
                  {errors.email && <FieldError msg={errors.email} />}
                </div>

              </div>
            </section>

            {/* ── Shipping Address ── */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4 tracking-tight">Shipping Address</h2>
              <div className="space-y-4">

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                    Street Address
                  </label>
                  <input
                    type="text" name="address"
                    value={form.address}
                    onChange={handleChange}
                    onBlur={() => handleBlur('address')}
                    className={inputCls(errors.address)}
                  />
                  {errors.address && <FieldError msg={errors.address} />}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                      City
                    </label>
                    <input
                      type="text" name="city"
                      value={form.city}
                      onChange={handleChange}
                      onBlur={() => handleBlur('city')}
                      className={inputCls(errors.city)}
                    />
                    {errors.city && <FieldError msg={errors.city} />}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                      ZIP / Postal Code
                    </label>
                    <input
                      type="text" name="zip"
                      value={form.zip}
                      onChange={handleChange}
                      onBlur={() => handleBlur('zip')}
                      className={inputCls(errors.zip)}
                    />
                    {errors.zip && <FieldError msg={errors.zip} />}
                  </div>
                </div>

              </div>
            </section>

            {/* ── Payment ── */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-1 tracking-tight">Payment</h2>
              <p className="text-xs text-slate-400 mb-4">
                Card details are not stored — this is a demo checkout.
              </p>
              <div className="space-y-4">

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                    Card Number
                  </label>
                  <input
                    type="text" name="cardNumber"
                    value={form.cardNumber}
                    onChange={handleChange}
                    onBlur={() => handleBlur('cardNumber')}
                    placeholder="0000 0000 0000 0000"
                    inputMode="numeric"
                    className={`font-mono ${inputCls(errors.cardNumber)}`}
                  />
                  {errors.cardNumber && <FieldError msg={errors.cardNumber} />}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                      Expiry Date
                    </label>
                    <input
                      type="text" name="expiry"
                      value={form.expiry}
                      onChange={handleChange}
                      onBlur={() => handleBlur('expiry')}
                      placeholder="MM/YY"
                      inputMode="numeric"
                      className={`font-mono ${inputCls(errors.expiry)}`}
                    />
                    {errors.expiry && <FieldError msg={errors.expiry} />}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                      CVV
                    </label>
                    <input
                      type="text" name="cvv"
                      value={form.cvv}
                      onChange={handleChange}
                      onBlur={() => handleBlur('cvv')}
                      placeholder="123"
                      inputMode="numeric"
                      className={`font-mono ${inputCls(errors.cvv)}`}
                    />
                    {errors.cvv && <FieldError msg={errors.cvv} />}
                  </div>
                </div>

              </div>
            </section>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-slate-900 text-white py-4 px-6 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Placing order...
                </>
              ) : (
                `Pay $${(totalPrice + shipping).toFixed(2)}`
              )}
            </button>

          </form>
        </div>

        {/* ── Order Summary ─────────────────────────────────────────────── */}
        <div className="lg:col-span-5 mt-12 lg:mt-0">
          <div className="bg-white border-l border-slate-200 p-8 sticky top-24">
            <h2 className="font-bold text-sm tracking-tight text-slate-800 mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-lg border border-slate-100 overflow-hidden flex-shrink-0">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-700">{item.product.name}</p>
                    <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-xs font-mono font-bold text-indigo-600">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-6 space-y-3">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Shipping</span>
                <span className="font-mono">${shipping.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-100 pt-4 mt-2 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-800">Total</span>
                <span className="text-lg font-mono font-bold text-indigo-600">
                  ${(totalPrice + shipping).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
