import express from 'express';
import pool from '../db.js';
import { optionalAuth, requireAuth, AuthRequest } from '../middleware/auth.js';

export const orderRoutes = express.Router();

function makeOrderId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'ORD-';
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

orderRoutes.post('/', optionalAuth, async (req: AuthRequest, res) => {
  const { items, firstName, lastName, email, address, city, zip } = req.body;

  if (!items?.length || !firstName || !lastName || !email || !address || !city || !zip) {
    res.status(400).json({ error: 'All order fields are required' });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const subtotal: number = items.reduce(
      (acc: number, item: any) => acc + parseFloat(item.price) * parseInt(item.quantity),
      0
    );
    const shipping = 10.0;
    const total = subtotal + shipping;
    const orderId = makeOrderId();

    await client.query(
      `INSERT INTO orders (id, user_id, subtotal, shipping, total, first_name, last_name, email, address, city, zip)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [orderId, req.userId ?? null, subtotal, shipping, total,
       firstName, lastName, email, address, city, zip]
    );

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, price, quantity)
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, item.productId, item.name, item.price, item.quantity]
      );
    }

    if (req.userId) {
      await client.query('DELETE FROM cart_items WHERE user_id = $1', [req.userId]);
    }

    await client.query('COMMIT');

    res.status(201).json({ orderId, total, status: 'pending' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Create order error:', err);
    res.status(500).json({ error: 'Failed to place order. Please try again.' });
  } finally {
    client.release();
  }
});

orderRoutes.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const ordersResult = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );

    const orders = await Promise.all(
      ordersResult.rows.map(async (o) => {
        const itemsResult = await pool.query(
          'SELECT * FROM order_items WHERE order_id = $1',
          [o.id]
        );
        return {
          id: o.id,
          status: o.status,
          subtotal: parseFloat(o.subtotal),
          shipping: parseFloat(o.shipping),
          total: parseFloat(o.total),
          email: o.email,
          createdAt: o.created_at,
          itemCount: itemsResult.rows.reduce((s: number, i: any) => s + i.quantity, 0),
          items: itemsResult.rows.map((i: any) => ({
            productId: i.product_id,
            name: i.product_name,
            price: parseFloat(i.price),
            quantity: i.quantity,
          })),
        };
      })
    );

    res.json(orders);
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ error: 'Failed to load orders' });
  }
});

orderRoutes.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const orderResult = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );

    if (!orderResult.rows[0]) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const o = orderResult.rows[0];
    const itemsResult = await pool.query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [o.id]
    );

    res.json({
      id: o.id,
      status: o.status,
      subtotal: parseFloat(o.subtotal),
      shipping: parseFloat(o.shipping),
      total: parseFloat(o.total),
      firstName: o.first_name,
      lastName: o.last_name,
      email: o.email,
      address: o.address,
      city: o.city,
      zip: o.zip,
      createdAt: o.created_at,
      items: itemsResult.rows.map((i: any) => ({
        productId: i.product_id,
        name: i.product_name,
        price: parseFloat(i.price),
        quantity: i.quantity,
      })),
    });
  } catch (err) {
    console.error('Get order error:', err);
    res.status(500).json({ error: 'Failed to load order' });
  }
});
