import React, { type ReactNode } from "react";
import { useTheme } from "../hooks/useAppContext";
import { useRouter } from "../hooks/useRouter";
import { portfolioData } from "../data/portfolioData";
import { ThemeToggle } from "../components/ThemeToggle";
import { Link } from "../utils/router";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const { currentPath } = useRouter();

  // Enhanced navigation links with routing
  const enhancedNavLinks = [
    { href: "/", label: "01_HOME", path: "/" },
    { href: "/about", label: "02_ABOUT", path: "/about" },
    { href: "/projects", label: "03_PROJECTS", path: "/projects" },
    { href: "/contact", label: "04_CONTACT", path: "/contact" },
  ];

  return (
    <div className="antialiased">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent-color focus:text-accent-color-dark focus:rounded"
      >
        Skip to main content
      </a>

      {/* Desktop Navigation */}
      <nav className="main-nav" role="navigation" aria-label="Main navigation">
        <div className="nav-container">
          <Link to="/" className="nav-link nav-logo">
            ./{portfolioData.name.split(" ")[0].toUpperCase()}
          </Link>
          <div className="nav-links-desktop">
            {enhancedNavLinks.map((link) => (
              <Link
                key={link.href}
                to={link.path}
                className={`nav-link ${
                  currentPath === link.path ? "active" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="mobile-nav">
        <Link
          to="/"
          className={`mobile-nav-link ${currentPath === "/" ? "active" : ""}`}
          title="Home"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5"
            />
          </svg>
        </Link>
        <Link
          to="/about"
          className={`mobile-nav-link ${
            currentPath === "/about" ? "active" : ""
          }`}
          title="About"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        </Link>
        <Link
          to="/projects"
          className={`mobile-nav-link ${
            currentPath === "/projects" ? "active" : ""
          }`}
          title="Projects"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </Link>
        <Link
          to="/contact"
          className={`mobile-nav-link ${
            currentPath === "/contact" ? "active" : ""
          }`}
          title="Contact"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
        </Link>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>

      {/* Main Content */}
      <main id="main-content">{children}</main>

      {/* Footer */}
      <footer className="footer">
        <div className="copy-tooltip-wrapper">
          <p>
            &copy; {new Date().getFullYear()} {portfolioData.name}.
          </p>
        </div>
        <p className="mt-2">STATUS: ONLINE_AND_READY</p>
      </footer>
    </div>
  );
};
