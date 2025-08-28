# Supabase Portfolio Backend Setup Guide

This guide provides a complete Supabase backend setup for your React portfolio with authentication, Row Level Security (RLS), and ready-to-use TypeScript functions.

## 📋 Table of Contents

1. [Quick Setup](#quick-setup)
2. [Database Schema](#database-schema)
3. [Authentication Setup](#authentication-setup)
4. [Row Level Security](#row-level-security)
5. [Frontend Integration](#frontend-integration)
6. [Usage Examples](#usage-examples)
7. [Deployment](#deployment)

## 🚀 Quick Setup

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Sign in and create a new project
3. Wait for the project to be provisioned

### 2. Install Dependencies

```bash
npm install @supabase/supabase-js
npm install --save-dev @types/node
```

### 3. Set Environment Variables

1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase project details:

```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
REACT_APP_ADMIN_EMAIL=vignezhm@gmail.com
```

### 4. Run Database Migrations

In your Supabase Dashboard:

1. Go to **SQL Editor**
2. Run the migrations in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_sample_data.sql`

### 5. Create Admin User

1. Go to **Authentication** > **Users** in Supabase Dashboard
2. Click **Add User**
3. Enter your email (`vignezhm@gmail.com`) and password
4. Confirm the user email

## 🗄️ Database Schema

### Tables Created

| Table              | Purpose                  | Public Read | Admin Write |
| ------------------ | ------------------------ | ----------- | ----------- |
| `portfolio_config` | Main portfolio info      | ✅          | ✅          |
| `nav_links`        | Navigation menu items    | ✅          | ✅          |
| `skills`           | Technical skills         | ✅          | ✅          |
| `projects`         | Portfolio projects       | ✅          | ✅          |
| `experience`       | Work experience          | ✅          | ✅          |
| `social_links`     | Social media links       | ✅          | ✅          |
| `contact_messages` | Contact form submissions | Insert only | ✅          |
| `admin_users`      | Admin user registry      | Admin only  | Admin only  |

### Key Features

- **UUID Primary Keys**: All tables use UUID for better security
- **Timestamps**: Automatic `created_at` and `updated_at` tracking
- **Soft Deletes**: Uses `is_active` flags instead of hard deletes
- **Sorting**: `sort_order` fields for custom ordering
- **Flexible Tags**: Array fields for project tags

## 🔐 Authentication Setup

### Admin User Management

- Only users listed in `admin_users` table can perform write operations
- Admin verification happens automatically in RLS policies
- Regular users can only read public data and submit contact forms

### Auth Flow

```typescript
// Sign in as admin
const { user, session } = await signInAdmin("admin@email.com", "password");

// Check if current user is admin
const isAdmin = await isCurrentUserAdmin();

// Sign out
await signOut();
```

## 🛡️ Row Level Security

### Public Access (Everyone)

- **SELECT** on all content tables
- **INSERT** on `contact_messages`

### Admin Access (Authenticated admins only)

- **Full CRUD** on all tables
- **READ** access to `contact_messages`

### RLS Policy Examples

```sql
-- Public read access
create policy "Allow public read access on projects"
  on public.projects for select
  to anon, authenticated using (is_active = true);

-- Admin write access
create policy "Allow admin full access on projects"
  on public.projects for all
  to authenticated using (
    auth.email() in (select email from public.admin_users where is_active = true)
  );
```

## 🔗 Frontend Integration

### Basic Setup

```typescript
import { supabase } from "./lib/supabase";

// Fetch public data
const projects = await getProjects();
const skills = await getSkills();

// Admin operations (requires authentication)
const newProject = await createProject({
  title: "My New Project",
  description: "Project description",
  tags: ["React", "TypeScript"],
  link: "https://github.com/user/project",
  sort_order: 1,
  is_featured: true,
  is_active: true,
});
```

### Real-time Updates

```typescript
// Subscribe to project changes
const unsubscribe = subscribeToProjects((updatedProjects) => {
  setProjects(updatedProjects);
});

// Clean up subscription
return unsubscribe;
```

## 📚 Usage Examples

### 1. Public Data Fetching

```typescript
// Get all active projects
const projects = await getProjects();

// Get only featured projects
const featured = await getFeaturedProjects();

// Get portfolio configuration
const config = await getPortfolioConfig();
```

### 2. Admin Authentication

```typescript
// Admin login
try {
  await signInAdmin("admin@email.com", "password");
  console.log("Admin authenticated successfully");
} catch (error) {
  console.error("Authentication failed:", error.message);
}
```

### 3. Content Management

```typescript
// Create new project (admin only)
const project = await createProject({
  title: "E-Commerce Platform",
  description: "Full-stack shopping solution",
  tags: ["React", "Node.js", "PostgreSQL"],
  link: "https://github.com/user/ecommerce",
  sort_order: 1,
  is_featured: true,
  is_active: true,
});

// Update existing project
await updateProject(projectId, {
  title: "Updated Project Title",
  is_featured: false,
});

// Delete project
await deleteProject(projectId);
```

### 4. Contact Form Handling

```typescript
// Submit contact message (public)
const success = await submitContactMessage(
  "John Doe",
  "john@example.com",
  "Project Inquiry",
  "I would like to discuss a project..."
);

// Get contact messages (admin only)
const messages = await getContactMessages();
```

## 🚀 Deployment

### Environment Variables

Make sure to set these in your production environment:

```env
REACT_APP_SUPABASE_URL=your-production-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-production-anon-key
REACT_APP_ADMIN_EMAIL=your-admin-email
```

### Security Checklist

- ✅ RLS enabled on all tables
- ✅ Admin users verified via `admin_users` table
- ✅ Anon key used (safe for frontend)
- ✅ No service key exposed to frontend
- ✅ Contact form rate limiting (handled by Supabase)

### Production Considerations

1. **Rate Limiting**: Supabase provides built-in rate limiting
2. **Backups**: Automatic backups are included in Supabase Pro
3. **Monitoring**: Use Supabase Dashboard for monitoring
4. **Scaling**: Supabase handles scaling automatically

## 🔧 Troubleshooting

### Common Issues

1. **"User is not authorized as admin"**

   - Ensure user email exists in `admin_users` table
   - Check user is confirmed in Supabase Auth

2. **RLS Policy Violations**

   - Verify user is authenticated for admin operations
   - Check policy conditions match your use case

3. **Environment Variables Not Loading**
   - Ensure `.env.local` exists and is properly formatted
   - Restart development server after changing env vars

### Debug Queries

```sql
-- Check if user is in admin_users table
SELECT * FROM public.admin_users WHERE email = 'your-email@example.com';

-- View RLS policies
SELECT schemaname, tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';

-- Check table permissions
SELECT table_name, privilege_type
FROM information_schema.role_table_grants
WHERE grantee = 'anon';
```

## 📝 Next Steps

1. **Customize the schema** to match your specific needs
2. **Add file upload** functionality for project images
3. **Implement email notifications** for contact form submissions
4. **Add analytics tracking** for portfolio views
5. **Create admin dashboard** for easier content management

## 🔧 Admin Dashboard Access

You have **two ways** to access your admin dashboard:

### Option 1: Built-in Admin Button (Recommended)

- A small "Admin" button appears in the bottom-right corner of your portfolio
- Click it to access the admin dashboard
- Navigate to `/admin` in your browser URL

### Option 2: Direct URL Access

- Go directly to `http://localhost:5173/admin` (development)
- Or `https://yoursite.com/admin` (production)

### Admin Dashboard Features

- **Admin Authentication**: Secure login with email/password
- **Project Management**: Create, update, delete, and feature projects
- **Contact Messages**: View and manage contact form submissions
- **Real-time Updates**: See changes instantly with live data sync
- **Content Management**: Edit all portfolio data from one place

### Default Admin Credentials

After setting up your Supabase project and running the migrations:

- **Email**: `vignezhm@gmail.com` (or your configured admin email)
- **Password**: Set this when creating the user in Supabase Auth dashboard

---

## 🤝 Support

For issues with this setup:

1. Check the Supabase documentation
2. Review the error messages in browser console
3. Verify RLS policies in Supabase Dashboard
4. Test with the provided example component

Happy building! 🚀
