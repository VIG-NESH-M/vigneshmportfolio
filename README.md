# 🚀 Vignesh M Portfolio

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=for-the-badge)](https://vigneshm.gt.tc)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/VIG-NESH-M/vigneshmportfolio)
[![Deploy](https://img.shields.io/badge/Deploy-Automatic-green?style=for-the-badge)](https://github.com/VIG-NESH-M/vigneshmportfolio/actions)

> A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS, featuring a comprehensive admin panel for dynamic content management.

## ✨ Features

### 🎨 Frontend
- **Modern React 19** with TypeScript for type safety
- **Tailwind CSS 4** for responsive, utility-first styling
- **Lucide React Icons** for consistent iconography
- **Mobile-first responsive design** optimized for all devices
- **Smooth animations** and hover effects
- **Dark/Light theme support** with system preference detection

### 🛠️ Admin Panel
- **Comprehensive Dashboard** with real-time analytics
- **Dynamic Content Management** for all portfolio sections
- **CRUD Operations** for projects, skills, experience, and social links
- **Contact Message Management** with status tracking
- **Configuration Manager** for hero section and site settings
- **Route-based Navigation** with secure admin access
- **Real-time Updates** with Supabase integration

### 📱 Responsive Sections
- **Hero Section** with animated call-to-action
- **About Page** with professional summary
- **Projects Gallery** with filtering and detailed views
- **Skills Section** with proficiency indicators
- **Contact Form** with direct admin integration
- **Experience Timeline** with company details

### ⚡ Performance
- **Vite** for lightning-fast development and builds
- **Code Splitting** for optimal loading times
- **ESLint** with strict TypeScript rules
- **Automatic Deployment** via GitHub Actions

## 🏗️ Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Frontend** | React | 19.1.0 |
| **Language** | TypeScript | 5.8.3 |
| **Styling** | Tailwind CSS | 4.1.11 |
| **Icons** | Lucide React | 0.536.0 |
| **Backend** | Supabase | 2.56.0 |
| **Build Tool** | Vite | 7.0.4 |
| **Linting** | ESLint | 9.30.1 |
| **Deployment** | GitHub Pages | - |

## 🚦 Getting Started

### Prerequisites

- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- **Supabase Account** (for backend functionality)

### 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/VIG-NESH-M/vigneshmportfolio.git
   cd vigneshmportfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🗄️ Database Setup

### Supabase Configuration

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)

2. **Run the setup scripts**
   ```bash
   # Set up database tables and policies
   chmod +x setup-supabase.sh
   ./setup-supabase.sh

   # Create admin user
   chmod +x setup-admin.sh
   ./setup-admin.sh
   ```

3. **Required Tables**
   - `hero_stats` - Hero section statistics
   - `nav_items` - Navigation menu items
   - `experiences` - Work experience data
   - `social_links` - Social media links
   - `projects` - Portfolio projects
   - `skills` - Technical skills with proficiency
   - `contact_messages` - Contact form submissions

### Database Schema

```sql
-- Hero Stats
CREATE TABLE hero_stats (
  id SERIAL PRIMARY KEY,
  label VARCHAR(50) NOT NULL,
  value VARCHAR(20) NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  tech_stack TEXT[],
  github_url VARCHAR(255),
  live_url VARCHAR(255),
  image_url VARCHAR(255),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Skills
CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  category VARCHAR(50),
  proficiency INTEGER CHECK (proficiency >= 0 AND proficiency <= 100),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Contact Messages
CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(200),
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🎛️ Admin Panel

### Accessing Admin Panel

1. **Development**: Click the floating "Admin" button in the bottom-right corner
2. **Production**: Navigate to `/admin` route (protected)

### Admin Features

#### 📊 Dashboard
- Overview of all content sections
- Quick stats and recent activity
- System health indicators

#### ⚙️ Configuration Manager
- Hero section content and statistics
- Site metadata and SEO settings
- Theme and appearance options

#### 🧭 Navigation Manager
- Add/edit navigation menu items
- Reorder menu items with drag-and-drop
- Toggle menu item visibility

#### 💼 Experience Manager
- Add/edit work experience entries
- Company details and role descriptions
- Date ranges and achievement highlights

#### 🔗 Social Links Manager
- Manage social media profiles
- Custom icons and platform links
- Visibility controls

#### 🚀 Projects Manager
- Add/edit portfolio projects
- Tech stack management
- GitHub and live demo links
- Project screenshots and descriptions

#### 🛠️ Skills Manager
- Technical skills with proficiency levels
- Skill categories and grouping
- Visual proficiency indicators

#### 📨 Messages Manager
- View contact form submissions
- Message status tracking (unread/read/replied)
- Direct email integration

## 🚀 Deployment

### Automatic Deployment (Recommended)

The project includes GitHub Actions for automatic deployment to GitHub Pages:

1. **Push to main branch** - triggers automatic deployment
2. **Monitor deployment** in the Actions tab
3. **Live site** available at: `https://vig-nesh-m.github.io/vigneshmportfolio/`

### Manual Deployment

#### GitHub Pages
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

#### Vercel
```bash
npm i -g vercel
vercel --prod
```

#### Netlify
```bash
npm run build
# Drag and drop dist/ folder to Netlify dashboard
```

## 📁 Project Structure

```
vigneshmportfolio/
├── 📁 public/                 # Static assets
│   ├── favicon.svg
│   ├── manifest.json
│   └── robots.txt
├── 📁 src/
│   ├── 📁 components/         # Reusable UI components
│   │   ├── ErrorBoundary.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Navbar.tsx
│   │   ├── NotificationSystem.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── SkillBar.tsx
│   │   ├── SocialLink.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── 📁 icons/
│   │       └── SocialIcons.tsx
│   ├── 📁 contexts/           # React Context providers
│   │   ├── AppContext.tsx
│   │   ├── AppContextDefinition.tsx
│   │   └── RouterContext.tsx
│   ├── 📁 data/              # Static data and configurations
│   │   └── portfolioData.ts
│   ├── 📁 hooks/             # Custom React hooks
│   │   ├── useAppContext.ts
│   │   └── useRouter.ts
│   ├── 📁 layout/            # Layout components
│   │   └── Layout.tsx
│   ├── 📁 pages/             # Page components
│   │   ├── AboutPage.tsx
│   │   ├── ContactPage.tsx
│   │   ├── HomePage.tsx
│   │   └── ProjectsPage.tsx
│   ├── 📁 types/             # TypeScript type definitions
│   │   ├── domain.ts
│   │   └── portfolioTypes.ts
│   ├── 📁 utils/             # Utility functions
│   │   ├── clipboard.ts
│   │   ├── router.tsx
│   │   └── theme.ts
│   ├── App.tsx               # Main application component
│   ├── Portfolio.tsx         # Portfolio container
│   ├── index.css            # Global styles
│   ├── main.tsx             # Application entry point
│   └── vite-env.d.ts        # Vite type definitions
├── 📁 .github/
│   └── 📁 workflows/
│       └── deploy.yml        # GitHub Actions deployment
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore rules
├── eslint.config.js        # ESLint configuration
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── README.md               # This file
├── setup-admin.sh          # Admin user setup script
├── setup-supabase.sh       # Database setup script
├── SUPABASE_SETUP.md       # Detailed Supabase guide
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## 🧪 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 5173 |
| `npm run build` | Build production bundle to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | ✅ |

### Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/vigneshmportfolio/', // GitHub Pages base path
});
```

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Custom theme extensions
    },
  },
  plugins: [],
};
```

## 🐛 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Supabase Connection Issues
1. Verify environment variables are correct
2. Check Supabase project status
3. Ensure RLS policies are properly configured

#### Deployment Issues
1. Check GitHub Actions logs
2. Verify `base` path in `vite.config.ts`
3. Ensure GitHub Pages is enabled in repository settings

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

**Vignesh M**
- Portfolio: [https://vig-nesh-m.github.io/vigneshmportfolio/](https://vig-nesh-m.github.io/vigneshmportfolio/)
- GitHub: [@VIG-NESH-M](https://github.com/VIG-NESH-M)
- LinkedIn: [LinkedIn Profile](https://linkedin.com/in/vignezhm)

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI Library
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Lucide](https://lucide.dev/) - Icon Library
- [Vite](https://vitejs.dev/) - Build Tool
- [GitHub Pages](https://pages.github.com/) - Hosting Platform

---

<div align="center">
  <p>Built with ❤️ by Vignesh M</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
