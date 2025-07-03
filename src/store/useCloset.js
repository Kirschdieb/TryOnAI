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
import Beispiel9 from '../assets/Beispiel9.png';
import Beispiel10 from '../assets/Beispiel10.png';
import Beispiel11 from '../assets/Beispiel11.png';
import Beispiel12 from '../assets/Beispiel12.png';
import Beispiel13 from '../assets/Beispiel13.png';
import Beispiel14 from '../assets/Beispiel14.png';
import Beispiel15 from '../assets/Beispiel15.png';
import Beispiel16 from '../assets/Beispiel16.png';
import Beispiel17 from '../assets/Beispiel17.png';
import Beispiel18 from '../assets/Beispiel18.png';
import Beispiel19 from '../assets/Beispiel19.png';
import Beispiel20 from '../assets/Beispiel20.png';
import Beispiel21 from '../assets/Beispiel21.png';

// Fallback-Datum wenn kein Datum vorhanden ist (1. Juli 2025)
const FIXED_DATE = new Date("2025-07-01").toISOString();

// Beispielbilder-Daten
const sampleImages = [
  // Original Beispielbilder mit isExample flag
  {
    id: 'sample1',
    image: Beispiel1,
    name: 'Herbst Outfit 1',
    category: 'herbst',
    description: 'Gemütlicher Herbstlook',
    isExample: true,
    customLabel: 'Beispielfoto'
    // Kein Timestamp - wird bei Bedarf durch das Fallback-Datum ersetzt
  },
  {
    id: 'sample2',
    image: Beispiel2,
    name: 'Herbst Style',
    category: 'herbst',
    description: 'Eleganter Herbstlook',
    isExample: true,
    customLabel: 'Beispielfoto'
  },
  {
    id: 'sample3',
    image: Beispiel3,
    name: 'Casual Style',
    category: 'casual',
    description: 'Entspannter Alltagslook',
    isExample: true,
    customLabel: 'Beispielfoto'
  },
  {
    id: 'sample4',
    image: Beispiel4,
    name: 'Sommer Look',
    category: 'sommer',
    description: 'Leichtes Sommer-Outfit',
    isExample: true,
    customLabel: 'Beispielfoto'
  },
  {
    id: 'sample5',
    image: Beispiel5,
    name: 'Sport Outfit',
    category: 'sport',
    description: 'Sportliche Trainingskleidung',
    isExample: true,
    customLabel: 'Beispielfoto'
  },
  {
    id: 'sample6',
    image: Beispiel6,
    name: 'Fitness Look',
    category: 'sport',
    description: 'Modernes Fitness-Outfit',
    isExample: true,
    customLabel: 'Beispielfoto'
  },
  {
    id: 'sample7',
    image: Beispiel7,
    name: 'Business Look',
    category: 'formal',
    description: 'Professionelles Business-Outfit',
    isExample: true,
    customLabel: 'Beispielfoto'
  },
  {
    id: 'sample8',
    image: Beispiel8,
    name: 'Winter Style',
    category: 'winter',
    description: 'Warmer Winter-Look',
    isExample: true,
    customLabel: 'Beispielfoto'
  },
  
  // Neue Bilder - Sommer Kategorie (Download, Download(1), Download(5), Download(6))
  {
    id: 'sample9',
    image: Beispiel9,
    name: 'Sommer Look 2',
    category: 'sommer',
    description: 'Leichtes Sommer-Outfit',
    timestamp: new Date("2025-07-01T18:41:00").toISOString(), // Download.png - Originaldatum
    isExample: true,
    customLabel: 'Beispielfoto'
  },
  {
    id: 'sample10',
    image: Beispiel10,
    name: 'Sommer Style',
    category: 'sommer',
    description: 'Frisches Sommer-Outfit',
    timestamp: new Date("2025-07-01T19:00:00").toISOString(), // Download (1).png - Originaldatum
    isExample: true,
    customLabel: 'Beispielfoto'
  },
  {
    id: 'sample11',
    image: Beispiel11,
    name: 'Sommer Casual',
    category: 'sommer',
    description: 'Lässiger Sommerlook',
    timestamp: new Date("2025-07-01T23:01:00").toISOString(), // Download (5).png - Originaldatum
    isExample: true,
    customLabel: 'Beispielfoto'
  },
  {
    id: 'sample12',
    image: Beispiel12,
    name: 'Sommer Trend',
    category: 'sommer',
    description: 'Moderner Sommertrend',
    timestamp: new Date("2025-07-01T23:26:00").toISOString(), // Download (6).png - Originaldatum
    isExample: true,
    customLabel: 'Beispielfoto'
  },
  
  // Neue Bilder - Winter Kategorie (Download(15), Download(18), Download(20), Download(3), Download(19))
  {
    id: 'sample13',
    image: Beispiel13,
    name: 'Winter Look 2',
    category: 'winter',
    description: 'Warmer Winterlook',
    timestamp: new Date("2025-07-02T23:05:00").toISOString(), // Download (15).png - Originaldatum
    isExample: true,
    customLabel: 'Beispielfoto'
  },
  {
    id: 'sample14',
    image: Beispiel14,
    name: 'Winter Style 2',
    category: 'winter',
    description: 'Elegantes Winter-Outfit',
    timestamp: new Date("2025-07-03T12:13:00").toISOString(), // Download (18).png - Originaldatum
    isExample: true,
    customLabel: 'Beispielfoto'
  },
  {
    id: 'sample15',
    image: Beispiel15,
    name: 'Winter Modern',
    category: 'winter',
    description: 'Moderner Winterlook',
    timestamp: new Date("2025-07-03T13:03:00").toISOString(), // Download (20).png - Originaldatum
    isExample: true,
    customLabel: 'Beispielfoto'
  },
  {
    id: 'sample16',
    image: Beispiel16,
    name: 'Winter Casual',
    category: 'winter',
    description: 'Lässiger Winterlook',
    timestamp: new Date("2025-07-01T22:20:00").toISOString(), // Download (3).png - Originaldatum
    isExample: true,
    customLabel: 'Beispielfoto'
  },
  {
    id: 'sample17',
    image: Beispiel17,
    name: 'Winter Trend',
    category: 'winter',
    description: 'Trendiger Winterlook',
    timestamp: new Date("2025-07-03T13:03:00").toISOString(), // Download (19).png - Originaldatum
    isExample: true,
    customLabel: 'Beispielfoto'
  },
  
  // Neue Bilder - Herbst Kategorie (Rest)
  {
    id: 'sample18',
    image: Beispiel18,
    name: 'Herbst Casual',
    category: 'herbst',
    description: 'Lässiger Herbstlook',
    timestamp: new Date("2025-07-01T20:34:00").toISOString(), // Download (2).png - Originaldatum
    isExample: true,
    customLabel: 'Beispielfoto'
  },
  {
    id: 'sample19',
    image: Beispiel19,
    name: 'Herbst Modern',
    category: 'herbst',
    description: 'Moderner Herbstlook',
    timestamp: new Date("2025-07-01T22:57:00").toISOString(), // Download (4).png - Originaldatum
    isExample: true,
    customLabel: 'Beispielfoto'
  },
  {
    id: 'sample20',
    image: Beispiel20,
    name: 'Herbst Trend',
    category: 'herbst',
    description: 'Trendiger Herbstlook',
    timestamp: new Date("2025-07-01T23:39:00").toISOString(), // Download (7).png - Originaldatum
    isExample: true,
    customLabel: 'Beispielfoto'
  },
  {
    id: 'sample21',
    image: Beispiel21,
    name: 'Herbst Style 2',
    category: 'herbst',
    description: 'Eleganter Herbstlook',
    timestamp: new Date("2025-07-02T18:18:00").toISOString(), // Download (14).png - Originaldatum
    isExample: true,
    customLabel: 'Beispielfoto'
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
  albums: ensureGeneratedAlbum(state.albums.map(a => a.id === albumId ? { 
    ...a, 
    images: [...a.images, {
      ...image,
      customLabel: image.isExample ? 'Beispielfoto' : (image.customLabel || 'Anprobiertes Kleidungsstück')
    }] 
  } : a))
})),
removeImageFromAlbum: (albumId, imageId) => set((state) => ({
  albums: ensureGeneratedAlbum(state.albums.map(a => a.id === albumId ? { ...a, images: a.images.filter(img => img.id !== imageId) } : a))
})),
deleteImageFromAllAlbums: (imageId) => set((state) => ({
  albums: ensureGeneratedAlbum(state.albums.map(a => ({ ...a, images: a.images.filter(img => img.id !== imageId) })))
})),
addGeneratedImage: (image) => set((state) => ({
  albums: ensureGeneratedAlbum(state.albums.map(a => a.id === 'generated' ? { 
    ...a, 
    images: [
      {
        ...image, 
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        // Only use fixed date if no timestamp exists
        timestamp: image.timestamp || FIXED_DATE,
        // Set default label for generated images
        customLabel: 'Anprobiertes Kleidungsstück'
      }, 
      ...a.images
    ] 
  } : a))
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

  updateImageLabel: (imageId, newLabel) => set((state) => ({
    albums: ensureGeneratedAlbum(state.albums.map(album => ({
      ...album,
      images: album.images.map(img => 
        img.id === imageId 
          ? { ...img, customLabel: newLabel }
          : img
      )
    })))
  })),

  reset: () => set({
    userPhoto: null,
    clothPhoto: null,
    albums: getDefaultAlbums('de'),
    homeZalandoUrl: '',
    homeClothPhotoUrl: null,
  }),
}));
