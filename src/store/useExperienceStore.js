import { create } from "zustand";

export const useExperienceStore = create((set) => ({
  isExperienceReady: false,
  isPhotoPanelOpen: false,
  activeCat: null,
  setIsExperienceReady: (bool) => set({ isExperienceReady: bool }),
  openCatPanel: (cat) => set({ isPhotoPanelOpen: true, activeCat: cat }),
  closeCatPanel: () => set({ isPhotoPanelOpen: false, activeCat: null }),
}));
