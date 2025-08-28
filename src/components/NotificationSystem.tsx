import React, { useEffect, useState } from "react";
import { useNotifications } from "../hooks/useAppContext";

export const NotificationSystem: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();
  const [isDark, setIsDark] = useState(false);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

  // Check if dark mode is active
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    // Initial check
    checkDarkMode();

    // Watch for changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleRemove = (id: string) => {
    // Add to removing set to trigger exit animation
    setRemovingIds((prev) => new Set(prev).add(id));

    // Remove after animation completes
    setTimeout(() => {
      removeNotification(id);
      setRemovingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 400); // Match animation duration
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-[9999] space-y-3 max-w-sm">
      {notifications.map((notification) => {
        const isRemoving = removingIds.has(notification.id);

        return (
          <div
            key={notification.id}
            className={`
              relative px-5 py-4 rounded-2xl transition-all duration-400 ease-out transform
              backdrop-blur-2xl border backdrop-saturate-150
              ${
                isRemoving
                  ? "opacity-0 translate-x-full scale-95"
                  : "opacity-100 translate-x-0 scale-100"
              }
              ${
                isDark
                  ? "bg-black/20 text-white border-white/15 shadow-2xl shadow-black/10"
                  : "bg-white/25 text-black border-black/15 shadow-2xl shadow-gray-500/5"
              }
            `}
            style={{
              animation: isRemoving
                ? undefined
                : "slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex-shrink-0">
                  {notification.type === "success" && (
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                  {notification.type === "error" && (
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                  {notification.type === "warning" && (
                    <svg
                      className="w-5 h-5 text-amber-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                  {notification.type === "info" && (
                    <svg
                      className="w-5 h-5 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </div>
                <p className="text-sm font-medium flex-1">
                  {notification.message}
                </p>
              </div>

              <button
                onClick={() => handleRemove(notification.id)}
                className={`
                flex-shrink-0 p-1 rounded-lg transition-colors duration-200 
                focus:outline-none focus:ring-2
                ${
                  isDark
                    ? "hover:bg-white/10 focus:ring-white/20"
                    : "hover:bg-black/10 focus:ring-black/20"
                }
              `}
                aria-label="Close notification"
              >
                <svg
                  className={`w-4 h-4 transition-opacity ${
                    isDark
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-600 hover:text-black"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
