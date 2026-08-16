import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();

const products = [
  {
    id: 'p1',
    name: 'Nordic Oak Chair',
    description: 'Solid oak, steam-bent backrest, mortise-and-tenon joinery throughout. Seat pad is removable, cover is machine-washable linen. Holds up to 120 kg. Ships flat-pack with an Allen key — takes about 25 minutes.',
    price: 240.00,
    image_url: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&q=80',
    category: 'Furniture',
    in_stock: true,
  },
  {
    id: 'p2',
    name: 'Matte Pendant Lamp',
    description: 'Hand-thrown stoneware body, matte iron-oxide glaze. Takes a standard E27 bulb up to 60 W (LED recommended). Cord length 150 cm, canopy included. Each one varies slightly — that\'s the point.',
    price: 185.00,
    image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80',
    category: 'Lighting',
    in_stock: true,
  },
  {
    id: 'p3',
    name: 'Ceramic Sculpt Vase',
    description: 'Wheel-thrown in our studio in Lisbon. High-fire stoneware, food-safe glaze. Holds water. Dimensions vary slightly between pieces — 22–24 cm tall, 10–12 cm at widest point.',
    price: 72.00,
    image_url: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=500&q=80',
    category: 'Decor',
    in_stock: true,
  },
  {
    id: 'p4',
    name: 'Linen Throw Pillow',
    description: '100% stonewashed linen, pre-washed for softness. Hidden zip closure. Insert not included — fits any standard 50 x 50 cm pillow form. Available in natural undyed linen only.',
    price: 45.00,
    image_url: 'https://images.unsplash.com/photo-1580661869408-55ab23f2ca6e?w=500&q=80',
    category: 'Textiles',
    in_stock: false,
  },
  {
    id: 'p5',
    name: 'Walnut Wall Shelf',
    description: 'American black walnut, clear oil finish. Floating mount — all hardware included, works on drywall and masonry. 80 cm wide × 22 cm deep × 3.5 cm thick. Rated for 25 kg distributed load.',
    price: 110.00,
    image_url: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=500&q=80',
    category: 'Furniture',
    in_stock: true,
  },
  {
    id: 'p6',
    name: 'Concrete Desk Clock',
    description: 'Cast from GFRC (glass fiber reinforced concrete), so it\'s lighter than it looks — 380 g. Quartz movement, silent sweep second hand. Takes one AA battery. 14 cm diameter.',
    price: 55.00,
    image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&q=80',
    category: 'Decor',
    in_stock: true,
  },
  {
    id: 'p7',
    name: 'Woven Floor Rug',
    description: 'Flat-woven jute and cotton blend. Non-slip backing. 160 × 230 cm. Not suitable for very high-traffic areas or outdoors. Spot clean only — jute doesn\'t like being soaked.',
    price: 320.00,
    image_url: 'https://images.unsplash.com/photo-1579603099951-4d37532f81d1?w=500&q=80',
    category: 'Textiles',
    in_stock: true,
  },
  {
    id: 'p8',
    name: 'Minimalist Floor Lamp',
    description: 'Powder-coated steel stem, cast iron base. Adjustable head, 270° rotation. Takes E27 bulb up to 25 W (LED only — halogen will overheat the shade). Total height 155 cm.',
    price: 155.00,
    image_url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500&q=80',
    category: 'Lighting',
    in_stock: true,
  },
  {
    id: 'p9',
    name: 'Lounge Sofa',
    description: 'Kiln-dried hardwood frame, 8-way hand-tied springs. Boucle upholstery (78% wool, 22% nylon). Legs are solid beech, removable for tight doorways. 220 × 95 cm, seat depth 62 cm.',
    price: 1250.00,
    image_url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=500&q=80',
    category: 'Furniture',
    in_stock: true,
  },
];

async function seed() {
  console.log('Seeding products...');
  for (const p of products) {
    await pool.query(
      `INSERT INTO products (id, name, description, price, image_url, category, in_stock)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         description = EXCLUDED.description,
         price = EXCLUDED.price,
         image_url = EXCLUDED.image_url,
         category = EXCLUDED.category,
         in_stock = EXCLUDED.in_stock`,
      [p.id, p.name, p.description, p.price, p.image_url, p.category, p.in_stock]
    );
  }
  console.log(`Done — ${products.length} products seeded.`);
  await pool.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
