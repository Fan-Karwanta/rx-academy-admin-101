-- SQL to set up default admin credentials for RX Lifestyle Admin Panel
-- Run this AFTER executing the main supabase-schema.sql

-- STEP 1: First create the admin user through Supabase Auth Dashboard
-- Go to Authentication > Users > Add User
-- Email: rx@admin
-- Password: rxacademy2025
-- Copy the generated User ID and replace YOUR_ADMIN_USER_ID below

-- STEP 2: After creating user in Supabase Auth, run this SQL
-- Replace YOUR_ADMIN_USER_ID with the actual UUID from the created user

INSERT INTO public.profiles (id, email, full_name, subscription_tier, subscription_status)
VALUES (
  'YOUR_ADMIN_USER_ID', -- Replace with actual UUID from Supabase Auth
  'rx@admin',
  'RX Admin',
  'enterprise',
  'active'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  subscription_tier = EXCLUDED.subscription_tier,
  subscription_status = EXCLUDED.subscription_status;

-- Add admin privileges
INSERT INTO public.admin_users (id, role, permissions)
VALUES (
  'YOUR_ADMIN_USER_ID', -- Same UUID as above
  'super_admin',
  ARRAY['user_management', 'content_management', 'admin_management', 'system_settings', 'archive_management']
) ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  permissions = EXCLUDED.permissions;

-- ALTERNATIVE METHOD: If you already have a user with email rx@admin
-- Uncomment the following to add admin privileges to existing user:

/*
INSERT INTO public.admin_users (id, role, permissions)
SELECT 
  p.id,
  'super_admin',
  ARRAY['user_management', 'content_management', 'admin_management', 'system_settings', 'archive_management']
FROM public.profiles p
WHERE p.email = 'rx@admin'
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  permissions = EXCLUDED.permissions;

UPDATE public.profiles 
SET 
  subscription_tier = 'enterprise',
  subscription_status = 'active',
  full_name = 'RX Admin'
WHERE email = 'rx@admin';
*/

-- Verify the admin user was created
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.subscription_tier,
  p.subscription_status,
  a.role,
  a.permissions
FROM public.profiles p
JOIN public.admin_users a ON p.id = a.id
WHERE p.email = 'rx@admin';
