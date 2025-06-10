import { create } from 'zustand';

export const useCloset = create((set) => ({
  userPhoto: null,
  clothPhoto: null, // Photo used in the studio
  outfits: [],
  homeZalandoUrl: '', // Zalando URL from HomeUpload page
  homeClothPhotoUrl: null, // Cloth photo URL from HomeUpload page (extracted or uploaded)

  setUserPhoto: (p) => set({ userPhoto: p }),
  setClothPhoto: (p) => set({ clothPhoto: p }), // Sets the cloth photo for the studio
  addOutfit: (o) => set((state) => ({ outfits: [...state.outfits, o] })),
  
  setHomeZalandoUrl: (url) => set({ homeZalandoUrl: url }),
  setHomeClothPhotoUrl: (url) => set({ homeClothPhotoUrl: url }),

  reset: () => set({
    userPhoto: null,
    clothPhoto: null,
    outfits: [],
    homeZalandoUrl: '',
    homeClothPhotoUrl: null,
  }),
}));
