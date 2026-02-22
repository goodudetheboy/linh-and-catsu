import { create } from "zustand";

export const useResponsiveStore = create(() => ({
  isMobile: window.innerWidth < 764,
}));

window.addEventListener("resize", () => {
  useResponsiveStore.setState({ isMobile: window.innerWidth < 764 });
});
