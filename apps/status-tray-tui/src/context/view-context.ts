import { createContext, useContext } from "react";

export type ViewContextType = {
  showOnlyFailed: boolean;
  toggle: () => void;
}

export const ViewContext = createContext({
  showOnlyFailed: false,
  toggle: () => { }
});

export const useViewContext = () => useContext(ViewContext);
