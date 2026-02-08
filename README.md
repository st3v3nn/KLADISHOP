<div align="center">
  <h1 style="font-size: 3em; font-weight: 900; letter-spacing: -2px;">
    KLADI<span style="color: #FF007F;">SHOP</span>
  </h1>
  <p style="font-size: 1.2em; font-weight: bold;">
    A Gen-Z Thrift Hub • Neo-Brutalist E-Commerce Platform
  </p>
  <p>
    <strong>React 19</strong> • <strong>TypeScript</strong> • <strong>Vite</strong> • <strong>Supabase</strong> • <strong>Tailwind CSS</strong>
  </p>
</div>

---

## 🎯 What is KLADISHOP?

**KLADISHOP** is a modern e-commerce platform built for the thrift community. With a bold neo-brutalist aesthetic featuring 4px borders, offset shadows, and signature neon colors (#FF007F hot pink, #A3FF00 lime green), it provides:

- 🛍️ **Product Catalog** - Browse curated drops by category (Tops, Bottoms, Outerwear, Knitwear, Accessories)
- 🛒 **Shopping Cart** - Add/remove items with real-time updates
- ❤️ **Persistent Favorites** - Save items to your wishlist (survives sessions)
- 📦 **Order Management** - Track order status from pending to delivered
- 📸 **Image Upload** - Admins can upload product photos with auto-resizing
- 🔐 **Secure Authentication** - Supabase Auth (Email/Password)
- 📱 **Mobile Optimized** - Fully responsive design for Android & iOS

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+ or yarn
- Supabase project

### Installation

```bash
# Clone and install dependencies
git clone <repository>
cd kladi-shop
npm install

# Start dev server
npm run dev
# Opens at http://localhost:3001
```

### Set Up Supabase

1. Create a project at https://supabase.com
2. Copy `.env.example` to `.env.local` and add your URL/Anon Key.
3. Run the schema from `supabase/schema.sql` in the SQL Editor.
4. Run storage policies from `supabase/storage_policies.sql`.

### Deploy Admin Access

1. Create an admin account at http://localhost:3001/sign-in
2. Go to Supabase Dashboard → Authentication → Users
3. Find your admin email
4. Update the `profiles` table for this user, setting `is_admin` to `true`.
5. Refresh the app and click "Admin Dashboard"

---

## ✨ Key Features

### 1. 👮 Admin Panel Access
- **Role Based**: Uses `profiles` table with `is_admin` boolean.
- **Secure**: RLS policies enforce admin-only write access.
- **Setup**: Quick update in Supabase Dashboard.

**How it works:**
```
User logs in → Session fetched → Profile checked (is_admin: true) → Dashboard unlocked
```

### 2. 📸 Supabase Storage Image Upload
- **Automatic Resize**: Images auto-compress to 1200px width @ 85% quality
- **Batch Upload**: Upload multiple gallery images at once
- **Optimized URLs**: CDN-served download links for fast loading
- **No Size Limits**: Backend handles all file sizes

**Upload path**: Admin Dashboard → Products → Click "UPLOAD"

### 3. ❤️ Persistent Favorites
- **Supabase Storage**: Favorites saved in `favorites` table, linked by `user_id`
- **Real-Time Sync**: Changes sync across all devices
- **Session Survival**: Favorites persist even after logout
- **Secure**: Users can only see/modify their own favorites via RLS

**Access**: Click heart icon on product, or view "Favorites" button in nav

### 4. 📦 Order History & Tracking
- **Customer View**: See all past orders with status
- **Admin Management**: Update order status (Pending → Processing → Shipped → Delivered)
- **Real-Time Updates**: Order status changes appear instantly
- **Order Details**: View items and total for each order

**Customer Access**: Click "Orders" button (desktop) or mobile menu
**Admin Access**: Admin Dashboard → Orders Tab

---

## 📁 Project Structure

```
kladi-shop/
├── src/
│   ├── supabase.ts              # Supabase client initialization
│   ├── types.ts                 # TypeScript types
├── hooks/
│   ├── useAuth.ts               # Auth with user profiles
│   ├── useDatabase.ts           # Supabase CRUD operations
│   ├── useStorage.ts            # Image upload/resize
│   └── useFavorites.ts          # Favorites management
├── components/
│   ├── AdminDashboard.tsx       # Product/order management
│   ├── AdminAuthModal.tsx       # Admin verification
│   ├── AuthModal.tsx            # Sign in/sign up
│   ├── ProductGrid.tsx          # Product listing
│   ├── ProductDetailsModal.tsx  # Product detail view
│   ├── CartDrawer.tsx           # Shopping cart
│   ├── OrderHistory.tsx         # Customer order view
│   ├── CheckoutModal.tsx        # Purchase flow
│   ├── Hero.tsx                 # Landing section
│   └── ErrorBoundary.tsx        # Error handling
├── App.tsx                      # Main app component
├── index.tsx                    # App entry point
├── constants.tsx                # Product data & config
├── firestore.rules              # Security rules
├── ADMIN_SETUP.md               # Admin guide
└── README.md                    # This file
```

---

## 🔒 Security

### Firestore Rules
- **Products**: Public read (anyone can browse)
- **Orders**: Private (users only see their own)
- **Favorites**: Private (per-user storage)
- **Admin Write**: Only users with `admin: true` claim

### Environment Variables
- Firebase config is public (necessary for client SDK)
- No sensitive API keys exposed
- All security enforced server-side via Firestore rules

### Best Practices
- Never log sensitive data to console
- Always validate user input server-side
- Use HTTPS in production
- Regenerate API keys if exposed

---

## 🎨 Styling & Design

### Neo-Brutalist Aesthetic
- **Borders**: 4px solid black (#000)
- **Shadows**: `4px 4px 0px rgba(0,0,0,0.5)` (offset style)
- **Typography**: Bold, all-caps, italic
- **Color Palette**:
  - 🔴 **Primary**: #FF007F (Hot Pink)
  - 🟢 **Accent**: #A3FF00 (Neon Lime)
  - 🟣 **Secondary**: #7B2CBF (Purple)
  - ⚫ **Text**: #000000 (Black)

### Tailwind Classes
- `neo-shadow-lg` - Large offset shadow
- `neo-shadow-sm` - Small offset shadow
- `border-4` - Thick borders throughout

---

## 📊 Database Schema

### Firestore Collections

#### `products`
```typescript
{
  id: string              // Unique product ID
  name: string            // Product name
  price: number           // Price in KES
  category: string        // Tops, Bottoms, etc.
  image: string           // Main image URL (Firebase Storage)
  gallery: string[]       // Additional image URLs
  description: string     // Product description
  stock: number           // Quantity available
  tag?: string            // Optional tag (e.g., "NEW", "SALE")
}
```

#### `orders`
```typescript
{
  id: string              // Order ID
  userId: string          // Customer user ID
  customerName: string    // Customer name
  phone: string           // Contact phone
  date: string            // Order date (ISO string)
  items: OrderItem[]      // Products ordered
  amount: number          // Total amount
  status: OrderStatus     // Pending|Processing|Shipped|Delivered
}
```

#### `favorites/{userId}/items`
```typescript
{
  productId: string       // ID of favorited product
  addedAt: string         // When added (ISO string)
}
```

---

## 🛠️ Development

### Available Scripts

```bash
# Start dev server (watches for changes)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Type checking (with TypeScript)
# Automatically run on save in VS Code
```

### Hot Module Reloading (HMR)
- Changes auto-refresh in browser
- State is preserved (cart, auth, etc.)
- Edit components and see updates instantly

### Environment Setup
```bash
# If needed, create .env.local (all Firebase config is in src/firebase.ts)
VITE_API_KEY=...  # Optional: for Vite build variables
```

---

## 📱 Mobile Optimization

- **Responsive Grid**: 1 column on mobile, 2 on tablet, 3 on desktop
- **Touch-Friendly**: Min 44px button sizes
- **Meta Tags**: Viewport, theme colors set for Android
- **Favicons**: SVG icon with neo-brutalist design
- **Safe Zoom**: Inputs prevent automatic zoom on focus

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# 1. Push to GitHub
git push origin main

# 2. Connect repo to Vercel
# https://vercel.com/new

# 3. Deploy (Vercel auto-detects Vite)
# Done! Your app is live
```

### Deploy to Firebase Hosting

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Initialize Firebase project
firebase init hosting

# 4. Deploy
firebase deploy
```

### Deploy Firestore Rules

```bash
# Make sure security rules are in firestore.rules
# Then deploy:
firebase deploy --only firestore:rules
```

---

## ❓ FAQ

### How do I make someone an admin?
1. Go to Firebase Console → Authentication → Users
2. Find their email
3. Click "Custom claims" → Add `{ "admin": true }`
4. They're now admin after next login

### Where are product images stored?
Firebase Storage bucket: `kladishop-7ad46.firebasestorage.app/products/`

### Can customers upload images?
Currently, only admins can upload. To allow customers:
1. Update `AdminDashboard.tsx` to be accessible to all users
2. Update Firestore rules to allow user writes to products
3. Add moderation system

### How do I change prices?
Admin Dashboard → Products Tab → Edit product → Change "Price (KES)"

### What payment methods are supported?
Currently, checkout creates orders but doesn't process payments. To add:
1. Integrate Stripe/Lipa Na M-Pesa API
2. Add payment modal before order creation
3. Verify payment in Cloud Function before finalizing

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 already in use | Dev server auto-uses 3001, or: `sudo lsof -i :3000` and kill |
| Firebase connection error | Check `src/firebase.ts` config matches your project |
| Images not uploading | Verify Firebase Storage is enabled in Console |
| Admin access denied | Confirm custom claim is set: Firebase Console → Custom claims |
| Orders not showing | Ensure order has `userId` field, user is logged in |

---

## 📚 Resources

- 📖 [Firebase Docs](https://firebase.google.com/docs)
- 🎨 [Tailwind CSS](https://tailwindcss.com)
- ⚛️ [React Docs](https://react.dev)
- 🔧 [Vite Docs](https://vitejs.dev)
- 📱 [TypeScript Docs](https://www.typescriptlang.org)

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👥 Contributing

Found a bug or want to add a feature? 

1. Fork the repo
2. Create a branch: `git checkout -b feature/amazing-thing`
3. Commit: `git commit -m 'Add amazing thing'`
4. Push: `git push origin feature/amazing-thing`
5. Open a Pull Request

---

## 🙏 Special Thanks

- **Gen-Z Thrift Community** - for inspiring this platform
- **Firebase** - for the backend infrastructure
- **Tailwind CSS** - for utility-first styling
- **React Team** - for an amazing framework

---

**Made with ❤️ and a love for thrifting** 🛍️
