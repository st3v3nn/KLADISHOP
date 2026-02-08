# Database Migration Required

## Problem
The `products` table is missing a default value for the `created_at` column, causing this error:
```
null value in column "created_at" of relation "products" violates not-null constraint
```

## Solution
Run this SQL in your **Supabase SQL Editor**:

```sql
-- Add default value for created_at
ALTER TABLE public.products 
ALTER COLUMN created_at SET DEFAULT now();

-- Also fix stock default
ALTER TABLE public.products 
ALTER COLUMN stock SET DEFAULT 1;
```

## Steps:
1. Go to your Supabase Dashboard
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"
4. Paste the SQL above
5. Click "Run" or press Ctrl+Enter
6. You should see "Success. No rows returned"

## After Running:
Restart your dev server and try uploading a product again. It should work!
