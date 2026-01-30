# Admin & Features Setup Guide

## 🔐 Firebase Custom Claims for Admin Authentication

The app now uses **Firebase Custom Claims** instead of hardcoded passwords for secure admin authentication. Here's how to set it up:

### Step 1: Create an Admin User Account
1. Go to http://localhost:3001 (or your deployed URL)
2. Click "Sign In" → "Create Account"
3. Sign up with an email like `admin@kladishop.com`
4. You're now logged in as a regular user

### Step 2: Set Admin Claim (Choose One Method)

#### **Option A: Firebase Console (Easiest) ⭐ RECOMMENDED**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project "kladishop-7ad46"
3. Go to **Authentication** → **Users**
4. Find your admin user email
5. Click the **Custom claims** button (looks like `{ }`in the user row)
6. Paste this JSON:
   ```json
   { "admin": true }
   ```
7. Click **Update**

#### **Option B: Using Firebase CLI**
```bash
# Install Firebase CLI globally if you haven't already
npm install -g firebase-tools

# Login to Firebase (opens browser)
firebase login

# Set the custom claim (replace YOUR_UID with user's UID from Console)
firebase auth:import --accounts-file=/dev/stdin --project kladishop-7ad46

# Easier: Use this command to set directly
firebase projects:list  # to see your project
```

#### **Option C: Cloud Function (For Production)**
Deploy this Callable Cloud Function to set claims programmatically:

```javascript
// functions/setAdmin.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.setAdminClaim = functions.https.onCall(async (data, context) => {
  // Security: Only let existing admins set new admins
  if (!context.auth?.token?.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Not authorized');
  }
  
  const { uid } = data;
  await admin.auth().setCustomUserClaims(uid, { admin: true });
  return { success: true, message: `${uid} is now an admin` };
});
```

### Step 3: Verify Admin Access
1. Refresh the page (or log out and log back in)
2. The custom claim will be loaded into the user token
3. Click the **Admin Dashboard** button (top right)
4. You should now have full access to the Command Center!

---

## 📸 Image Upload Guide

### Uploading Product Images

1. **Go to Admin Dashboard** → **Products Tab**
2. **Click "Add New Drop"** or edit an existing product
3. **Upload Main Image:**
   - Click the yellow "UPLOAD" button next to Image URL
   - Select a JPG/PNG image
   - The image will auto-resize to 1200px width for performance
4. **Upload Gallery Images (Multiple):**
   - Click the purple "ADD" button next to Gallery Images
   - Select multiple images at once
   - They'll be automatically resized and added to the gallery
5. **Save Product**

**Image Requirements:**
- Supported formats: JPG, PNG, WebP
- Max file size: No limit (will be resized)
- Recommended resolution: 600x800px or higher (portrait)
- Images are stored in Firebase Storage under `/products/main` and `/products/gallery`

### Image Storage & Performance
- Images are automatically resized to max 1200px width
- Compression quality: 85% (good balance between quality and file size)
- All URLs are optimized for fast loading
- Images are stored in your Firebase project's Storage bucket

---

## ❤️ Favorites Persistence

**How it works:**
- User favorites are now automatically saved to Firestore
- Each user has their own `/favorites/{userId}` collection
- Favorites survive across sessions and devices
- Click the heart icon on any product to add/remove from favorites
- Click "FAVORITES" button in nav to see only your wishlist items

**Technical Details:**
- Stored in Firestore under: `favorites/{userId}/{favoriteId}`
- Each favorite record contains: `{ productId, addedAt }`
- Real-time sync via `useFavorites` hook
- Requires user to be logged in

---

## 📦 Order History

### For Customers:
1. **Log in** to your account
2. Click **"ORDERS"** button in the navigation (desktop) or mobile menu
3. See all your past orders with:
   - Order ID
   - Order date
   - Current status (Pending → Processing → Shipped → Delivered)
   - Items ordered and total amount

### For Admins:
1. Go to **Admin Dashboard** → **Orders Tab**
2. See all customer orders
3. Update order status by clicking status icons:
   - ⏰ Pending
   - 📦 Processing
   - 🚚 Shipped
   - ✓ Delivered

**Order Statuses:**
- **Pending**: Order just received
- **Processing**: Picking and packing items
- **Shipped**: Order left warehouse, in transit
- **Delivered**: Customer received order

---

## 🔒 Firestore Security Rules

Security rules have been updated to support:
- **Products**: Public read, admin-only write (via custom claims)
- **Orders**: Users can only read/write their own orders
- **Favorites**: Users can only read/write their own favorites
- **Users**: Users can only read/write their own profile

**Rules deployed to:** `firestore.rules` (Ready to deploy to Firebase Console)

To deploy security rules:
```bash
firebase deploy --only firestore:rules
```

---

## 🚀 Deployment Checklist

Before going live:

- [ ] Set admin custom claims for your admin accounts
- [ ] Upload all product images via the dashboard
- [ ] Test checkout flow with a test product
- [ ] Deploy Firestore security rules: `firebase deploy --only firestore:rules`
- [ ] Test admin panel access
- [ ] Verify order history appears correctly
- [ ] Test favorites persistence across sessions

---

## 📚 Related Files

- `src/firebase.ts` - Firebase configuration
- `hooks/useFirebaseAuth.ts` - Authentication with custom claims
- `hooks/useFirebaseStorage.ts` - Image upload & resize logic
- `hooks/useFavorites.ts` - Favorites persistence
- `components/AdminAuthModal.tsx` - Admin verification using claims
- `components/AdminDashboard.tsx` - Product & order management
- `components/OrderHistory.tsx` - Customer order viewing
- `firestore.rules` - Security rules

---

## ❓ Troubleshooting

### "Access Denied" message when clicking Admin
- Custom claims not set yet, follow Step 2 above
- Try logging out and logging back in to refresh the token
- Check Firebase Console to confirm claim is saved

### Images not uploading
- Check Firebase Storage bucket is enabled in Console
- Verify Firestore rules allow writes to `products/*`
- Check browser console for detailed error messages

### Orders not showing in history
- Make sure `userId` is saved with each order (should be automatic)
- Check Firestore Console to verify order has `userId` field
- User must be logged in to view their orders

---

**Need help?** Check the Firebase docs at https://firebase.google.com/docs

2. The app automatically detects the `admin` custom claim
3. They can access the Admin Dashboard without needing a password
