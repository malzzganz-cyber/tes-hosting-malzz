import { create } from "zustand";
import { Panel } from "@/types";

interface PanelState {
  panels: Panel[];
  loading: boolean;
  setPanels: (panels: Panel[]) => void;
  addPanel: (panel: Panel) => void;
  removePanel: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const usePanelStore = create<PanelState>((set) => ({
  panels: [],
  loading: false,
  setPanels: (panels) => set({ panels }),
  addPanel: (panel) => set((state) => ({ panels: [panel, ...state.panels] })),
  removePanel: (id) =>
    set((state) => ({ panels: state.panels.filter((p) => p.id !== id) })),
  setLoading: (loading) => set({ loading }),
}));
