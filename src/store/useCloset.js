import { create } from 'zustand';

export const useCloset = create((set) => ({
  userPhoto: null,
  clothPhoto: null,
  outfits: [],
  setUserPhoto: (p) => set({ userPhoto: p }),
  setClothPhoto: (p) => set({ clothPhoto: p }),
  addOutfit: (o) => set((state) => ({ outfits: [...state.outfits, o] })),
  reset: () => set({ userPhoto: null, clothPhoto: null }),
}));
