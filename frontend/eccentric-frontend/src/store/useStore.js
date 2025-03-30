import { create } from 'zustand';

const useStore = create((set) => ({
  selectedModel: null,
  selectedColor: null,
  selectedFeatures: [],

  setModel: (model) => set({ selectedModel: model }),
  setColor: (color) => set({ selectedColor: color }),
  toggleFeature: (feature) =>
    set((state) => {
      const features = state.selectedFeatures.includes(feature)
        ? state.selectedFeatures.filter((f) => f !== feature)
        : [...state.selectedFeatures, feature];
      return { selectedFeatures: features };
    }),
}));

export default useStore;
