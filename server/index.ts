import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRoutes } from './routes/auth.js';
import { productRoutes } from './routes/products.js';
import { cartRoutes } from './routes/cart.js';
import { orderRoutes } from './routes/orders.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`API running → http://localhost:${PORT}`);
});
