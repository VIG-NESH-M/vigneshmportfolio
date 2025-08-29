-- Add color customization to the portfolio configuration
-- This migration adds color customization fields to the portfolio_config table

-- Add color customization columns to portfolio_config table
ALTER TABLE public.portfolio_config ADD COLUMN IF NOT EXISTS theme_colors JSONB DEFAULT '{
  "primary": "#34d399",
  "primaryRgb": "52, 211, 153",
  "secondary": "#22d3ee", 
  "secondaryRgb": "34, 211, 238",
  "background": "#0a0a0a",
  "backgroundLight": "#ffffff",
  "text": "#e5e5e5",
  "textLight": "#9ca3af",
  "textDark": "#1f2937",
  "cardBg": "#111111",
  "cardBgLight": "#ffffff",
  "borderColor": "#333333",
  "borderColorLight": "#e5e7eb",
  "terminalBg": "#1a1a1a",
  "headerBg": "#2d2d2d",
  "navBg": "rgba(10, 10, 10, 0.8)",
  "navBgLight": "rgba(255, 255, 255, 0.9)",
  "heroText": "#ffffff"
}'::jsonb;

-- Add preset themes
ALTER TABLE public.portfolio_config ADD COLUMN IF NOT EXISTS color_presets JSONB DEFAULT '[
  {
    "name": "Default Dark",
    "colors": {
      "primary": "#34d399",
      "primaryRgb": "52, 211, 153",
      "secondary": "#22d3ee",
      "secondaryRgb": "34, 211, 238",
      "background": "#0a0a0a",
      "text": "#e5e5e5",
      "textLight": "#9ca3af",
      "cardBg": "#111111",
      "borderColor": "#333333",
      "terminalBg": "#1a1a1a",
      "headerBg": "#2d2d2d",
      "navBg": "rgba(10, 10, 10, 0.8)",
      "heroText": "#ffffff"
    }
  },
  {
    "name": "Ocean Blue",
    "colors": {
      "primary": "#3b82f6",
      "primaryRgb": "59, 130, 246",
      "secondary": "#06b6d4",
      "secondaryRgb": "6, 182, 212",
      "background": "#0f172a",
      "text": "#f1f5f9",
      "textLight": "#94a3b8",
      "cardBg": "#1e293b",
      "borderColor": "#334155",
      "terminalBg": "#0f172a",
      "headerBg": "#1e293b",
      "navBg": "rgba(15, 23, 42, 0.8)",
      "heroText": "#ffffff"
    }
  },
  {
    "name": "Purple Neon",
    "colors": {
      "primary": "#8b5cf6",
      "primaryRgb": "139, 92, 246",
      "secondary": "#ec4899",
      "secondaryRgb": "236, 72, 153",
      "background": "#1a0b2e",
      "text": "#e2e8f0",
      "textLight": "#a78bfa",
      "cardBg": "#2d1b69",
      "borderColor": "#553c9a",
      "terminalBg": "#1a0b2e",
      "headerBg": "#2d1b69",
      "navBg": "rgba(26, 11, 46, 0.8)",
      "heroText": "#ffffff"
    }
  },
  {
    "name": "Cyberpunk",
    "colors": {
      "primary": "#00ff9f",
      "primaryRgb": "0, 255, 159",
      "secondary": "#ff0080",
      "secondaryRgb": "255, 0, 128",
      "background": "#0a0a0a",
      "text": "#00ff9f",
      "textLight": "#80ffcf",
      "cardBg": "#1a1a1a",
      "borderColor": "#00ff9f",
      "terminalBg": "#0a0a0a",
      "headerBg": "#1a1a1a",
      "navBg": "rgba(10, 10, 10, 0.9)",
      "heroText": "#00ff9f"
    }
  },
  {
    "name": "Light Mode",
    "colors": {
      "primary": "#2563eb",
      "primaryRgb": "37, 99, 235",
      "secondary": "#7c3aed",
      "secondaryRgb": "124, 58, 237",
      "background": "#ffffff",
      "text": "#1f2937",
      "textLight": "#6b7280",
      "cardBg": "#f9fafb",
      "borderColor": "#e5e7eb",
      "terminalBg": "#f3f4f6",
      "headerBg": "#ffffff",
      "navBg": "rgba(255, 255, 255, 0.9)",
      "heroText": "#1f2937"
    }
  }
]'::jsonb;

-- Update RLS policies to allow color customization updates
-- The existing admin policies should already cover this, but let's ensure it's explicit

COMMENT ON COLUMN public.portfolio_config.theme_colors IS 'Custom color scheme for the portfolio theme';
COMMENT ON COLUMN public.portfolio_config.color_presets IS 'Predefined color theme presets';
