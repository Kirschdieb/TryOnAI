
// Hilfsfunktion: Stellt sicher, dass das "Generierte Bilder"-Album immer existiert und an erster Stelle steht
// Muss außerhalb des Store-Objekts stehen!
function ensureGeneratedAlbum(albums) {
  let generated = albums.find(a => a.id === 'generated');
  if (!generated) {
    generated = { id: 'generated', name: 'Generierte Bilder', images: [] };
  }
  const rest = albums.filter(a => a.id !== 'generated');
  return [generated, ...rest];
}

import { create } from 'zustand';

export const useCloset = create((set) => ({
  userPhoto: null,
  clothPhoto: null, // Photo used in the studio
  albums: [
    { id: 'generated', name: 'Generierte Bilder', images: [] },
    // Weitere Alben können vom User angelegt werden
  ],
  homeZalandoUrl: '', // Zalando URL from HomeUpload page
  homeClothPhotoUrl: null, // Cloth photo URL from HomeUpload page (extracted or uploaded)

  setUserPhoto: (p) => set({ userPhoto: p }),
  setClothPhoto: (p) => set({ clothPhoto: p }),




addAlbum: (name) => set((state) => ({
  albums: ensureGeneratedAlbum([
    ...state.albums,
    { id: Date.now().toString() + Math.random().toString(36).substr(2, 5), name, images: [] }
  ])
})),
renameAlbum: (albumId, newName) => set((state) => {
  if (albumId === 'generated') return {};
  return {
    albums: ensureGeneratedAlbum(state.albums.map(a => a.id === albumId ? { ...a, name: newName } : a))
  };
}),
deleteAlbum: (albumId) => set((state) => {
  if (albumId === 'generated') return {};
  return {
    albums: ensureGeneratedAlbum(state.albums.filter(a => a.id !== albumId))
  };
}),
addImageToAlbum: (albumId, image) => set((state) => ({
  albums: ensureGeneratedAlbum(state.albums.map(a => a.id === albumId ? { ...a, images: [...a.images, image] } : a))
})),
removeImageFromAlbum: (albumId, imageId) => set((state) => ({
  albums: ensureGeneratedAlbum(state.albums.map(a => a.id === albumId ? { ...a, images: a.images.filter(img => img.id !== imageId) } : a))
})),
addGeneratedImage: (image) => set((state) => ({
  albums: ensureGeneratedAlbum(state.albums.map(a => a.id === 'generated' ? { ...a, images: [{...image, id: Date.now().toString() + Math.random().toString(36).substr(2, 5)}, ...a.images] } : a))
})),

  setHomeZalandoUrl: (url) => set({ homeZalandoUrl: url }),
  setHomeClothPhotoUrl: (url) => set({ homeClothPhotoUrl: url }),

  reset: () => set({
    userPhoto: null,
    clothPhoto: null,
    albums: [
      { id: 'generated', name: 'Generierte Bilder', images: [] },
    ],
    homeZalandoUrl: '',
    homeClothPhotoUrl: null,
  }),
}));
