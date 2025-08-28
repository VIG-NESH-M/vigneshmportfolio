# Vignesh M Portfolio

## Admin Dashboard

- Access from the floating "Admin" button in the bottom-right when running the app
- Tabs included: Dashboard, Config, Nav, Experience, Socials, Projects, Skills, Messages
- All sections support full CRUD with sorting and active flags

## Environment variables

Create a `.env` file (or `.env.local` for local dev) with:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase setup

- See `SUPABASE_SETUP.md` and scripts `setup-supabase.sh`, `setup-admin.sh` for provisioning and creating an admin user.

## Production build

```
npm run build
```

Outputs to `dist/`.
