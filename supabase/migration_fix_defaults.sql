-- Migration: Add default value to created_at column
-- Run this in Supabase SQL Editor

ALTER TABLE public.products 
ALTER COLUMN created_at SET DEFAULT now();

-- Also fix stock default (schema shows 0 but was 1 in original)
ALTER TABLE public.products 
ALTER COLUMN stock SET DEFAULT 1;
