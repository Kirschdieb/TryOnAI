
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

// Funktion zum Erstellen der Standard-Alben basierend auf der Sprache
function getDefaultAlbums(language = 'de') {
  const albumTranslations = {
    de: {
      generated: 'Generierte Bilder',
      summer: 'Sommer',
      autumn: 'Herbst',
      winter: 'Winter',
      spring: 'Frühling',
      formal: 'Formal & Business',
      casual: 'Casual & Alltag',
      sport: 'Sport & Fitness'
    },
    en: {
      generated: 'Generated Pictures',
      summer: 'Summer',
      autumn: 'Autumn',
      winter: 'Winter',
      spring: 'Spring',
      formal: 'Formal & Business',
      casual: 'Casual & Everyday',
      sport: 'Sport & Fitness'
    }
  };

  const t = albumTranslations[language] || albumTranslations.de;
  
  return [
    { id: 'generated', name: t.generated, images: [] },
    { id: 'sommer', name: t.summer, images: [] },
    { id: 'herbst', name: t.autumn, images: [] },
    { id: 'winter', name: t.winter, images: [] },
    { id: 'fruehling', name: t.spring, images: [] },
    { id: 'formal', name: t.formal, images: [] },
    { id: 'casual', name: t.casual, images: [] },
    { id: 'sport', name: t.sport, images: [] },
  ];
}

import { create } from 'zustand';

export const useCloset = create((set, get) => ({
  userPhoto: null,
  clothPhoto: null, // Photo used in the studio
  albums: getDefaultAlbums('de'), // Standardmäßig deutsche Alben
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
deleteImageFromAllAlbums: (imageId) => set((state) => ({
  albums: ensureGeneratedAlbum(state.albums.map(a => ({ ...a, images: a.images.filter(img => img.id !== imageId) })))
})),
addGeneratedImage: (image) => set((state) => ({
  albums: ensureGeneratedAlbum(state.albums.map(a => a.id === 'generated' ? { ...a, images: [{...image, id: Date.now().toString() + Math.random().toString(36).substr(2, 5)}, ...a.images] } : a))
})),

// Funktion zum Aktualisieren der Album-Namen basierend auf der Sprache
updateAlbumLanguage: (language) => set((state) => {
  const defaultAlbums = getDefaultAlbums(language);
  const updatedAlbums = state.albums.map(album => {
    const defaultAlbum = defaultAlbums.find(da => da.id === album.id);
    if (defaultAlbum && ['generated', 'sommer', 'herbst', 'winter', 'fruehling', 'formal', 'casual', 'sport'].includes(album.id)) {
      return { ...album, name: defaultAlbum.name };
    }
    return album;
  });
  return { albums: ensureGeneratedAlbum(updatedAlbums) };
}),

  setHomeZalandoUrl: (url) => set({ homeZalandoUrl: url }),
  setHomeClothPhotoUrl: (url) => set({ homeClothPhotoUrl: url }),

  reset: () => set({
    userPhoto: null,
    clothPhoto: null,
    albums: getDefaultAlbums('de'),
    homeZalandoUrl: '',
    homeClothPhotoUrl: null,
  }),
}));
