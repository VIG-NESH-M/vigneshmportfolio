# Modern Portfolio with Routing & State Management

This example demonstrates the enhanced portfolio with:

- 🚀 Client-side routing
- 🔄 Centralized state management
- 🔔 Notification system
- 📱 Multi-page navigation
- 🎨 Theme persistence

## New Features

### 1. **Routing System**

```typescript
// Navigate programmatically
const { navigate } = useRouter();
navigate("/about");

// Link component
<Link to="/projects" className="nav-link">
  View Projects
</Link>;
```

### 2. **State Management**

```typescript
// Theme management
const { theme, toggleTheme } = useTheme();

// Notifications
const { addNotification } = useNotifications();
addNotification({
  type: "success",
  message: "Email copied!",
  duration: 3000,
});

// Navigation state
const { currentPage, setCurrentPage } = useNavigation();
```

### 3. **New Pages**

- **HomePage** (`/`) - Original portfolio content
- **AboutPage** (`/about`) - Detailed about section
- **ProjectsPage** (`/projects`) - Dedicated projects showcase
- **ContactPage** (`/contact`) - Interactive contact form

### 4. **Enhanced Components**

- **Layout** - Shared navigation and footer
- **NotificationSystem** - Toast notifications
- **ErrorBoundary** - Graceful error handling

## Usage Examples

### Adding a New Page

```typescript
// 1. Create the page component
export const BlogPage: React.FC = () => (
  <div className="terminal-window">{/* Page content */}</div>
);

// 2. Add to routes in App.tsx
const routes: Route[] = [
  // ... existing routes
  {
    path: "/blog",
    component: BlogPage,
    title: "Blog - Vignesh M",
    meta: {
      description: "Latest thoughts and tutorials",
    },
  },
];
```

### Using State Management

```typescript
// Custom hook example
export const useCustomFeature = () => {
  const { state, dispatch } = useAppContext();

  const customAction = (data: any) => {
    dispatch({ type: "CUSTOM_ACTION", payload: data });
  };

  return {
    customData: state.customData,
    customAction,
  };
};
```

### Adding Notifications

```typescript
const ContactForm = () => {
  const { addNotification } = useNotifications();

  const handleSubmit = async () => {
    try {
      await sendEmail();
      addNotification({
        type: "success",
        message: "Message sent successfully!",
      });
    } catch (error) {
      addNotification({
        type: "error",
        message: "Failed to send message",
      });
    }
  };
};
```

## File Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (AppContext)
├── hooks/              # Custom hooks
├── layout/             # Layout components
├── pages/              # Page components
├── utils/              # Utility functions (router, theme, clipboard)
├── data/               # Static data
└── types/              # TypeScript types
```

## State Structure

```typescript
interface AppState {
  theme: "dark" | "light"; // Current theme
  activeSection: SectionId; // Active navigation section
  isLoading: boolean; // Global loading state
  isMobileMenuOpen: boolean; // Mobile menu state
  copyTooltipVisible: boolean; // Copy feedback state
  currentPage: string; // Current route path
  notifications: Notification[]; // Active notifications
}
```

## Benefits

1. **Scalability** - Easy to add new pages and features
2. **Maintainability** - Centralized state management
3. **User Experience** - Smooth navigation without page reloads
4. **Developer Experience** - Type-safe routing and state
5. **Performance** - Code splitting and lazy loading ready
6. **Accessibility** - Proper ARIA labels and navigation
7. **SEO** - Dynamic meta tags and titles per route
