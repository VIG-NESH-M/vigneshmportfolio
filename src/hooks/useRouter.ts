import { useContext } from "react";
import {
  RouterContext,
  type RouterContextType,
} from "../contexts/RouterContext";

// Custom hook to use router
export const useRouter = (): RouterContextType => {
  const context = useContext(RouterContext);
  if (context === undefined) {
    throw new Error("useRouter must be used within a RouterProvider");
  }
  return context;
};
