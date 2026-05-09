import { create } from "zustand";
import { PteroSettings } from "@/types";

interface SettingsState {
  settings: PteroSettings | null;
  loading: boolean;
  setSettings: (settings: PteroSettings) => void;
  setLoading: (loading: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  loading: true,
  setSettings: (settings) => set({ settings, loading: false }),
  setLoading: (loading) => set({ loading }),
}));
