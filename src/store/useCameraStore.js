import { create } from "zustand";

export const useCameraStore = create((set) => ({
  zoom: 1,
  setZoom: (zoom) => set({ zoom }),
}));
