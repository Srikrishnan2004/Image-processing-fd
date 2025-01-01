import { create } from "zustand";

const simpleStore = create((set) => ({
  open: false,
  image: null,
  fileName: null,
  histogramImage: null,
  fusionFrameworkImage: null,
  selectedImage: null,
  loadingHistogram: false,
  loadingFusionFramework: false,
  setOpen: (value) => set(() => ({ open: value })),
  setLoadingHistogram: (value) => set(() => ({ loadingHistogram: value })),
  setLoadingFusionFramework: (value) =>
    set(() => ({ loadingFusionFramework: value })),
  setFileName: (value) => set(() => ({ fileName: value })),
  setImage: (value) => set(() => ({ image: value })),
  setHistogramImage: (value) => set(() => ({ histogramImage: value })),
  setFusionFrameworkImage: (value) =>
    set(() => ({ fusionFrameworkImage: value })),
  setSelectedImage: (value) => set(() => ({ selectedImage: value })),
}));

export default simpleStore;
