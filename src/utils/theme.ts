import { type Theme } from "../types/portfolioTypes";

/**
 * Applies the theme to the document
 * @param theme The theme to apply
 */
export const applyTheme = (theme: Theme): void => {
  if (typeof document !== "undefined") {
    // Remove existing theme classes then add the new one without clobbering others
    document.body.classList.remove("dark-theme", "light-theme");
    document.documentElement.classList.remove("dark-theme", "light-theme");
    document.body.classList.add(`${theme}-theme`);
    document.documentElement.classList.add(`${theme}-theme`);

    // Apply Tailwind dark mode class
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Do not mutate custom CSS; it contains rules for both themes
  }
};

const THEME_KEY = "portfolio-theme";

/**
 * Gets the saved theme from localStorage, or determines the system preference
 * @returns The theme to use (dark or light)
 */
export const getInitialTheme = (): Theme => {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return "dark";
  }

  // First, check localStorage for a saved preference
  const savedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
  if (savedTheme && (savedTheme === "dark" || savedTheme === "light")) {
    return savedTheme;
  }

  // If no saved preference, check system preference
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches
  ) {
    return "light";
  }

  // Default to dark theme
  return "dark";
};

/**
 * Saves the theme preference to localStorage
 * @param theme The theme to save
 */
export const saveTheme = (theme: Theme): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(THEME_KEY, theme);
  }
};

/**
 * Listens for system theme changes and returns a cleanup function
 * @param callback Function to call when system theme changes
 * @returns Cleanup function to remove the listener
 */
export const listenForSystemThemeChanges = (
  callback: (theme: Theme) => void
): (() => void) => {
  if (typeof window === "undefined" || !window.matchMedia) {
    return () => {}; // Return empty cleanup function for SSR
  }

  const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");

  const handleChange = (e: MediaQueryListEvent) => {
    // Only update if there's no saved preference
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (!savedTheme) {
      callback(e.matches ? "light" : "dark");
    }
  };

  // Use the newer addEventListener if available, fallback to addListener
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  } else {
    // Fallback for older browsers
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }
};
