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

// Import der Beispielbilder
import Beispiel1 from '../assets/Beispiel1.png';
import Beispiel2 from '../assets/Beispiel2.png';
import Beispiel3 from '../assets/Beispiel3.png';
import Beispiel4 from '../assets/Beispiel4.png';
import Beispiel5 from '../assets/Beispiel5.png';
import Beispiel6 from '../assets/Beispiel6.png';
import Beispiel7 from '../assets/Beispiel7.png';
import Beispiel8 from '../assets/Beispiel8.png';

// Beispielbilder-Daten
const sampleImages = [
  {
    id: 'sample1',
    image: Beispiel1,
    name: 'Herbst Outfit 1',
    category: 'herbst',
    description: 'Gemütlicher Herbstlook'
  },
  {
    id: 'sample2',
    image: Beispiel2,
    name: 'Herbst Style',
    category: 'herbst',
    description: 'Eleganter Herbstlook'
  },
  {
    id: 'sample3',
    image: Beispiel3,
    name: 'Casual Style',
    category: 'casual',
    description: 'Entspannter Alltagslook'
  },
  {
    id: 'sample4',
    image: Beispiel4,
    name: 'Sommer Look',
    category: 'sommer',
    description: 'Leichtes Sommer-Outfit'
  },
  {
    id: 'sample5',
    image: Beispiel5,
    name: 'Sport Outfit',
    category: 'sport',
    description: 'Sportliche Trainingskleidung'
  },
  {
    id: 'sample6',
    image: Beispiel6,
    name: 'Fitness Look',
    category: 'sport',
    description: 'Modernes Fitness-Outfit'
  },
  {
    id: 'sample7',
    image: Beispiel7,
    name: 'Business Look',
    category: 'formal',
    description: 'Professionelles Business-Outfit'
  },
  {
    id: 'sample8',
    image: Beispiel8,
    name: 'Winter Style',
    category: 'winter',
    description: 'Warmer Winter-Look'
  }
];

// Funktion zum Erstellen der Standard-Alben basierend auf der Sprache
function getDefaultAlbums(language = 'de') {
  const albumTranslations = {
    de: {
      generated: 'Generierte Bilder',
      summer: 'Sommer',
      autumn: 'Herbst',
      winter: 'Winter',
      formal: 'Formal & Business',
      casual: 'Casual & Alltag',
      sport: 'Sport & Fitness'
    },
    en: {
      generated: 'Generated Pictures',
      summer: 'Summer',
      autumn: 'Autumn',
      winter: 'Winter',
      formal: 'Formal & Business',
      casual: 'Casual & Everyday',
      sport: 'Sport & Fitness'
    }
  };

  const t = albumTranslations[language] || albumTranslations.de;
  
  const albums = [
    { id: 'generated', name: t.generated, images: [] }, // Leere Alben beim Start
    { id: 'sommer', name: t.summer, images: [] },
    { id: 'herbst', name: t.autumn, images: [] },
    { id: 'winter', name: t.winter, images: [] },
    { id: 'formal', name: t.formal, images: [] },
    { id: 'casual', name: t.casual, images: [] },
    { id: 'sport', name: t.sport, images: [] },
  ];

  return albums;
}

import { create } from 'zustand';

export const useCloset = create((set, get) => ({
  userPhoto: null,
  clothPhoto: null, // Photo used in the studio
  selectedClothingItem: null, // Current selected clothing item with product info
  albums: getDefaultAlbums('de'), // Standardmäßig deutsche Alben
  homeZalandoUrl: '', // Zalando URL from HomeUpload page
  homeClothPhotoUrl: null, // Cloth photo URL from HomeUpload page (extracted or uploaded)

  setUserPhoto: (p) => set({ userPhoto: p }),
  setClothPhoto: (p) => set({ clothPhoto: p }),
  setSelectedClothingItem: (item) => set({ selectedClothingItem: item }),




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
    if (defaultAlbum && ['generated', 'sommer', 'herbst', 'winter', 'formal', 'casual', 'sport'].includes(album.id)) {
      // Prüfe ob Beispielbilder bereits vorhanden sind
      const hasSampleImages = album.images.some(img => img.id && img.id.startsWith('sample'));
      if (!hasSampleImages && defaultAlbum.images.length > 0) {
        // Füge Beispielbilder hinzu, wenn sie noch nicht vorhanden sind
        return { ...album, name: defaultAlbum.name, images: [...album.images, ...defaultAlbum.images] };
      }
      return { ...album, name: defaultAlbum.name };
    }
    return album;
  });
  return { albums: ensureGeneratedAlbum(updatedAlbums) };
}),

// Funktion zum einmaligen Hinzufügen von Beispielbildern zu bestehenden Alben
initializeSampleImages: () => set((state) => {
  const hasSampleImages = state.albums.some(album => 
    album.images.some(img => img.id && img.id.startsWith('sample'))
  );
  
  if (!hasSampleImages) {
    const updatedAlbums = state.albums.map(album => {
      // Füge Beispielbilder zu "Generierte Bilder" hinzu
      if (album.id === 'generated') {
        return { ...album, images: [...album.images, ...sampleImages] };
      }
      
      // Füge passende Beispielbilder zu Kategorie-Alben hinzu
      const categoryImages = sampleImages.filter(img => img.category === album.id);
      if (categoryImages.length > 0) {
        return { ...album, images: [...album.images, ...categoryImages] };
      }
      
      return album;
    });
    return { albums: ensureGeneratedAlbum(updatedAlbums) };
  }
  
  return state;
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
