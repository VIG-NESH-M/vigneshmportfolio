import React, { useState, useEffect, useCallback } from "react";
import { Palette, Save, RefreshCw, Eye } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useThemeColors } from "../../hooks/useThemeColors";

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

interface ColorPreset {
  name: string;
  colors: Partial<ColorScheme>;
}

// Default presets used when none exist in the database
const DEFAULT_PRESETS: ColorPreset[] = [
  // Balanced emerald + cyan
  {
    name: "Emerald Ocean",
    colors: {
      primary: "#10b981",
      primaryRgb: "16, 185, 129",
      secondary: "#06b6d4",
      secondaryRgb: "6, 182, 212",
      background: "#0b0f0d",
      backgroundLight: "#ffffff",
      text: "#e5e7eb",
      textLight: "#9ca3af",
      textDark: "#111827",
      cardBg: "#111827",
      cardBgLight: "#ffffff",
      borderColor: "#334155",
      borderColorLight: "#e5e7eb",
      terminalBg: "#0b0f0d",
      headerBg: "#111827",
      navBg: "rgba(11, 15, 13, 0.85)",
      navBgLight: "rgba(255, 255, 255, 0.9)",
      heroText: "#e5e7eb",
    },
  },
  // Professional indigo
  {
    name: "Midnight Indigo",
    colors: {
      primary: "#6366f1",
      primaryRgb: "99, 102, 241",
      secondary: "#22d3ee",
      secondaryRgb: "34, 211, 238",
      background: "#0f172a",
      backgroundLight: "#ffffff",
      text: "#e2e8f0",
      textLight: "#94a3b8",
      textDark: "#0f172a",
      cardBg: "#111827",
      cardBgLight: "#ffffff",
      borderColor: "#1f2937",
      borderColorLight: "#e5e7eb",
      terminalBg: "#0b1220",
      headerBg: "#111827",
      navBg: "rgba(15, 23, 42, 0.85)",
      navBgLight: "rgba(255, 255, 255, 0.9)",
      heroText: "#e2e8f0",
    },
  },
  // Warm accent with solid contrast
  {
    name: "Sunset Blaze",
    colors: {
      primary: "#f97316",
      primaryRgb: "249, 115, 22",
      secondary: "#f59e0b",
      secondaryRgb: "245, 158, 11",
      background: "#111111",
      backgroundLight: "#ffffff",
      text: "#f3f4f6",
      textLight: "#d1d5db",
      textDark: "#111827",
      cardBg: "#171717",
      cardBgLight: "#ffffff",
      borderColor: "#3f3f46",
      borderColorLight: "#e5e7eb",
      terminalBg: "#1a1a1a",
      headerBg: "#1f2937",
      navBg: "rgba(17, 17, 17, 0.85)",
      navBgLight: "rgba(255, 255, 255, 0.9)",
      heroText: "#f9fafb",
    },
  },
  // Clean blue/green tech look
  {
    name: "Nordic Ice",
    colors: {
      primary: "#60a5fa",
      primaryRgb: "96, 165, 250",
      secondary: "#34d399",
      secondaryRgb: "52, 211, 153",
      background: "#0b1220",
      backgroundLight: "#ffffff",
      text: "#e5e7eb",
      textLight: "#9ca3af",
      textDark: "#0f172a",
      cardBg: "#0f172a",
      cardBgLight: "#ffffff",
      borderColor: "#1f2937",
      borderColorLight: "#e5e7eb",
      terminalBg: "#0b1220",
      headerBg: "#111827",
      navBg: "rgba(11, 18, 32, 0.85)",
      navBgLight: "rgba(255, 255, 255, 0.9)",
      heroText: "#e5e7eb",
    },
  },
  // Elegant rose-pine tuned for clarity
  {
    name: "Rose Pine",
    colors: {
      primary: "#eb6f92",
      primaryRgb: "235, 111, 146",
      secondary: "#9ccfd8",
      secondaryRgb: "156, 207, 216",
      background: "#191724",
      backgroundLight: "#ffffff",
      text: "#e0def4",
      textLight: "#a8a3c5",
      textDark: "#111827",
      cardBg: "#1f1d2e",
      cardBgLight: "#ffffff",
      borderColor: "#2b283a",
      borderColorLight: "#e5e7eb",
      terminalBg: "#1f1d2e",
      headerBg: "#26233a",
      navBg: "rgba(25, 23, 36, 0.85)",
      navBgLight: "rgba(255, 255, 255, 0.9)",
      heroText: "#e0def4",
    },
  },
  // Modern purple/green with high contrast
  {
    name: "Dracula Night",
    colors: {
      primary: "#a78bfa",
      primaryRgb: "167, 139, 250",
      secondary: "#34d399",
      secondaryRgb: "52, 211, 153",
      background: "#0f1020",
      backgroundLight: "#ffffff",
      text: "#f5f6fa",
      textLight: "#c7c9d3",
      textDark: "#111827",
      cardBg: "#16172a",
      cardBgLight: "#ffffff",
      borderColor: "#2a2c44",
      borderColorLight: "#e5e7eb",
      terminalBg: "#121326",
      headerBg: "#1b1c32",
      navBg: "rgba(15, 16, 32, 0.85)",
      navBgLight: "rgba(255, 255, 255, 0.9)",
      heroText: "#f5f6fa",
    },
  },
  // Navy with lilac accents
  {
    name: "Tokyo Night",
    colors: {
      primary: "#7aa2f7",
      primaryRgb: "122, 162, 247",
      secondary: "#bb9af7",
      secondaryRgb: "187, 154, 247",
      background: "#1a1b26",
      backgroundLight: "#ffffff",
      text: "#c0caf5",
      textLight: "#a9b1d6",
      textDark: "#0f172a",
      cardBg: "#24283b",
      cardBgLight: "#ffffff",
      borderColor: "#2f334d",
      borderColorLight: "#e5e7eb",
      terminalBg: "#151720",
      headerBg: "#1f2233",
      navBg: "rgba(26, 27, 38, 0.85)",
      navBgLight: "rgba(255, 255, 255, 0.9)",
      heroText: "#c0caf5",
    },
  },
  // Accessible solarized variant
  {
    name: "Solarized",
    colors: {
      primary: "#268bd2",
      primaryRgb: "38, 139, 210",
      secondary: "#2aa198",
      secondaryRgb: "42, 161, 152",
      background: "#002b36",
      backgroundLight: "#ffffff",
      text: "#eee8d5",
      textLight: "#93a1a1",
      textDark: "#0f172a",
      cardBg: "#073642",
      cardBgLight: "#ffffff",
      borderColor: "#0a3640",
      borderColorLight: "#e5e7eb",
      terminalBg: "#01303a",
      headerBg: "#073642",
      navBg: "rgba(0, 43, 54, 0.85)",
      navBgLight: "rgba(255, 255, 255, 0.9)",
      heroText: "#eee8d5",
    },
  },
  // Refined gruvbox
  {
    name: "Gruvbox",
    colors: {
      primary: "#d79921",
      primaryRgb: "215, 153, 33",
      secondary: "#83a598",
      secondaryRgb: "131, 165, 152",
      background: "#1d2021",
      backgroundLight: "#ffffff",
      text: "#ebdbb2",
      textLight: "#d5c4a1",
      textDark: "#111827",
      cardBg: "#282828",
      cardBgLight: "#ffffff",
      borderColor: "#3c3836",
      borderColorLight: "#e5e7eb",
      terminalBg: "#1b1b1b",
      headerBg: "#32302f",
      navBg: "rgba(29, 32, 33, 0.85)",
      navBgLight: "rgba(255, 255, 255, 0.9)",
      heroText: "#ebdbb2",
    },
  },
  // Clean monochrome with accents
  {
    name: "Monokai Pro",
    colors: {
      primary: "#ffcc66",
      primaryRgb: "255, 204, 102",
      secondary: "#ab9df2",
      secondaryRgb: "171, 157, 242",
      background: "#2d2a2e",
      backgroundLight: "#ffffff",
      text: "#f5f5f5",
      textLight: "#d4d4d4",
      textDark: "#111827",
      cardBg: "#363338",
      cardBgLight: "#ffffff",
      borderColor: "#403d42",
      borderColorLight: "#e5e7eb",
      terminalBg: "#232227",
      headerBg: "#2f2c31",
      navBg: "rgba(45, 42, 46, 0.85)",
      navBgLight: "rgba(255, 255, 255, 0.9)",
      heroText: "#f5f5f5",
    },
  },
  // Trustworthy teal/green
  {
    name: "Forest Mint",
    colors: {
      primary: "#14b8a6",
      primaryRgb: "20, 184, 166",
      secondary: "#10b981",
      secondaryRgb: "16, 185, 129",
      background: "#0b1210",
      backgroundLight: "#ffffff",
      text: "#e5f7f0",
      textLight: "#94d9c3",
      textDark: "#0f172a",
      cardBg: "#10201a",
      cardBgLight: "#ffffff",
      borderColor: "#1e3a34",
      borderColorLight: "#e5e7eb",
      terminalBg: "#0b1210",
      headerBg: "#143d34",
      navBg: "rgba(11, 18, 16, 0.85)",
      navBgLight: "rgba(255, 255, 255, 0.9)",
      heroText: "#e5f7f0",
    },
  },
  // Crisp aqua
  {
    name: "Aqua Neon",
    colors: {
      primary: "#06b6d4",
      primaryRgb: "6, 182, 212",
      secondary: "#22d3ee",
      secondaryRgb: "34, 211, 238",
      background: "#0b0f14",
      backgroundLight: "#ffffff",
      text: "#e6fffe",
      textLight: "#a5f3fc",
      textDark: "#0f172a",
      cardBg: "#0f1720",
      cardBgLight: "#ffffff",
      borderColor: "#1f2937",
      borderColorLight: "#e5e7eb",
      terminalBg: "#0b0f14",
      headerBg: "#111827",
      navBg: "rgba(11, 15, 20, 0.85)",
      navBgLight: "rgba(255, 255, 255, 0.9)",
      heroText: "#e6fffe",
    },
  },
  // Professional blue
  {
    name: "Steel Blue",
    colors: {
      primary: "#3b82f6",
      primaryRgb: "59, 130, 246",
      secondary: "#60a5fa",
      secondaryRgb: "96, 165, 250",
      background: "#0b1220",
      backgroundLight: "#ffffff",
      text: "#e5e7eb",
      textLight: "#9ca3af",
      textDark: "#0f172a",
      cardBg: "#0f172a",
      cardBgLight: "#ffffff",
      borderColor: "#1f2937",
      borderColorLight: "#e5e7eb",
      terminalBg: "#0b1220",
      headerBg: "#111827",
      navBg: "rgba(11, 18, 32, 0.85)",
      navBgLight: "rgba(255, 255, 255, 0.9)",
      heroText: "#e5e7eb",
    },
  },
];

