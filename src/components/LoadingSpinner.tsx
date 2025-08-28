import React from "react";

export const LoadingSpinner: React.FC = () => (
  <div
    className="flex items-center justify-center min-h-screen"
    role="status"
    aria-label="Loading"
  >
    <div className="relative">
      {/* Outer ring with gradient */}
      <div className="w-20 h-20 rounded-full border-4 border-transparent bg-gradient-to-tr from-emerald-500 via-blue-500 to-purple-600 animate-spin">
        <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 m-1"></div>
      </div>

      {/* Inner pulsing dot */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full animate-pulse"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute -top-2 -left-2 w-24 h-24">
        <div className="absolute top-0 left-8 w-1 h-1 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.5s] opacity-60"></div>
        <div className="absolute top-4 right-0 w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s] opacity-40"></div>
        <div className="absolute bottom-2 left-2 w-1 h-1 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.7s] opacity-50"></div>
        <div className="absolute bottom-0 right-6 w-1 h-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.1s] opacity-30"></div>
      </div>
    </div>

    {/* Loading text with gradient */}
    <div className="absolute mt-32">
      <div className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500 text-sm font-medium animate-pulse">
        Loading amazing content...
      </div>
    </div>

    <span className="sr-only">Loading content...</span>
  </div>
);

export const LoadingDots: React.FC = () => (
  <div
    className="flex items-center space-x-3"
    role="status"
    aria-label="Loading"
  >
    {/* Enhanced dots with gradient and glow effect */}
    <div className="relative">
      <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full animate-bounce [animation-delay:-0.4s] shadow-lg shadow-emerald-500/50"></div>
      <div className="absolute inset-0 w-3 h-3 bg-emerald-500 rounded-full animate-ping opacity-20 [animation-delay:-0.4s]"></div>
    </div>

    <div className="relative">
      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce [animation-delay:-0.2s] shadow-lg shadow-blue-500/50"></div>
      <div className="absolute inset-0 w-3 h-3 bg-blue-500 rounded-full animate-ping opacity-20 [animation-delay:-0.2s]"></div>
    </div>

    <div className="relative">
      <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full animate-bounce shadow-lg shadow-purple-500/50"></div>
      <div className="absolute inset-0 w-3 h-3 bg-purple-500 rounded-full animate-ping opacity-20"></div>
    </div>

    <span className="sr-only">Loading...</span>
  </div>
);

// New premium loader variant
export const LoadingOrb: React.FC = () => (
  <div
    className="flex items-center justify-center min-h-screen"
    role="status"
    aria-label="Loading"
  >
    <div className="relative w-24 h-24">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-full border border-white/20 dark:border-white/10"></div>

      {/* Animated gradient orb */}
      <div className="absolute inset-2 bg-gradient-to-tr from-emerald-500 via-blue-500 to-purple-600 rounded-full animate-spin opacity-80"></div>

      {/* Inner glow */}
      <div className="absolute inset-4 bg-gradient-to-br from-white/40 to-transparent rounded-full animate-pulse"></div>

      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-ping"></div>
    </div>

    <span className="sr-only">Loading content...</span>
  </div>
);

// Minimal wave loader
export const LoadingWave: React.FC = () => (
  <div
    className="flex items-center justify-center space-x-1"
    role="status"
    aria-label="Loading"
  >
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="w-1 bg-gradient-to-t from-emerald-500 to-blue-500 rounded-full animate-pulse"
        style={{
          height: `${12 + Math.sin(i * 0.5) * 8}px`,
          animationDelay: `${i * 0.1}s`,
          animationDuration: "1.5s",
        }}
      ></div>
    ))}
    <span className="sr-only">Loading...</span>
  </div>
);
