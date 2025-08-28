import React, { useReducer, useEffect, type ReactNode } from "react";
import {
  getInitialTheme,
  saveTheme,
  applyTheme,
  listenForSystemThemeChanges,
} from "../utils/theme";
import {
  AppContext,
  type AppState,
  type AppAction,
} from "./AppContextDefinition";

// Initial State
const initialState: AppState = {
  theme: getInitialTheme(),
  activeSection: "home",
  isLoading: false,
  isMobileMenuOpen: false,
  copyTooltipVisible: false,
  currentPage: "/",
  notifications: [],
};

// Reducer Function
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "SET_THEME":
      return { ...state, theme: action.payload };

    case "TOGGLE_THEME": {
      const newTheme = state.theme === "dark" ? "light" : "dark";
      saveTheme(newTheme);
      return { ...state, theme: newTheme };
    }

    case "SET_ACTIVE_SECTION":
      return { ...state, activeSection: action.payload };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "TOGGLE_MOBILE_MENU":
      return { ...state, isMobileMenuOpen: !state.isMobileMenuOpen };

    case "SET_MOBILE_MENU":
      return { ...state, isMobileMenuOpen: action.payload };

    case "SET_COPY_TOOLTIP":
      return { ...state, copyTooltipVisible: action.payload };

    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };

    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };

    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n.id !== action.payload
        ),
      };

    case "CLEAR_NOTIFICATIONS":
      return { ...state, notifications: [] };

    default:
      return state;
  }
};

// Provider Component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Apply theme changes
  useEffect(() => {
    applyTheme(state.theme);
  }, [state.theme]);

  // Listen for system theme changes
  useEffect(() => {
    const cleanup = listenForSystemThemeChanges((systemTheme) => {
      dispatch({ type: "SET_THEME", payload: systemTheme });
    });

    return cleanup;
  }, []);

  // Auto-hide copy tooltip
  useEffect(() => {
    if (state.copyTooltipVisible) {
      const timer = setTimeout(() => {
        dispatch({ type: "SET_COPY_TOOLTIP", payload: false });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.copyTooltipVisible]);

  // Auto-remove notifications
  useEffect(() => {
    state.notifications.forEach((notification) => {
      if (notification.duration) {
        const timer = setTimeout(() => {
          dispatch({ type: "REMOVE_NOTIFICATION", payload: notification.id });
        }, notification.duration);
        return () => clearTimeout(timer);
      }
    });
  }, [state.notifications]);

  // Handle mobile menu body overflow
  useEffect(() => {
    if (state.isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [state.isMobileMenuOpen]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
