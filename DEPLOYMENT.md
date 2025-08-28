# 🚀 Deployment Guide

This guide covers multiple deployment options for your portfolio, from free hosting to custom domains.

## 📋 Table of Contents

- [Quick Deploy](#-quick-deploy)
- [GitHub Pages](#-github-pages-recommended)
- [Vercel](#-vercel)
- [Netlify](#-netlify)
- [Custom Domain Setup](#-custom-domain-setup)
- [Environment Configuration](#-environment-configuration)
- [Troubleshooting](#-troubleshooting)

## ⚡ Quick Deploy

### Prerequisites

- GitHub account
- Node.js 18+ installed
- Supabase project set up

### 1-Minute Deploy to GitHub Pages

```bash
# 1. Clone and setup
git clone https://github.com/VIG-NESH-M/vigneshmportfolio.git
cd vigneshmportfolio
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials

# 3. Push to your GitHub repository
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main

# 4. Enable GitHub Pages in repository settings
```

Your portfolio will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

## 🐙 GitHub Pages (Recommended)

### Automatic Deployment

This project includes a pre-configured GitHub Actions workflow for automatic deployment.

#### Setup Steps

1. **Fork or clone the repository**

   ```bash
   git clone https://github.com/VIG-NESH-M/vigneshmportfolio.git
   cd vigneshmportfolio
   ```

2. **Push to your GitHub repository**

   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under "Source", select **GitHub Actions**
   - The deployment will start automatically

#### Workflow Configuration

The included `.github/workflows/deploy.yml` file handles:

- ✅ Node.js 18 setup with npm caching
- ✅ Dependency installation with `npm ci`
- ✅ Production build with `npm run build`
- ✅ Artifact upload and GitHub Pages deployment
- ✅ Automatic deployment on every push to `main`

#### Manual Trigger

You can also trigger deployment manually:

- Go to **Actions** tab in your repository
- Select "Deploy to GitHub Pages" workflow
- Click "Run workflow"

### Custom Base Path

For GitHub Pages, the project is configured with the correct base path:

```typescript
// vite.config.ts
export default defineConfig({
  base: "/vigneshmportfolio/", // Matches repository name
});
```

Update this if your repository has a different name.

## ▲ Vercel

### Automatic Deployment

1. **Connect GitHub to Vercel**

   - Visit [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"

2. **Import Repository**

   - Select your portfolio repository
   - Vercel auto-detects Vite configuration
   - Click "Deploy"

3. **Environment Variables**
   ```bash
   # Add in Vercel dashboard under Settings → Environment Variables
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Follow prompts to configure project
```

### Custom Domain on Vercel

1. **Add Domain**

   - Go to project dashboard
   - Navigate to **Settings** → **Domains**
   - Add your custom domain

2. **DNS Configuration**

   ```bash
   # Add CNAME record pointing to vercel-dns.com
   CNAME www vercel-dns.com

   # For apex domain, add A record
   A @ 76.76.19.61
   ```

## 🌐 Netlify

### Drag and Drop Deployment

1. **Build the project**

   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Visit [netlify.com](https://netlify.com)
   - Drag and drop the `dist/` folder

### Git-based Deployment

1. **Connect Repository**

   - Login to Netlify with GitHub
   - Click "New site from Git"
   - Select your repository

2. **Build Settings**

   ```bash
   # Build command
   npm run build

   # Publish directory
   dist
   ```

3. **Environment Variables**
   ```bash
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Netlify CLI Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

## 🌍 Custom Domain Setup

### DNS Configuration

For any hosting provider, configure your DNS:

```bash
# For www subdomain (CNAME)
www.yourdomain.com → your-hosting-provider.com

# For apex domain (A record)
yourdomain.com → hosting_provider_ip

# For both (recommended)
@ → hosting_provider_ip
www → yourdomain.com
```

### SSL Certificate

Most modern hosting providers (Vercel, Netlify, GitHub Pages) provide automatic SSL certificates:

- ✅ **GitHub Pages**: Automatic HTTPS for custom domains
- ✅ **Vercel**: Automatic SSL with Let's Encrypt
- ✅ **Netlify**: Free SSL certificates included

## ⚙️ Environment Configuration

### Production Environment Variables

```env
# Production Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key

# Optional: Analytics
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_HOTJAR_ID=1234567

# Optional: Custom Domain
VITE_CUSTOM_DOMAIN=https://yourdomain.com
```

### Build Optimization

The project includes production optimizations:

```typescript
// vite.config.ts optimizations
export default defineConfig({
  build: {
    minify: "esbuild",
    target: "es2015",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          supabase: ["@supabase/supabase-js"],
        },
      },
    },
  },
});
```

## 🔧 Troubleshooting

### Common Issues

#### ❌ Build Failures

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 18+

# Run build locally
npm run build
```

#### ❌ Environment Variables Not Loading

```bash
# Check variable names start with VITE_
VITE_SUPABASE_URL=... ✅
SUPABASE_URL=...      ❌

# Verify environment in hosting dashboard
# Redeploy after adding variables
```

#### ❌ Routing Issues (404 on Refresh)

For Single Page Applications, configure your hosting:

**Vercel**: Create `vercel.json`

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Netlify**: Create `_redirects` in `public/`

```
/*    /index.html   200
```

**GitHub Pages**: Uses hash routing automatically

#### ❌ Supabase Connection Issues

```bash
# Verify Supabase project is active
# Check RLS policies are configured
# Ensure CORS settings allow your domain
```

#### ❌ Custom Domain Not Working

```bash
# Check DNS propagation
dig yourdomain.com

# Verify SSL certificate
curl -I https://yourdomain.com

# Check hosting provider domain settings
```

### Performance Optimization

```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist

# Optimize images
# Use WebP format for better compression
# Implement lazy loading for images

# Enable compression
# Most hosting providers enable gzip/brotli automatically
```

### Monitoring and Analytics

#### Google Analytics Setup

```typescript
// Add to index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

#### Vercel Analytics

```bash
npm install @vercel/analytics
```

```typescript
// Add to main.tsx
import { Analytics } from '@vercel/analytics/react';

<App />
<Analytics />
```

## 🎯 Production Checklist

- [ ] ✅ Environment variables configured
- [ ] ✅ Supabase database populated with content
- [ ] ✅ Custom domain configured (if applicable)
- [ ] ✅ SSL certificate active
- [ ] ✅ Analytics tracking implemented
- [ ] ✅ SEO metadata updated
- [ ] ✅ Social media links verified
- [ ] ✅ Contact form tested
- [ ] ✅ Admin panel access confirmed
- [ ] ✅ Mobile responsiveness verified
- [ ] ✅ Performance testing completed

## 📈 Post-Deployment

### SEO Optimization

- Submit sitemap to Google Search Console
- Verify Google My Business listing
- Add portfolio to professional directories
- Create social media profiles linking to portfolio

### Monitoring

- Set up uptime monitoring (UptimeRobot, Pingdom)
- Configure error tracking (Sentry, LogRocket)
- Monitor Core Web Vitals (PageSpeed Insights)
- Track user analytics and engagement

### Maintenance

- Regular dependency updates
- Content updates through admin panel
- Backup Supabase database regularly
- Monitor hosting provider status pages

---

🎉 **Congratulations!** Your portfolio is now live and ready to showcase your work to the world!
