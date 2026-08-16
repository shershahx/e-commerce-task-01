# E-Commerce Task 01

A full-stack e-commerce demo built with:
- **Frontend:** React 19 + Vite + TypeScript + Tailwind
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL
- **Auth:** JWT + bcrypt password hashing

---

## What this project does

This app lets users:
- Browse products
- Filter/view product details
- Register/login
- Manage a cart
- Place orders
- View order history in profile

The frontend calls the backend through `/api/*` endpoints. During local development, Vite proxies `/api` requests to `http://localhost:5000`.

---

## Repository structure

```text
src/                 # React frontend
server/              # Express backend
  index.ts           # API server entrypoint
  db.ts              # PostgreSQL pool config
  schema.sql         # Database schema
  db-init.ts         # Creates tables
  seed.ts            # Seeds sample products
  middleware/auth.ts # JWT auth middleware
  routes/            # auth, products, cart, orders endpoints
```

---

## Backend detailed explanation

### 1) Server bootstrap (`server/index.ts`)
- Loads env vars with `dotenv`
- Enables CORS (`CLIENT_ORIGIN`) and JSON body parsing
- Mounts route groups:
  - `/api/auth`
  - `/api/products`
  - `/api/cart`
  - `/api/orders`
- Exposes health endpoint: `GET /api/health`

### 2) Database layer (`server/db.ts`)
- Creates a shared PostgreSQL connection pool using `pg.Pool`
- Reads DB credentials from environment variables:
  - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- Handles idle client errors and exits process on fatal pool errors

### 3) Auth middleware (`server/middleware/auth.ts`)
- `requireAuth`: requires `Authorization: ****** and rejects invalid/missing token with `401`
- `optionalAuth`: reads token if present but does not block unauthenticated requests
- Decoded JWT payload includes `userId`, attached to request as `req.userId`

### 4) Route modules

#### Auth routes (`server/routes/auth.ts`)
- `POST /api/auth/register`
  - Validates name/email/password (password min 6)
  - Checks duplicate email
  - Hashes password with bcrypt
  - Creates user and returns `{ user, token }`
- `POST /api/auth/login`
  - Validates credentials
  - Verifies password hash
  - Returns `{ user, token }`
- `GET /api/auth/me` (protected)
  - Returns current authenticated user profile

#### Product routes (`server/routes/products.ts`)
- `GET /api/products`
  - Returns all products ordered by name
  - Optional query param: `category`
- `GET /api/products/:id`
  - Returns single product or `404`

#### Cart routes (`server/routes/cart.ts`) (protected)
- `GET /api/cart` → fetch current user cart
- `POST /api/cart` → add item (`productId`, optional `quantity`)
  - Upserts by `(user_id, product_id)` and increases quantity
- `PUT /api/cart/:productId` → set quantity (deletes if `<= 0`)
- `DELETE /api/cart/:productId` → remove item
- `DELETE /api/cart` → clear cart

#### Order routes (`server/routes/orders.ts`)
- `POST /api/orders` (guest or logged-in)
  - Uses DB transaction (`BEGIN/COMMIT/ROLLBACK`)
  - Validates checkout fields and items
  - Generates order id (e.g. `ORD-XXXXXXXX`)
  - Inserts into `orders` + `order_items`
  - Clears authenticated user cart
  - Returns `{ orderId, total, status }`
- `GET /api/orders` (protected)
  - Returns current user order summaries + items
- `GET /api/orders/:id` (protected)
  - Returns one order if owned by current user

### 5) Database schema (`server/schema.sql`)
Tables:
- `users`
- `products`
- `cart_items`
- `orders`
- `order_items`

Key relationships:
- `cart_items.user_id -> users.id`
- `cart_items.product_id -> products.id`
- `orders.user_id -> users.id`
- `order_items.order_id -> orders.id`

### 6) Seed data (`server/seed.ts`)
- Adds/upserts sample catalog items into `products`
- Useful for local setup and demos

---

## Setup

### Prerequisites
- Node.js 18+ (or newer LTS)
- npm
- PostgreSQL (running locally or reachable remotely)

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set values:
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `JWT_SECRET` (use a long random secret)
- `PORT` (default backend port: `5000`)
- `CLIENT_ORIGIN` (default frontend dev URL: `http://localhost:3000`)

### 3) Initialize database schema

```bash
npm run db:init
```

### 4) Seed products

```bash
npm run db:seed
```

### 5) Run backend

```bash
npm run dev:server
```

Backend runs at: `http://localhost:5000`

### 6) Run frontend (new terminal)

```bash
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## How to use

1. Open `http://localhost:3000`
2. Browse products from Home/Collections/New Arrivals
3. Register or login from `/auth`
4. Add items to cart
5. Checkout from `/checkout`
6. View order history from `/profile` (for logged-in users)

---

## API quick reference

### Health
- `GET /api/health`

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` *(****** required)*

### Products
- `GET /api/products`
- `GET /api/products?category=Furniture`
- `GET /api/products/:id`

### Cart *(****** required)*
- `GET /api/cart`
- `POST /api/cart`
- `PUT /api/cart/:productId`
- `DELETE /api/cart/:productId`
- `DELETE /api/cart`

### Orders
- `POST /api/orders` *(guest and authenticated supported)*
- `GET /api/orders` *(****** required)*
- `GET /api/orders/:id` *(****** required)*

---

## Available scripts

- `npm run dev` → start Vite frontend dev server
- `npm run dev:server` → start backend with hot reload
- `npm run build` → build frontend
- `npm run preview` → preview built frontend
- `npm run db:init` → create DB tables
- `npm run db:seed` → seed product data
- `npm run lint` → TypeScript type check (`tsc --noEmit`)

---

## Notes

- Frontend stores JWT as `auth_token` in `localStorage`
- Frontend stores local cart as `cart_items` in `localStorage`
- Backend CORS allows `CLIENT_ORIGIN` and credentials
- Checkout payment fields are demo-only (card data is validated client-side and not saved in DB)
