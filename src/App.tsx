import Portfolio from "./Portfolio";
import { AdminShell } from "./pages/AdminShell";
import { RouterProvider, RouterOutlet, Link, type Route } from "./utils/router";
import { useContext } from "react";
import { RouterContext } from "./contexts/RouterContext";
import { useThemeColors } from "./hooks/useThemeColors";

// Define routes
const routes: Route[] = [
  {
    path: "/",
    component: Portfolio,
    title: "Vignesh M - Portfolio",
    meta: {
      description:
        "Full-stack developer portfolio showcasing projects and skills",
    },
  },
  {
    path: "/admin",
    component: AdminShell,
    title: "Admin Dashboard",
    meta: {
      description: "Admin dashboard for portfolio management",
    },
  },
];

// 404 Component
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        404
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Page not found</p>
      <Link
        to="/"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Go Home
      </Link>
    </div>
  </div>
);

// Separate component for admin access button
const AdminAccessButton = () => {
  const router = useContext(RouterContext);
  const currentPath = router?.currentPath || "/";

  // Only show admin button on home page
  if (currentPath !== "/") return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Link
        to="/admin"
        className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors shadow-lg text-sm"
        title="Access Admin Dashboard"
      >
        Admin
      </Link>
    </div>
  );
};

function App() {
  // Load and apply custom colors on app start
  useThemeColors();

  return (
    <RouterProvider routes={routes}>
      <div>
        <AdminAccessButton />
        <RouterOutlet routes={routes} fallback={NotFound} />
      </div>
    </RouterProvider>
  );
}

export default App;
