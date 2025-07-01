// Simplified Closet Store - Focus on Essential Album & Profile Functionality
import { create } from 'zustand';

// Default albums function
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

// Utility function to ensure generated album exists and is first
function ensureGeneratedAlbum(albums) {
  let generated = albums.find(a => a.id === 'generated');
  if (!generated) {
    generated = { id: 'generated', name: 'Generierte Bilder', images: [] };
  }
  const rest = albums.filter(a => a.id !== 'generated');
  return [generated, ...rest];
}

export const useCloset = create((set, get) => ({
  // Core state
  userPhoto: null,
  clothPhoto: null,
  albums: getDefaultAlbums('de'),
  homeZalandoUrl: '',
  homeClothPhotoUrl: null,
  
  // Profile integration state
  currentProfileId: null,
  isAlbumDataLoaded: false,

  // Basic setters
  setUserPhoto: (p) => set({ userPhoto: p }),
  setClothPhoto: (p) => set({ clothPhoto: p }),
  setHomeZalandoUrl: (url) => set({ homeZalandoUrl: url }),
  setHomeClothPhotoUrl: (url) => set({ homeClothPhotoUrl: url }),

  // ESSENTIAL: Load albums from profile (simplified)
  loadAlbumsFromProfile: (profileData) => {
    const profileAlbums = profileData.albums || [];
    const defaultAlbums = getDefaultAlbums('de');
    
    // Merge: default albums first, then add any custom albums
    const mergedAlbums = [
      ...defaultAlbums.map(defaultAlbum => {
        const existingAlbum = profileAlbums.find(a => a.id === defaultAlbum.id);
        return existingAlbum || defaultAlbum; // Keep existing if found, otherwise use default
      }),
      ...profileAlbums.filter(album => !defaultAlbums.some(da => da.id === album.id)) // Add custom albums
    ];
    
    set({ 
      albums: ensureGeneratedAlbum(mergedAlbums), 
      currentProfileId: profileData.id || 'default',
      isAlbumDataLoaded: true 
    });
  },

  // ESSENTIAL: Save albums to profile (simplified)
  saveAlbumsToProfile: () => {
    const { albums, currentProfileId, isAlbumDataLoaded } = get();
    
    if (!isAlbumDataLoaded || !currentProfileId) {
      return;
    }
    
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        const updatedProfile = { 
          ...profile, 
          albums,
          lastModified: new Date().toISOString()
        };
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      }
    } catch (error) {
      console.error('Failed to save albums to profile:', error);
    }
  },

  // Album management with auto-save
  addAlbum: (name) => {
    set((state) => ({
      albums: [
        ...state.albums,
        { 
          id: Date.now().toString() + Math.random().toString(36).substr(2, 5), 
          name, 
          images: [],
          createdAt: new Date().toISOString()
        }
      ]
    }));
    // Auto-save after state update
    setTimeout(() => get().saveAlbumsToProfile(), 0);
  },

  renameAlbum: (albumId, newName) => {
    if (albumId === 'generated') return; // Cannot rename generated album
    
    set((state) => ({
      albums: state.albums.map(a => a.id === albumId ? { ...a, name: newName } : a)
    }));
    setTimeout(() => get().saveAlbumsToProfile(), 0);
  },

  deleteAlbum: (albumId) => {
    if (albumId === 'generated') return; // Cannot delete generated album
    
    set((state) => ({
      albums: state.albums.filter(a => a.id !== albumId)
    }));
    setTimeout(() => get().saveAlbumsToProfile(), 0);
  },

  addImageToAlbum: (albumId, image) => {
    // Create simple image object with just URL and basic metadata
    const imageToAdd = {
      id: image.id || Date.now().toString() + Math.random().toString(36).substr(2, 5),
      url: image.url || image,
      createdAt: new Date().toISOString(),
      metadata: image.metadata || {}
    };

    set((state) => ({
      albums: state.albums.map(a => 
        a.id === albumId 
          ? { ...a, images: [...a.images, imageToAdd] }
          : a
      )
    }));
    setTimeout(() => get().saveAlbumsToProfile(), 0);
  },

  removeImageFromAlbum: (albumId, imageId) => {
    set((state) => ({
      albums: state.albums.map(a => 
        a.id === albumId 
          ? { ...a, images: a.images.filter(img => img.id !== imageId) }
          : a
      )
    }));
    setTimeout(() => get().saveAlbumsToProfile(), 0);
  },

  // Reset function
  reset: () => set({
    userPhoto: null,
    clothPhoto: null,
    albums: getDefaultAlbums('de'),
    homeZalandoUrl: '',
    homeClothPhotoUrl: null,
    currentProfileId: null,
    isAlbumDataLoaded: false,
  }),
}));
