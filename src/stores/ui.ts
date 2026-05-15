import { create } from "zustand";

type UiState = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
};

export const useUiStore = create<UiState>()((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },
  closeSidebar: () => {
    set({ sidebarOpen: false });
  },
  openSidebar: () => {
    set({ sidebarOpen: true });
  },
}));