interface NotificationProps {
  type: "success" | "error" | "info";
  message: string;
}

const ColorCustomizer: React.FC = () => {
  const { applyColors: applyThemeColors, clearCustomColors } = useThemeColors();
  const [colors, setColors] = useState<ColorScheme>({
    primary: "#34d399",
    primaryRgb: "52, 211, 153",
    secondary: "#22d3ee",
    secondaryRgb: "34, 211, 238",
    background: "#0a0a0a",
    backgroundLight: "#ffffff",
    text: "#e5e5e5",
    textLight: "#9ca3af",
    textDark: "#1f2937",
    cardBg: "#111111",
    cardBgLight: "#ffffff",
    borderColor: "#333333",
    borderColorLight: "#e5e7eb",
    terminalBg: "#1a1a1a",
    headerBg: "#2d2d2d",
    navBg: "rgba(10, 10, 10, 0.8)",
    navBgLight: "rgba(255, 255, 255, 0.9)",
    heroText: "#ffffff",
  });

  const [presets, setPresets] = useState<ColorPreset[]>(DEFAULT_PRESETS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<NotificationProps | null>(
    null
  );
  const [previewMode, setPreviewMode] = useState(false);

  const showNotification = useCallback(
    (type: NotificationProps["type"], message: string) => {
      setNotification({ type, message });
      setTimeout(() => setNotification(null), 3000);
    },
    []
  );

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return `${r}, ${g}, ${b}`;
    }
    return "0, 0, 0";
  };

  // Apply colors to CSS variables
  const applyColors = useCallback(
    (colorScheme: ColorScheme, isPreview = false) => {
      console.log("🎨 ColorCustomizer: Applying colors", {
        colorScheme,
        isPreview,
      });
      applyThemeColors(colorScheme);

      if (!isPreview) {
        showNotification("success", "Colors applied successfully!");
      }
    },
    [applyThemeColors, showNotification]
  );

  // Load colors from database
  const loadColors = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("portfolio_config")
        .select("theme_colors, color_presets")
        .limit(1);

      if (error) {
        console.warn("Error loading colors:", error);
        showNotification(
          "info",
          "Using default colors - no custom configuration found"
        );
        // Ensure presets available even on error
        setPresets(DEFAULT_PRESETS);
        return;
      }

      if (data && data.length > 0) {
        const config = data[0];

        if (config.theme_colors) {
          const loadedColors = config.theme_colors as ColorScheme;
          setColors(loadedColors);
          applyColors(loadedColors);
        }

        // Use DB presets if present, else fall back to defaults
        if (config.color_presets && config.color_presets.length > 0) {
          const dbPresets = config.color_presets as ColorPreset[];
          // Merge DB presets with defaults, prefer DB values on name collision
          const byName = new Map<string, ColorPreset>();
          DEFAULT_PRESETS.forEach((p) => byName.set(p.name, p));
          dbPresets.forEach((p) => byName.set(p.name, p));
          setPresets(Array.from(byName.values()));
        } else {
          setPresets(DEFAULT_PRESETS);
        }
      } else {
        showNotification("info", "No custom colors found - using defaults");
        setPresets(DEFAULT_PRESETS);
      }
    } catch (error) {
      console.error("Error loading colors:", error);
      showNotification(
        "error",
        `Failed to load colors: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      setPresets(DEFAULT_PRESETS);
    } finally {
      setLoading(false);
    }
  }, [applyColors, showNotification]);

  // Save colors to database
  const saveColors = async () => {
    try {
      setSaving(true);

      // First, check if a config record exists
      const { data: existingConfig, error: checkError } = await supabase
        .from("portfolio_config")
        .select("id")
        .limit(1);

      if (checkError) {
        console.error("Error checking config:", checkError);
        throw new Error("Failed to check database configuration");
      }

      let result;
      if (existingConfig && existingConfig.length > 0) {
        // Update existing record
        result = await supabase
          .from("portfolio_config")
          .update({
            theme_colors: colors,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingConfig[0].id);
      } else {
        // Create new record
        result = await supabase.from("portfolio_config").insert({
          theme_colors: colors,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      if (result.error) {
        console.error("Database error:", result.error);
        throw result.error;
      }

      // Apply colors immediately after successful save
      console.log("🎨 Applying colors after successful save...");
      applyColors(colors);

      showNotification("success", "Colors saved and applied successfully!");
    } catch (error) {
      console.error("Error saving colors:", error);
      showNotification(
        "error",
        `Failed to save colors: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setSaving(false);
    }
  };

  // Handle color change
  const handleColorChange = (key: keyof ColorScheme, value: string) => {
    const newColors = { ...colors, [key]: value };

    // Auto-update RGB values for primary and secondary colors
    if (key === "primary") {
      newColors.primaryRgb = hexToRgb(value);
    } else if (key === "secondary") {
      newColors.secondaryRgb = hexToRgb(value);
    }

    setColors(newColors);

    // Apply colors immediately for better user experience
    console.log("🎨 Applying color change:", key, value);
    applyColors(newColors, true);
  };

  // Apply preset
  const applyPreset = (preset: ColorPreset) => {
    const newColors = { ...colors, ...preset.colors };
    setColors(newColors);
    applyColors(newColors);
    showNotification("info", `Applied ${preset.name} theme`);
  };

  // Reset to default colors
  const resetToDefaults = useCallback(async () => {
    try {
      // Clear custom colors from UI
      clearCustomColors();

      // Reset colors state to defaults
      const defaultColors: ColorScheme = {
        primary: "#34d399",
        primaryRgb: "52, 211, 153",
        secondary: "#22d3ee",
        secondaryRgb: "34, 211, 238",
        background: "#0a0a0a",
        backgroundLight: "#ffffff",
        text: "#e5e5e5",
        textLight: "#9ca3af",
        textDark: "#1f2937",
        cardBg: "#111111",
        cardBgLight: "#ffffff",
        borderColor: "#333333",
        borderColorLight: "#e5e7eb",
        terminalBg: "#1a1a1a",
        headerBg: "#2d2d2d",
        navBg: "rgba(10, 10, 10, 0.8)",
        navBgLight: "rgba(255, 255, 255, 0.9)",
        heroText: "#ffffff",
      };

      setColors(defaultColors);

      // Remove custom colors from database
      const { data: existingConfig } = await supabase
        .from("portfolio_config")
        .select("id")
        .limit(1);

      if (existingConfig && existingConfig.length > 0) {
        await supabase
          .from("portfolio_config")
          .update({
            theme_colors: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingConfig[0].id);
      }

      showNotification("info", "Reset to default colors successfully!");
    } catch (error) {
      console.error("Error resetting colors:", error);
      showNotification("error", "Failed to reset colors");
    }
  }, [clearCustomColors, showNotification]);

  useEffect(() => {
    loadColors();
  }, [loadColors]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
        <span className="ml-2 text-white">Loading color settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Notification */}
      {notification && (
        <div
          className={`p-4 rounded-lg border ${
            notification.type === "success"
              ? "bg-green-500/20 border-green-500/30 text-green-400"
              : notification.type === "error"
              ? "bg-red-500/20 border-red-500/30 text-red-400"
              : "bg-blue-500/20 border-blue-500/30 text-blue-400"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Palette className="w-8 h-8 text-emerald-500" />
          <div>
            <h1 className="text-3xl font-bold text-white">Color Customizer</h1>
            <p className="text-gray-400">
              Customize your website's complete color scheme
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              previewMode
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Preview Mode</span>
          </button>

          <button
            onClick={saveColors}
            disabled={saving}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? "Saving..." : "Save Colors"}</span>
          </button>
        </div>
      </div>

      {/* Color Presets */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Color Presets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {presets.map((preset, index) => (
            <button
              key={index}
              onClick={() => applyPreset(preset)}
              className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-left"
            >
              <div className="flex items-center space-x-3 mb-2">
                <div
                  className="w-6 h-6 rounded-full"
                  style={{
                    backgroundColor: preset.colors.primary || colors.primary,
                  }}
                />
                <span className="text-white font-medium">{preset.name}</span>
              </div>
              <div className="flex space-x-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{
                    backgroundColor: preset.colors.primary || colors.primary,
                  }}
                />
                <div
                  className="w-4 h-4 rounded"
                  style={{
                    backgroundColor:
                      preset.colors.secondary || colors.secondary,
                  }}
                />
                <div
                  className="w-4 h-4 rounded"
                  style={{
                    backgroundColor:
                      preset.colors.background || colors.background,
                  }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Primary Colors */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Primary Colors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Primary Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={colors.primary}
                onChange={(e) => handleColorChange("primary", e.target.value)}
                className="w-12 h-10 rounded-lg border-2 border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={colors.primary}
                onChange={(e) => handleColorChange("primary", e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Secondary Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={colors.secondary}
                onChange={(e) => handleColorChange("secondary", e.target.value)}
                className="w-12 h-10 rounded-lg border-2 border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={colors.secondary}
                onChange={(e) => handleColorChange("secondary", e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Background Colors */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Background Colors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Dark Background
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={colors.background}
                onChange={(e) =>
                  handleColorChange("background", e.target.value)
                }
                className="w-12 h-10 rounded-lg border-2 border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={colors.background}
                onChange={(e) =>
                  handleColorChange("background", e.target.value)
                }
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Card Background
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={colors.cardBg}
                onChange={(e) => handleColorChange("cardBg", e.target.value)}
                className="w-12 h-10 rounded-lg border-2 border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={colors.cardBg}
                onChange={(e) => handleColorChange("cardBg", e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Text Colors */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Text Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Primary Text
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={colors.text}
                onChange={(e) => handleColorChange("text", e.target.value)}
                className="w-12 h-10 rounded-lg border-2 border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={colors.text}
                onChange={(e) => handleColorChange("text", e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Secondary Text
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={colors.textLight}
                onChange={(e) => handleColorChange("textLight", e.target.value)}
                className="w-12 h-10 rounded-lg border-2 border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={colors.textLight}
                onChange={(e) => handleColorChange("textLight", e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between bg-gray-800 rounded-lg p-6">
        <div className="text-gray-400">
          <p>
            Changes will be applied{" "}
            {previewMode ? "instantly in preview mode" : "after saving"}
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset to Defaults</span>
          </button>

          <button
            onClick={loadColors}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Saved</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorCustomizer;
