import { create } from "zustand";
import { api } from "../lib/api";

// Models and packages are loaded once and shared by every page
export const useCatalog = create((set, get) => ({
  models: [],
  packages: [],
  status: "idle", // idle | loading | ready | error
  error: null,
  load: async () => {
    if (get().status === "loading" || get().status === "ready") return;
    set({ status: "loading", error: null });
    try {
      const [models, packages] = await Promise.all([api("/models"), api("/packages")]);
      set({ models, packages, status: "ready" });
    } catch (err) {
      set({ status: "error", error: err.message });
    }
  },
}));

export const modelBySlug = (models, slug) => models.find((m) => m.slug === slug);
