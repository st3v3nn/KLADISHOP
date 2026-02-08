-- Create profiles table (extends auth.users)
-- This table is automatically populated via triggers usually, but we'll keep it simple for now
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Create products table
create table public.products (
  id text primary key, -- Keeping text ID to match existing constants, usually uuid is better but this minimizes refactor
  name text not null,
  price integer not null,
  image text,
  gallery text[],
  category text,
  description text,
  tag text,
  stock integer default 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
alter table public.products enable row level security;

-- Policies for products
create policy "Products are viewable by everyone." on public.products
  for select using (true);

create policy "Admins can insert products." on public.products
  for insert with check (
    exists ( select 1 from public.profiles where id = auth.uid() and is_admin = true )
  );

create policy "Admins can update products." on public.products
  for update using (
    exists ( select 1 from public.profiles where id = auth.uid() and is_admin = true )
  );

create policy "Admins can delete products." on public.products
  for delete using (
    exists ( select 1 from public.profiles where id = auth.uid() and is_admin = true )
  );

-- Create orders table
create table public.orders (
  id text primary key,
  user_id uuid references auth.users,
  customer_name text not null,
  phone text not null,
  items jsonb not null, -- Storing items as JSONB for flexibility
  amount integer not null,
  status text not null, -- 'Pending', 'Processing', 'Shipped', 'Delivered'
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.orders enable row level security;

-- Policies for orders
-- Users can see their own orders
create policy "Users can view own orders." on public.orders
  for select using (auth.uid() = user_id);

-- Admins can see all orders
create policy "Admins can view all orders." on public.orders
  for select using (
    exists ( select 1 from public.profiles where id = auth.uid() and is_admin = true )
  );

-- Users can create orders
create policy "Users can create orders." on public.orders
  for insert with check (auth.uid() = user_id);

-- Favorites table
create table public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  product_id text references public.products(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, product_id)
);

-- Enable RLS
alter table public.favorites enable row level security;

create policy "Users can view own favorites." on public.favorites
  for select using (auth.uid() = user_id);

create policy "Users can add favorites." on public.favorites
  for insert with check (auth.uid() = user_id);

create policy "Users can remove favorites." on public.favorites
  for delete using (auth.uid() = user_id);

-- Storage buckets handling is usually done via API/Dashboard, but we can set policies
-- Assuming a bucket named 'products' exists.
-- insert into storage.buckets (id, name) values ('products', 'products');
-- create policy "Public Access" on storage.objects for select using ( bucket_id = 'products' );
-- create policy "Admin Insert" on storage.objects for insert with check ( bucket_id = 'products' and exists ( select 1 from public.profiles where id = auth.uid() and is_admin = true ) );
