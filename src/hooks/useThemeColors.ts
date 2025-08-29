import { useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

interface ColorScheme {
  primary: string;
  primaryRgb: string;
  secondary: string;
  secondaryRgb: string;
  background: string;
  backgroundLight: string;
  text: string;
  textLight: string;
  textDark: string;
  cardBg: string;
  cardBgLight: string;
  borderColor: string;
  borderColorLight: string;
  terminalBg: string;
  headerBg: string;
  navBg: string;
  navBgLight: string;
  heroText: string;
}

export const useThemeColors = () => {
  // Apply colors to CSS variables
  const applyColors = useCallback((colorScheme: ColorScheme) => {
    console.log("🎨 Applying colors to CSS variables:", colorScheme);

    // Create or update a style element with custom CSS variables
    let customThemeStyle = document.getElementById("custom-theme-colors");
    if (!customThemeStyle) {
      customThemeStyle = document.createElement("style");
      customThemeStyle.id = "custom-theme-colors";
      document.head.appendChild(customThemeStyle);
    }

    // Helper to compute RGB from hex for card bg (fallback safe)
    const toRgb = (hex: string): string => {
      const m = hex.replace("#", "").match(/.{2}/g);
      if (!m) return "17, 17, 17";
      const [r, g, b] = m.map((h) => parseInt(h, 16));
      return `${r}, ${g}, ${b}`;
    };

    // Generate CSS for both themes so switching works instantly
    const darkCSS = `
      .dark-theme {
        --background-color: ${colorScheme.background} !important;
        --text-color: ${colorScheme.text} !important;
        --text-color-light: ${colorScheme.textLight} !important;
        --accent-color: ${colorScheme.primary} !important;
        --accent-color-rgb: ${colorScheme.primaryRgb} !important;
        --color-accent: ${colorScheme.primary} !important;
        --color-secondary: ${colorScheme.secondary} !important;
        --color-secondary-rgb: ${colorScheme.secondaryRgb} !important;
        --color-text: ${colorScheme.text} !important;
        --card-bg: ${colorScheme.cardBg} !important;
        --color-card-bg-rgb: ${toRgb(colorScheme.cardBg)} !important;
        --border-color: ${colorScheme.borderColor} !important;
        --color-border-light: ${colorScheme.borderColorLight} !important;
        --terminal-bg: ${colorScheme.terminalBg} !important;
        --header-bg: ${colorScheme.headerBg} !important;
        --nav-bg: ${colorScheme.navBg} !important;
        --mobile-nav-bg: ${colorScheme.navBg.replace("0.8", "0.9")} !important;
        --hero-text-color: ${colorScheme.heroText} !important;
      }
    `;

    const lightCSS = `
      .light-theme {
        --background-color: ${colorScheme.backgroundLight} !important;
        --text-color: ${colorScheme.textDark} !important;
        --text-color-light: ${colorScheme.textLight} !important;
        --accent-color: ${colorScheme.primary} !important;
        --accent-color-rgb: ${colorScheme.primaryRgb} !important;
        --color-accent: ${colorScheme.primary} !important;
        --color-secondary: ${colorScheme.secondary} !important;
        --color-secondary-rgb: ${colorScheme.secondaryRgb} !important;
        --color-text: ${colorScheme.textDark} !important;
        --card-bg: ${colorScheme.cardBgLight} !important;
        --color-card-bg-rgb: ${toRgb(colorScheme.cardBgLight)} !important;
        --border-color: ${colorScheme.borderColorLight} !important;
        --color-border-light: ${colorScheme.borderColorLight} !important;
        --terminal-bg: ${colorScheme.backgroundLight} !important;
        --header-bg: ${colorScheme.borderColorLight} !important;
        --nav-bg: ${colorScheme.navBgLight} !important;
        --mobile-nav-bg: ${colorScheme.navBgLight} !important;
        --hero-text-color: ${colorScheme.textDark} !important;
      }
    `;

    const combinedCSS = `${darkCSS}\n${lightCSS}`;
    customThemeStyle.textContent = combinedCSS;

    // Persist to localStorage to prevent flash on reload
    try {
      localStorage.setItem("portfolio-custom-theme-css", combinedCSS);
    } catch {}

    // Force browser to recalculate styles
    document.body.classList.add("theme-updating");
    setTimeout(() => {
      document.body.classList.remove("theme-updating");
    }, 10);

    console.log("Applied custom colors for both themes");
  }, []);

  // Clear custom colors and revert to default theme
  const clearCustomColors = useCallback(() => {
    const customThemeStyle = document.getElementById("custom-theme-colors");
    if (customThemeStyle) {
      customThemeStyle.remove();
    }

    // Force browser to recalculate styles
    document.body.classList.add("theme-updating");
    setTimeout(() => {
      document.body.classList.remove("theme-updating");
    }, 10);

    console.log("Cleared custom colors, reverted to default theme");
  }, []);

  // Load colors from database
  const loadAndApplyColors = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("portfolio_config")
        .select("theme_colors")
        .limit(1);

      if (error) {
        console.warn(
          "Could not load custom colors, using defaults:",
          error.message
        );
        return;
      }

      if (data && data.length > 0 && data[0]?.theme_colors) {
        const colorScheme = data[0].theme_colors as ColorScheme;
        applyColors(colorScheme);
      } else {
        console.log("No custom colors found, using default theme");
      }
    } catch (error) {
      console.warn("Error loading custom colors:", error);
    }
  }, [applyColors]);

  // Load colors on mount
  useEffect(() => {
    // Small delay to ensure theme is properly applied first
    const timer = setTimeout(() => {
      loadAndApplyColors();
    }, 200);

    return () => clearTimeout(timer);
  }, [loadAndApplyColors]);

  return {
    loadAndApplyColors,
    applyColors,
    clearCustomColors,
  };
};
