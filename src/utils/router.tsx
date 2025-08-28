import React, { useState, useEffect, useContext, type ReactNode } from "react";
import { RouterContext } from "../contexts/RouterContext";

// Route interface
export interface Route {
  path: string;
  component: React.ComponentType;
  title?: string;
  meta?: {
    description?: string;
    keywords?: string;
  };
}

// Router provider props
interface RouterProviderProps {
  children: ReactNode;
  routes: Route[];
}

// Router provider component
export const RouterProvider: React.FC<RouterProviderProps> = ({
  children,
  routes,
}) => {
  const [currentPath, setCurrentPath] = useState<string>(
    window.location.pathname
  );

  // Navigate function
  const navigate = (path: string, replace = false) => {
    if (replace) {
      window.history.replaceState({}, "", path);
    } else {
      window.history.pushState({}, "", path);
    }
    setCurrentPath(path);
  };

  // Back function
  const back = () => {
    window.history.back();
  };

  // Forward function
  const forward = () => {
    window.history.forward();
  };

  // Listen to browser navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Update document title and meta tags based on current route
  useEffect(() => {
    const currentRoute = routes.find((route) => route.path === currentPath);
    if (currentRoute?.title) {
      document.title = currentRoute.title;
    }

    if (currentRoute?.meta?.description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", currentRoute.meta.description);
      }
    }
  }, [currentPath, routes]);

  return (
    <RouterContext.Provider value={{ currentPath, navigate, back, forward }}>
      {children}
    </RouterContext.Provider>
  );
};

// Route matcher component
interface RouteProps {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
}

export const Route: React.FC<RouteProps> = ({
  path,
  component: Component,
  exact = true,
}) => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("Route must be used within a RouterProvider");
  }
  const { currentPath } = context;

  const isMatch = exact ? currentPath === path : currentPath.startsWith(path);

  return isMatch ? <Component /> : null;
};

// Link component
interface LinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  replace?: boolean;
  onClick?: () => void;
  title?: string;
}

export const Link: React.FC<LinkProps> = ({
  to,
  children,
  className,
  replace = false,
  onClick,
  title,
}) => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("Link must be used within a RouterProvider");
  }
  const { navigate } = context;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
    navigate(to, replace);
  };

  return (
    <a href={to} onClick={handleClick} className={className} title={title}>
      {children}
    </a>
  );
};

// Router outlet component
interface RouterOutletProps {
  routes: Route[];
  fallback?: React.ComponentType;
}

export const RouterOutlet: React.FC<RouterOutletProps> = ({
  routes,
  fallback: Fallback,
}) => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("RouterOutlet must be used within a RouterProvider");
  }
  const { currentPath } = context;

  const currentRoute = routes.find((route) => route.path === currentPath);

  if (currentRoute) {
    const Component = currentRoute.component;
    return <Component />;
  }

  if (Fallback) {
    return <Fallback />;
  }

  return <div>404 - Page not found</div>;
};
