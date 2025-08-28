import { createContext } from "react";

// Router context type
export interface RouterContextType {
  currentPath: string;
  navigate: (path: string, replace?: boolean) => void;
  back: () => void;
  forward: () => void;
}

// Router context
export const RouterContext = createContext<RouterContextType | undefined>(
  undefined
);
