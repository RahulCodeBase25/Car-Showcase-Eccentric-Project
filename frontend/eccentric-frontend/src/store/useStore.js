import { create } from "zustand";

const useStore = create(set => ({
  models: [],
  setModels: (data) => set({ models: data })
}));

export default useStore;
