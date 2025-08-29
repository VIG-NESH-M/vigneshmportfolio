# 🤝 Contributing to Vignesh M Portfolio

Thank you for your interest in contributing to this portfolio project! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [Development Setup](#-development-setup)
- [Contributing Guidelines](#-contributing-guidelines)
- [Pull Request Process](#-pull-request-process)
- [Coding Standards](#-coding-standards)
- [Testing](#-testing)
- [Documentation](#-documentation)
- [Community](#-community)

## 📜 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Git** for version control
- **Supabase account** for backend services
- **Code editor** (VS Code recommended)

### First Time Setup

1. **Fork the repository**

   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/vigneshmportfolio.git
   cd vigneshmportfolio
   ```

2. **Add upstream remote**

   ```bash
   git remote add upstream https://github.com/VIG-NESH-M/vigneshmportfolio.git
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Set up environment**

   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🛠️ Development Setup

### Project Structure

```
src/
├── components/         # Reusable UI components
├── contexts/          # React Context providers
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── data/              # Static data and configurations
```

### Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
npm run type-check  # Run TypeScript checks
```

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_EMAIL=your_email@gmail.com
```

## 📝 Contributing Guidelines

### Types of Contributions

We welcome various types of contributions:

- 🐛 **Bug fixes**
- ✨ **New features**
- 📚 **Documentation improvements**
- 🎨 **UI/UX enhancements**
- ⚡ **Performance optimizations**
- 🧪 **Tests**
- 🔒 **Security improvements**

### Before You Start

1. **Check existing issues** to avoid duplicating work
2. **Create an issue** for new features or major changes
3. **Discuss your approach** before implementing large changes
4. **Keep changes focused** - one feature/fix per PR

### Branch Naming Convention

```bash
# Feature branches
feature/add-blog-system
feature/improve-mobile-nav

# Bug fix branches
fix/contact-form-validation
fix/hero-section-overflow

# Documentation branches
docs/update-readme
docs/add-api-docs

# Hotfix branches
hotfix/security-patch
hotfix/critical-bug
```

## 🔄 Pull Request Process

### 1. Create a Branch

```bash
git checkout main
git pull upstream main
git checkout -b feature/your-feature-name
```

### 2. Make Changes

- Write clean, well-documented code
- Follow existing code style and conventions
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
npm run lint          # Check code style
npm run type-check    # Verify TypeScript
npm run build         # Test production build
npm run test          # Run tests (if available)
```

### 4. Commit Your Changes

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git add .
git commit -m "feat: add dark mode toggle to navigation"
git commit -m "fix: resolve mobile menu overflow issue"
git commit -m "docs: update deployment guide for Vercel"
```

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub using our [PR template](.github/pull_request_template.md).

### 6. Code Review Process

- All PRs require review before merging
- Address feedback and requested changes
- Keep your branch up to date with main
- Be responsive to reviewer comments

## 🎨 Coding Standards

### TypeScript

```typescript
// Use explicit types
interface UserProps {
  name: string;
  email: string;
  isActive: boolean;
}

// Use const assertions for readonly data
const NAVIGATION_ITEMS = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
] as const;

// Use proper error handling
try {
  await apiCall();
} catch (error) {
  console.error("API call failed:", error);
  throw new Error("Failed to fetch data");
}
```

### React Components

```tsx
// Use functional components with TypeScript
interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  onClick,
}) => {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick} type="button">
      {children}
    </button>
  );
};
```

### CSS/Tailwind

```tsx
// Use Tailwind classes consistently
<div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900">
  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
    Portfolio
  </h1>
</div>

// Use responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Content */}
</div>
```

### File Organization

```
components/
├── ui/              # Basic UI components (Button, Input, etc.)
├── forms/           # Form-specific components
├── layout/          # Layout components (Header, Footer, etc.)
└── features/        # Feature-specific components
```

## 🧪 Testing

### Testing Guidelines

- Write tests for new features and bug fixes
- Test both happy path and error cases
- Include accessibility tests where applicable
- Test responsive design on multiple devices

### Manual Testing

1. **Functionality Testing**

   - Test all new features thoroughly
   - Verify existing functionality still works
   - Test error handling and edge cases

2. **Browser Testing**

   - Chrome, Firefox, Safari, Edge
   - Mobile browsers (iOS Safari, Chrome Mobile)

3. **Device Testing**

   - Desktop (various screen sizes)
   - Tablet (iPad, Android tablets)
   - Mobile (iPhone, Android phones)

4. **Accessibility Testing**
   - Keyboard navigation
   - Screen reader compatibility
   - Color contrast ratios
   - Focus management

## 📚 Documentation

### Documentation Standards

- Update README.md for new features
- Add code comments for complex logic
- Update CHANGELOG.md for all changes
- Include JSDoc comments for functions

### Documentation Examples

```typescript
/**
 * Fetches user data from the API
 * @param userId - The unique identifier for the user
 * @param options - Optional configuration for the request
 * @returns Promise that resolves to user data
 * @throws {Error} When the user is not found or API fails
 */
async function fetchUser(
  userId: string,
  options?: RequestOptions
): Promise<User> {
  // Implementation
}
```

## 🤔 Need Help?

### Getting Support

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Documentation**: Check README.md and other docs first
- **Code Review**: Request review in your PR

### Useful Resources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)

## 🎉 Recognition

Contributors will be:

- Added to the contributors list in README.md
- Mentioned in release notes for significant contributions
- Credited in the CHANGELOG.md

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the [MIT License](LICENSE).

## 🚀 Development Workflow

### Typical Contribution Flow

1. **Find or create an issue**
2. **Discuss approach** (for larger changes)
3. **Fork and clone** the repository
4. **Create a feature branch**
5. **Implement changes** with tests
6. **Update documentation**
7. **Submit pull request**
8. **Address review feedback**
9. **Merge and celebrate!** 🎉

### Commit Message Format

```
type(scope): brief description

Longer description if needed

Fixes #123
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## 🌟 Thank You

Thank you for contributing to this portfolio project! Every contribution, no matter how small, helps make this project better for everyone.

---

**Questions?** Feel free to [open an issue](https://github.com/VIG-NESH-M/vigneshmportfolio/issues) or start a [discussion](https://github.com/VIG-NESH-M/vigneshmportfolio/discussions).
