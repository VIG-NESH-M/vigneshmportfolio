import { createContext } from "react";
import { type Theme, type SectionId } from "../types/portfolioTypes";

// App State Interface
export interface AppState {
  theme: Theme;
  activeSection: SectionId;
  isLoading: boolean;
  isMobileMenuOpen: boolean;
  copyTooltipVisible: boolean;
  currentPage: string;
  notifications: Notification[];
}

// Notification Interface
export interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
}

// Action Types
export type AppAction =
  | { type: "SET_THEME"; payload: Theme }
  | { type: "TOGGLE_THEME" }
  | { type: "SET_ACTIVE_SECTION"; payload: SectionId }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "TOGGLE_MOBILE_MENU" }
  | { type: "SET_MOBILE_MENU"; payload: boolean }
  | { type: "SET_COPY_TOOLTIP"; payload: boolean }
  | { type: "SET_CURRENT_PAGE"; payload: string }
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "REMOVE_NOTIFICATION"; payload: string }
  | { type: "CLEAR_NOTIFICATIONS" };

// Context Type
export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

// App Context
export const AppContext = createContext<AppContextType | undefined>(undefined);
