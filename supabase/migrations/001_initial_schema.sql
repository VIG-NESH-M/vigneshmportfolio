-- =============================================================================
-- SUPABASE PORTFOLIO DATABASE SCHEMA
-- =============================================================================
-- This migration creates the complete database schema for the portfolio
-- with Row Level Security (RLS) policies for admin-only write access
-- =============================================================================

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- =============================================================================
-- MAIN PORTFOLIO CONFIGURATION TABLE
-- =============================================================================
create table public.portfolio_config (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  about_tagline text not null,
  about_content text not null,
  hero_title text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================================================
-- NAVIGATION LINKS TABLE
-- =============================================================================
create table public.nav_links (
  id uuid default uuid_generate_v4() primary key,
  href text not null,
  label text not null,
  sort_order integer not null default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================================================
-- SKILLS TABLE
-- =============================================================================
create table public.skills (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  level text not null, -- e.g., "90%"
  label text not null, -- e.g., "Expert", "Advanced"
  sort_order integer not null default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================================================
-- PROJECTS TABLE
-- =============================================================================
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  tags text[] not null default '{}',
  link text,
  image_url text,
  sort_order integer not null default 0,
  is_featured boolean default false,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================================================
-- EXPERIENCE TABLE
-- =============================================================================
create table public.experience (
  id uuid default uuid_generate_v4() primary key,
  date_range text not null, -- e.g., "2022 - Present"
  role text not null,
  company text not null,
  description text not null,
  sort_order integer not null default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================================================
-- SOCIAL LINKS TABLE
-- =============================================================================
create table public.social_links (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  href text not null,
  icon_name text, -- For storing icon identifier
  sort_order integer not null default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================================================
-- CONTACT MESSAGES TABLE (for contact form submissions)
-- =============================================================================
create table public.contact_messages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- =============================================================================
-- ADMIN USERS TABLE (for tracking admin access)
-- =============================================================================
create table public.admin_users (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- =============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =============================================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- =============================================================================
-- CREATE UPDATED_AT TRIGGERS
-- =============================================================================
create trigger handle_portfolio_config_updated_at
  before update on public.portfolio_config
  for each row execute function public.handle_updated_at();

create trigger handle_nav_links_updated_at
  before update on public.nav_links
  for each row execute function public.handle_updated_at();

create trigger handle_skills_updated_at
  before update on public.skills
  for each row execute function public.handle_updated_at();

create trigger handle_projects_updated_at
  before update on public.projects
  for each row execute function public.handle_updated_at();

create trigger handle_experience_updated_at
  before update on public.experience
  for each row execute function public.handle_updated_at();

create trigger handle_social_links_updated_at
  before update on public.social_links
  for each row execute function public.handle_updated_at();

-- =============================================================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- =============================================================================
alter table public.portfolio_config enable row level security;
alter table public.nav_links enable row level security;
alter table public.skills enable row level security;
alter table public.projects enable row level security;
alter table public.experience enable row level security;
alter table public.social_links enable row level security;
alter table public.contact_messages enable row level security;
alter table public.admin_users enable row level security;

-- =============================================================================
-- CREATE RLS POLICIES
-- =============================================================================

-- Portfolio Config Policies
create policy "Allow public read access on portfolio_config"
  on public.portfolio_config for select
  to anon, authenticated using (true);

create policy "Allow admin full access on portfolio_config"
  on public.portfolio_config for all
  to authenticated using (
    auth.email() in (select email from public.admin_users where is_active = true)
  );

-- Nav Links Policies
create policy "Allow public read access on nav_links"
  on public.nav_links for select
  to anon, authenticated using (is_active = true);

create policy "Allow admin full access on nav_links"
  on public.nav_links for all
  to authenticated using (
    auth.email() in (select email from public.admin_users where is_active = true)
  );

-- Skills Policies
create policy "Allow public read access on skills"
  on public.skills for select
  to anon, authenticated using (is_active = true);

create policy "Allow admin full access on skills"
  on public.skills for all
  to authenticated using (
    auth.email() in (select email from public.admin_users where is_active = true)
  );

-- Projects Policies
create policy "Allow public read access on projects"
  on public.projects for select
  to anon, authenticated using (is_active = true);

create policy "Allow admin full access on projects"
  on public.projects for all
  to authenticated using (
    auth.email() in (select email from public.admin_users where is_active = true)
  );

-- Experience Policies
create policy "Allow public read access on experience"
  on public.experience for select
  to anon, authenticated using (is_active = true);

create policy "Allow admin full access on experience"
  on public.experience for all
  to authenticated using (
    auth.email() in (select email from public.admin_users where is_active = true)
  );

-- Social Links Policies
create policy "Allow public read access on social_links"
  on public.social_links for select
  to anon, authenticated using (is_active = true);

create policy "Allow admin full access on social_links"
  on public.social_links for all
  to authenticated using (
    auth.email() in (select email from public.admin_users where is_active = true)
  );

-- Contact Messages Policies
create policy "Allow public insert on contact_messages"
  on public.contact_messages for insert
  to anon, authenticated with check (true);

create policy "Allow admin read access on contact_messages"
  on public.contact_messages for select
  to authenticated using (
    auth.email() in (select email from public.admin_users where is_active = true)
  );

create policy "Allow admin update on contact_messages"
  on public.contact_messages for update
  to authenticated using (
    auth.email() in (select email from public.admin_users where is_active = true)
  );

-- Admin Users Policies
create policy "Allow admin read access on admin_users"
  on public.admin_users for select
  to authenticated using (
    auth.email() in (select email from public.admin_users where is_active = true)
  );

create policy "Allow admin full access on admin_users"
  on public.admin_users for all
  to authenticated using (
    auth.email() in (select email from public.admin_users where is_active = true)
  );
