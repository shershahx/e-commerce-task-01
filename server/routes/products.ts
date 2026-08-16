import express from 'express';
import pool from '../db.js';

export const productRoutes = express.Router();

function rowToProduct(row: any) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: parseFloat(row.price),
    imageUrl: row.image_url,
    category: row.category,
    inStock: row.in_stock,
  };
}

productRoutes.get('/', async (req, res) => {
  const { category } = req.query;

  try {
    const result = category
      ? await pool.query('SELECT * FROM products WHERE category = $1 ORDER BY name', [category])
      : await pool.query('SELECT * FROM products ORDER BY name');

    res.json(result.rows.map(rowToProduct));
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ error: 'Failed to load products' });
  }
});

productRoutes.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (!result.rows[0]) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(rowToProduct(result.rows[0]));
  } catch (err) {
    console.error('Get product error:', err);
    res.status(500).json({ error: 'Failed to load product' });
  }
});
