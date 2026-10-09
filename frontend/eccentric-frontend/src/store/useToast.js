import { create } from "zustand";

let timer;
export const useToast = create((set, get) => ({
  toast: null, // { text, kind }
  show: (text, kind = "info", ms = 4000) => {
    clearTimeout(timer);
    set({ toast: { text, kind } });
    if (ms) timer = setTimeout(() => set({ toast: null }), ms);
  },
  hide: (kind) => {
    if (!kind || get().toast?.kind === kind) set({ toast: null });
  },
}));
