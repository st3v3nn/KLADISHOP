-- Storage Policies for 'products' bucket

-- Ensure the bucket exists (if not created via script/dashboard)
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

-- 1. Allow Public Read Access
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'products' );

-- 2. Allow Admins to Upload (Insert)
create policy "Admin Insert"
on storage.objects for insert
with check (
  bucket_id = 'products' 
  and auth.role() = 'authenticated'
  and exists (
    select 1 from public.profiles
    where id = auth.uid()
    and is_admin = true
  )
);

-- 3. Allow Admins to Update
create policy "Admin Update"
on storage.objects for update
using (
  bucket_id = 'products' 
  and auth.role() = 'authenticated'
  and exists (
    select 1 from public.profiles
    where id = auth.uid()
    and is_admin = true
  )
);

-- 4. Allow Admins to Delete
create policy "Admin Delete"
on storage.objects for delete
using (
  bucket_id = 'products' 
  and auth.role() = 'authenticated'
  and exists (
    select 1 from public.profiles
    where id = auth.uid()
    and is_admin = true
  )
);
