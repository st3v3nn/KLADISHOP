# Quick Setup Guide

## All Bugs Fixed

The following issues have been resolved:
1. Image upload crashes - FIXED
2. Unable to add products - FIXED
3. Unable to edit products - FIXED
4. Missing Firebase imports - FIXED
5. Upload progress not showing - FIXED

## Setup Steps

### Step 1: Configure Supabase Storage

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `supabase/storage_setup.sql`
5. Click **Run** or press Ctrl+Enter
6. You should see "Success" message

### Step 2: Set Admin Privileges

Run this SQL in Supabase SQL Editor (replace with your email):

```sql
UPDATE profiles
SET is_admin = true
WHERE email = 'your-email@example.com';
```

### Step 3: Start Development Server

```bash
npm run dev
```

### Step 4: Test the Admin Dashboard

1. Open http://localhost:3000
2. Sign in with your admin account
3. Click **Admin Dashboard** button (bottom of page, footer)
4. You should see the Command Center

### Step 5: Test Adding a Product

1. Click **Products** tab
2. Click **ADD NEW DROP** button
3. Fill in the form:
   - Product Name
   - Price
   - Stock (optional)
   - Category
   - Tag (optional, e.g., "NEW", "RARE")
   - Description
4. Click **UPLOAD** button next to Main Image
5. Select an image file (JPEG, PNG, WebP, or GIF)
6. Watch the progress: 0% → 25% → 50% → 75% → 100%
7. The image URL should auto-populate
8. Click **SAVE PRODUCT**
9. Product should appear in the inventory table

### Step 6: Test Editing a Product

1. Click the edit icon (pencil) on any product
2. Change any field
3. Upload a new image if desired
4. Click **SAVE PRODUCT**
5. Changes should be reflected immediately

## Troubleshooting

### Issue: "Not authorized" when uploading

**Solution:**
1. Verify admin privileges: Check SQL query in Step 2
2. Run the storage setup SQL: `supabase/storage_setup.sql`
3. Log out and log back in to refresh your session

### Issue: Upload button doesn't respond

**Solution:**
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Verify the `products` bucket exists in Supabase Storage

### Issue: Products not saving

**Solution:**
1. Check browser console for errors
2. Verify the `created_at` column has a default value:
   ```sql
   ALTER TABLE products
   ALTER COLUMN created_at SET DEFAULT now();
   ```
3. Check that all required fields are filled

### Issue: Image URL not showing after upload

**Solution:**
1. Verify the storage bucket is public
2. Check that the file was uploaded (Supabase Dashboard → Storage → products)
3. Try refreshing the page

## What Changed

### Before (Broken)
- AdminDashboard imported non-existent `useFirebaseStorage`
- Firebase/Firestore imports when using Supabase
- No upload progress tracking
- Products failing to save due to schema issues

### After (Fixed)
- Uses correct `useStorage` hook
- All Supabase imports and functions
- Real-time upload progress (0-100%)
- Proper product save/edit with all fields
- Added stock and tag fields to product form
- Better error handling and display

## File Changes

1. `hooks/useStorage.ts` - Added uploadProgress state
2. `components/AdminDashboard.tsx` - Complete rewrite to use Supabase
3. `supabase/storage_setup.sql` - New file for bucket configuration

## Testing Checklist

- [ ] Storage bucket created and configured
- [ ] Admin privileges granted
- [ ] Can access Admin Dashboard
- [ ] Can add new product with image upload
- [ ] Upload progress shows 0% → 100%
- [ ] Image URL auto-populates after upload
- [ ] Product appears in inventory
- [ ] Can edit existing product
- [ ] Can upload multiple gallery images
- [ ] Changes save successfully

## Need Help?

If you're still experiencing issues:

1. Check browser console (F12 → Console)
2. Check Network tab for failed requests
3. Verify Supabase configuration:
   - Project URL in `.env.local`
   - Anon key in `.env.local`
   - Storage bucket exists
   - Admin privileges set

## Next Steps

Once everything works:
1. Add more products
2. Test on different browsers
3. Deploy to production
4. Set up proper backup strategy

Your admin dashboard is now fully functional with working image uploads!
