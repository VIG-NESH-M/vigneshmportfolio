import React, { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { type Theme, type NavLink } from "../types/portfolioTypes";

interface NavbarProps {
  name: string;
  navLinks: NavLink[];
  activeSection: string;
  theme: Theme;
  onSectionNavigation: (sectionId: string) => void;
  onEasterEgg: () => void;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  name,
  navLinks,
  activeSection,
  theme,
  onSectionNavigation,
  onEasterEgg,
  onToggleTheme,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Floating Desktop Navigation */}
      <nav
        className={`floating-nav ${isScrolled ? "scrolled" : ""}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="floating-nav-container">
          {/* Logo */}
          <a
            href="#home"
            className="floating-nav-logo"
            onClick={onEasterEgg}
            title="Click me for a surprise!"
          >
            <span className="logo-dot"></span>
            <span className="logo-text">
              {name.split(" ")[0].toUpperCase()}
            </span>
          </a>

          {/* Center Navigation Links */}
          <div className="floating-nav-links">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => onSectionNavigation(link.href.slice(1))}
                className={`floating-nav-link ${
                  activeSection === link.href.slice(1) ? "active" : ""
                }`}
                data-text={link.label}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Theme Toggle */}
          <div className="floating-theme-toggle">
            <ThemeToggle theme={theme} toggleTheme={onToggleTheme} />
          </div>
        </div>
      </nav>

      {/* Floating Mobile Navigation */}
      <div className="floating-mobile-nav">
        <div className="floating-mobile-container">
          <NavButton
            href="#home"
            section="home"
            activeSection={activeSection}
            onSectionNavigation={onSectionNavigation}
            title="Home"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5"
                />
              </svg>
            }
          />

          <NavButton
            href="#about"
            section="about"
            activeSection={activeSection}
            onSectionNavigation={onSectionNavigation}
            title="About"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            }
          />

          <NavButton
            href="#work"
            section="work"
            activeSection={activeSection}
            onSectionNavigation={onSectionNavigation}
            title="Work"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            }
          />

          <NavButton
            href="#socials"
            section="socials"
            activeSection={activeSection}
            onSectionNavigation={onSectionNavigation}
            title="Socials"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.935-2.186 2.25 2.25 0 00-3.935 2.186z"
                />
              </svg>
            }
          />

          <NavButton
            href="#contact"
            section="contact"
            activeSection={activeSection}
            onSectionNavigation={onSectionNavigation}
            title="Contact"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            }
          />

          <div className="floating-mobile-theme">
            <ThemeToggle theme={theme} toggleTheme={onToggleTheme} />
          </div>
        </div>
      </div>
    </>
  );
};

// Floating Mobile Navigation Button Component
interface NavButtonProps {
  href: string;
  section: string;
  activeSection: string;
  onSectionNavigation: (sectionId: string) => void;
  title: string;
  icon: React.ReactNode;
}

const NavButton: React.FC<NavButtonProps> = ({
  href,
  section,
  activeSection,
  onSectionNavigation,
  title,
  icon,
}) => (
  <a
    href={href}
    onClick={() => onSectionNavigation(section)}
    className={`floating-mobile-nav-btn ${
      activeSection === section ? "active" : ""
    }`}
    title={title}
    aria-label={title}
  >
    <div className="mobile-nav-icon">{icon}</div>
    <div className="mobile-nav-ripple"></div>
  </a>
);
