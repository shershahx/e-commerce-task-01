import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';

export const authRoutes = express.Router();

const JWT_SECRET = () => process.env.JWT_SECRET || 'dev-secret-change-in-production';

authRoutes.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name?.trim() || !email?.trim() || !password) {
    res.status(400).json({ error: 'Name, email and password are required' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters' });
    return;
  }

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      res.status(409).json({ error: 'An account with that email already exists' });
      return;
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name.trim(), email.toLowerCase(), hash]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, JWT_SECRET(), { expiresIn: '7d' });

    res.status(201).json({ user, token });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

authRoutes.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      res.status(401).json({ error: 'Incorrect email or password' });
      return;
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET(), { expiresIn: '7d' });
    res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

authRoutes.get('/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [req.userId]
    );
    if (!result.rows[0]) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});
