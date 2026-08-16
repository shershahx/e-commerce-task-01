import express from 'express';
import pool from '../db.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';

export const cartRoutes = express.Router();

async function fetchCart(userId: number) {
  const result = await pool.query(
    `SELECT ci.quantity,
            p.id, p.name, p.description, p.price, p.image_url, p.category, p.in_stock
     FROM cart_items ci
     JOIN products p ON ci.product_id = p.id
     WHERE ci.user_id = $1
     ORDER BY ci.id`,
    [userId]
  );

  return result.rows.map(row => ({
    product: {
      id: row.id,
      name: row.name,
      description: row.description,
      price: parseFloat(row.price),
      imageUrl: row.image_url,
      category: row.category,
      inStock: row.in_stock,
    },
    quantity: row.quantity,
  }));
}

cartRoutes.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    res.json(await fetchCart(req.userId!));
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ error: 'Failed to load cart' });
  }
});

cartRoutes.post('/', requireAuth, async (req: AuthRequest, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) {
    res.status(400).json({ error: 'productId is required' });
    return;
  }

  try {
    const check = await pool.query('SELECT id FROM products WHERE id = $1', [productId]);
    if (!check.rows[0]) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    await pool.query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity`,
      [req.userId, productId, quantity]
    );

    res.json(await fetchCart(req.userId!));
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ error: 'Failed to add item' });
  }
});

cartRoutes.put('/:productId', requireAuth, async (req: AuthRequest, res) => {
  const { quantity } = req.body;
  if (quantity === undefined) {
    res.status(400).json({ error: 'quantity is required' });
    return;
  }

  try {
    if (Number(quantity) <= 0) {
      await pool.query(
        'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2',
        [req.userId, req.params.productId]
      );
    } else {
      await pool.query(
        'UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3',
        [quantity, req.userId, req.params.productId]
      );
    }
    res.json(await fetchCart(req.userId!));
  } catch (err) {
    console.error('Update cart error:', err);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

cartRoutes.delete('/:productId', requireAuth, async (req: AuthRequest, res) => {
  try {
    await pool.query(
      'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [req.userId, req.params.productId]
    );
    res.json(await fetchCart(req.userId!));
  } catch (err) {
    console.error('Remove from cart error:', err);
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

cartRoutes.delete('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    await pool.query('DELETE FROM cart_items WHERE user_id = $1', [req.userId]);
    res.json([]);
  } catch (err) {
    console.error('Clear cart error:', err);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});
