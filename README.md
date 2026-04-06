# Treandspot - Modern E-Commerce Platform

A full-stack e-commerce platform with glassmorphism UI, dark/neon theme, and 200+ products.

## Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion, Zustand
- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT
- **Payments**: Stripe

## Project Structure

```
treandspot/
├── frontend/          # Next.js app
│   ├── pages/
│   │   ├── index.js           # Home page
│   │   ├── products/          # Product listing & detail
│   │   ├── cart.js            # Cart page
│   │   ├── checkout.js        # Checkout flow
│   │   ├── wishlist.js        # Wishlist
│   │   ├── auth/              # Login & Register
│   │   ├── dashboard/         # User dashboard & orders
│   │   └── admin/             # Admin panel
│   ├── components/            # Navbar, Footer, ProductCard, etc.
│   ├── store/                 # Zustand global state
│   ├── lib/                   # Axios API client
│   └── styles/                # Global CSS
└── backend/
    ├── models/                # Mongoose schemas
    ├── routes/                # Express routes
    ├── middleware/            # Auth middleware
    ├── utils/                 # JWT helper
    └── scripts/               # Seed script
```

## Setup Instructions

### 1. Backend

```bash
cd treandspot/backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and secrets
npm run dev
```

### 2. Seed Products (200+ products)

```bash
cd treandspot/backend
npm run seed
```

### 3. Frontend

```bash
cd treandspot/frontend
npm install
cp .env.example .env.local
# Edit .env.local with your API URL and Stripe key
npm run dev
```

Frontend runs on: http://localhost:3000  
Backend runs on: http://localhost:5000

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/treandspot
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
STRIPE_SECRET_KEY=sk_test_...
CLIENT_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_KEY=pk_test_...
```

## Creating Admin User

Register normally, then update the user role in MongoDB:
```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

## Coupon Codes

- `TREND10` - 10% off
- `SAVE20` - 20% off  
- `FIRST50` - 50% off

## Features

- JWT auth with role-based access (user/admin)
- 200+ seeded products across 7 categories
- Cart with quantity management and coupons
- Wishlist system
- Order management with status tracking
- Admin dashboard (products, orders, users)
- Search with autocomplete
- Glassmorphism dark UI with neon accents
- Fully responsive mobile design
- Stripe payment integration
