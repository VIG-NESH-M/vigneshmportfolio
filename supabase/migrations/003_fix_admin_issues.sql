-- =============================================================================
-- FIX ADMIN AUTHORIZATION ISSUES
-- =============================================================================
-- This script fixes the infinite recursion and missing user_id column issues
-- =============================================================================

-- First, drop all existing policies on admin_users to avoid recursion
drop policy if exists "Allow admin read access on admin_users" on public.admin_users;
drop policy if exists "Allow admin full access on admin_users" on public.admin_users;

-- Add missing user_id column to admin_users table
alter table public.admin_users 
add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- Create a simple, non-recursive policy for admin_users
-- This allows users to read admin_users only if they are authenticated and their user_id matches
create policy "Allow authenticated users to read own admin record"
  on public.admin_users for select
  to authenticated using (auth.uid() = user_id);

-- Allow insert for authenticated users (for initial setup)
create policy "Allow authenticated users to insert admin record"
  on public.admin_users for insert
  to authenticated with check (auth.uid() = user_id);

-- Allow update for authenticated users on their own record
create policy "Allow authenticated users to update own admin record"
  on public.admin_users for update
  to authenticated using (auth.uid() = user_id);

-- Fix all other policies to use user_id instead of email for better performance
-- and to avoid recursion issues

-- Drop existing policies that cause recursion
drop policy if exists "Allow admin full access on portfolio_config" on public.portfolio_config;
drop policy if exists "Allow admin full access on nav_links" on public.nav_links;
drop policy if exists "Allow admin full access on skills" on public.skills;
drop policy if exists "Allow admin full access on projects" on public.projects;
drop policy if exists "Allow admin full access on experience" on public.experience;
drop policy if exists "Allow admin full access on social_links" on public.social_links;
drop policy if exists "Allow admin read access on contact_messages" on public.contact_messages;
drop policy if exists "Allow admin update on contact_messages" on public.contact_messages;

-- Create new non-recursive policies using user_id
create policy "Allow admin full access on portfolio_config"
  on public.portfolio_config for all
  to authenticated using (
    auth.uid() in (select user_id from public.admin_users where is_active = true)
  );

create policy "Allow admin full access on nav_links"
  on public.nav_links for all
  to authenticated using (
    auth.uid() in (select user_id from public.admin_users where is_active = true)
  );

create policy "Allow admin full access on skills"
  on public.skills for all
  to authenticated using (
    auth.uid() in (select user_id from public.admin_users where is_active = true)
  );

create policy "Allow admin full access on projects"
  on public.projects for all
  to authenticated using (
    auth.uid() in (select user_id from public.admin_users where is_active = true)
  );

create policy "Allow admin full access on experience"
  on public.experience for all
  to authenticated using (
    auth.uid() in (select user_id from public.admin_users where is_active = true)
  );

create policy "Allow admin full access on social_links"
  on public.social_links for all
  to authenticated using (
    auth.uid() in (select user_id from public.admin_users where is_active = true)
  );

create policy "Allow admin read access on contact_messages"
  on public.contact_messages for select
  to authenticated using (
    auth.uid() in (select user_id from public.admin_users where is_active = true)
  );

create policy "Allow admin update on contact_messages"
  on public.contact_messages for update
  to authenticated using (
    auth.uid() in (select user_id from public.admin_users where is_active = true)
  );

-- Now insert the admin user with the correct user_id
-- First delete any existing records to avoid duplicates
DELETE FROM public.admin_users WHERE email = 'vignezhm@gmail.com';

-- Insert the admin user with the correct user_id from the debug info
INSERT INTO public.admin_users (user_id, email, is_active, created_at)
VALUES ('19251349-ed3a-4125-863a-9509779627af', 'vignezhm@gmail.com', true, NOW());

-- Verify the setup
SELECT 
    'Admin user setup verification' as check_type,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE user_id = '19251349-ed3a-4125-863a-9509779627af' 
            AND email = 'vignezhm@gmail.com' 
            AND is_active = true
        ) THEN '✅ Admin user properly configured'
        ELSE '❌ Admin user setup failed'
    END as status;

-- Show the admin user record
SELECT 
    id,
    user_id,
    email,
    is_active,
    created_at
FROM public.admin_users 
WHERE email = 'vignezhm@gmail.com';
