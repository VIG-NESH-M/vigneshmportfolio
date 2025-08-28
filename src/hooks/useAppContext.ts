import { useContext } from "react";
import {
  AppContext,
  type AppContextType,
  type Notification,
} from "../contexts/AppContextDefinition";

// Custom hook to use the app context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

// Theme related hooks
export const useTheme = () => {
  const { state, dispatch } = useAppContext();

  const toggleTheme = () => {
    dispatch({ type: "TOGGLE_THEME" });
  };

  const setTheme = (theme: "dark" | "light") => {
    dispatch({ type: "SET_THEME", payload: theme });
  };

  return {
    theme: state.theme,
    toggleTheme,
    setTheme,
  };
};

// Navigation related hooks
export const useNavigation = () => {
  const { state, dispatch } = useAppContext();

  const setActiveSection = (
    section: import("../types/portfolioTypes").SectionId
  ) => {
    dispatch({ type: "SET_ACTIVE_SECTION", payload: section });
  };

  const setCurrentPage = (page: string) => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: page });
  };

  const toggleMobileMenu = () => {
    dispatch({ type: "TOGGLE_MOBILE_MENU" });
  };

  const setMobileMenu = (isOpen: boolean) => {
    dispatch({ type: "SET_MOBILE_MENU", payload: isOpen });
  };

  return {
    activeSection: state.activeSection,
    currentPage: state.currentPage,
    isMobileMenuOpen: state.isMobileMenuOpen,
    setActiveSection,
    setCurrentPage,
    toggleMobileMenu,
    setMobileMenu,
  };
};

// UI state hooks
export const useUI = () => {
  const { state, dispatch } = useAppContext();

  const setLoading = (loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  };

  const setCopyTooltip = (visible: boolean) => {
    dispatch({ type: "SET_COPY_TOOLTIP", payload: visible });
  };

  return {
    isLoading: state.isLoading,
    copyTooltipVisible: state.copyTooltipVisible,
    setLoading,
    setCopyTooltip,
  };
};

// Notifications hooks
export const useNotifications = () => {
  const { state, dispatch } = useAppContext();

  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        ...notification,
        id,
        duration: notification.duration || 5000,
      },
    });
  };

  const removeNotification = (id: string) => {
    dispatch({ type: "REMOVE_NOTIFICATION", payload: id });
  };

  const clearNotifications = () => {
    dispatch({ type: "CLEAR_NOTIFICATIONS" });
  };

  return {
    notifications: state.notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  };
};
