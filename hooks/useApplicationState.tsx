/**
 * Hook that controls whether the navigation bar
 * should switch to a solid background when the
 * ApplicationState component is visible.
 */

import { create } from "zustand";

type AppStateStore = {
  isNavSolid: boolean;
  setIsNavSolid: (value: boolean) => void;
};

export const useApplicationState = create<AppStateStore>((set) => ({
  isNavSolid: false,
  setIsNavSolid: (value) => set({ isNavSolid: value }),
}));




