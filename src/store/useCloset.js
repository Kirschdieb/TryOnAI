// Simplified Closet Store - Focus on Essential Album & Profile Functionality
import { create } from 'zustand';

// Session-based image storage to avoid localStorage quota issues
// ⚠️ LIMITATION: Images are only available during the current browser session
// Try to recover images from sessionStorage on page reload/navigation
const sessionImages = new Map();

// Initialize session storage from sessionStorage API if available
try {
  const savedSessionData = sessionStorage.getItem('tryonai_session_images');
  if (savedSessionData) {
    const parsedData = JSON.parse(savedSessionData);
    Object.keys(parsedData).forEach(key => {
      sessionImages.set(key, parsedData[key]);
    });
    console.log(`[SessionStorage] Restored ${sessionImages.size} images from session storage`);
  }
} catch (error) {
  console.error('[SessionStorage] Failed to restore from sessionStorage:', error);
}

// Helper to persist session images to sessionStorage
const persistSessionImages = () => {
  try {
    // Convert Map to plain object for storage
    const sessionObject = {};
    sessionImages.forEach((value, key) => {
      sessionObject[key] = value;
    });
    sessionStorage.setItem('tryonai_session_images', JSON.stringify(sessionObject));
    console.log(`[SessionStorage] Persisted ${sessionImages.size} images to session storage`);
  } catch (error) {
    console.error('[SessionStorage] Failed to persist to sessionStorage:', error);
  }
};

// File system storage utilities
const ALBUMS_BASE_PATH = '/src/assets/albums';

// Helper to generate file system safe names
const sanitizeFileName = (str) => {
  return str.replace(/[^a-z0-9]/gi, '_').toLowerCase();
};

// Helper to get profile album directory
const getProfileAlbumPath = (profileId) => {
  return `${ALBUMS_BASE_PATH}/profile_${sanitizeFileName(profileId)}`;
};

// Helper to save image to file system
const saveImageToFS = async (profileId, albumId, imageId, imageData) => {
  try {
    const albumPath = `${getProfileAlbumPath(profileId)}/${sanitizeFileName(albumId)}`;
    const fileName = `${imageId}.png`;
    const filePath = `${albumPath}/${fileName}`;
    
    // Convert base64 to blob
    const response = await fetch(imageData);
    const blob = await response.blob();
    
    console.log(`[FS] Would save image to: ${filePath}`);
    // Note: Browser cannot directly write to file system
    // This would need a backend endpoint or file system API
    
    return filePath;
  } catch (error) {
    console.error('Failed to save image to file system:', error);
    return null;
  }
};

// Helper to load image from file system
const loadImageFromFS = async (profileId, albumId, imageId) => {
  try {
    const albumPath = `${getProfileAlbumPath(profileId)}/${sanitizeFileName(albumId)}`;
    const fileName = `${imageId}.png`;
    const filePath = `${albumPath}/${fileName}`;
    
    console.log(`[FS] Would load image from: ${filePath}`);
    // Note: Browser can import from assets if file exists
    const imageUrl = `${filePath}`;
    return imageUrl;
  } catch (error) {
    console.error('Failed to load image from file system:', error);
    return null;
  }
};

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
    description: 'Lockeres Sommer-Outfit',
    isExample: true,
    customLabel: 'Beispielfoto'
  },
  {
    id: 'sample10',
    image: Beispiel10,
    name: 'Sommer Style',
    category: 'sommer',
    description: 'Eleganter Sommer-Look',
    isExample: true,
    customLabel: 'Beispielfoto'
  },
  {
    id: 'sample11',
    image: Beispiel11,
    name: 'Sommer Casual',
    category: 'sommer',
    description: 'Entspannter Sommer-Stil',
    isExample: true,
    customLabel: 'Beispielfoto'
  },
  {
    id: 'sample12',
    image: Beispiel12,
    name: 'Sommer Trend',
    category: 'sommer',
    description: 'Modernes Sommer-Outfit',
    isExample: true,
    customLabel: 'Beispielfoto'
  },
  
  // Neue Bilder - Formal Kategorie (Download(2), Download(3), Download(4), Download(7))
  {
    id: 'sample13',
    image: Beispiel13,
    name: 'Formal Look 1',
    category: 'formal',
    description: 'Elegantes Business-Outfit',
    isExample: true,
    customLabel: 'Beispielfoto'
  },
  {
    id: 'sample14',
    image: Beispiel14,
    name: 'Formal Style',
    category: 'formal',
    description: 'Professioneller Look',
    isExample: true,
    customLabel: 'Beispielfoto'
  },
  {
    id: 'sample15',
    image: Beispiel15,
    name: 'Business Elegant',
    category: 'formal',
    description: 'Stilvolle Business-Garderobe',
    isExample: true,
    customLabel: 'Beispielfoto'
  },
  {
    id: 'sample16',
    image: Beispiel16,
    name: 'Office Look',
    category: 'formal',
    description: 'Modernes Office-Outfit',
    isExample: true,
    customLabel: 'Beispielfoto'
  },
  
  // Neue Bilder - Weitere Kategorien (Download(8) - Download(11))
  {
    id: 'sample17',
    image: Beispiel17,
    name: 'Frühling Look',
    category: 'fruehling',
    description: 'Frischer Frühlings-Stil',
    isExample: true,
    customLabel: 'Beispielfoto'
  },
  {
    id: 'sample18',
    image: Beispiel18,
    name: 'Casual Chic',
    category: 'casual',
    description: 'Schicker Casual-Look',
    isExample: true,
    customLabel: 'Beispielfoto'
  },
  {
    id: 'sample19',
    image: Beispiel19,
    name: 'Winter Cozy',
    category: 'winter',
    description: 'Gemütliches Winter-Outfit',
    isExample: true,
    customLabel: 'Beispielfoto'
  },
  {
    id: 'sample20',
    image: Beispiel20,
    name: 'Sport Active',
    category: 'sport',
    description: 'Aktives Sport-Outfit',
    isExample: true,
    customLabel: 'Beispielfoto'
  },
  {
    id: 'sample21',
    image: Beispiel21,
    name: 'Herbst Trend',
    category: 'herbst',
    description: 'Angesagter Herbst-Look',
    isExample: true,
    customLabel: 'Beispielfoto'
  }
];

// Default albums function
function getDefaultAlbums(language = 'de') {
  const albumTranslations = {
    de: {
      generated: 'Generierte Bilder',
      sommer: 'Sommer',
      herbst: 'Herbst',
      winter: 'Winter',
      fruehling: 'Frühling',
      formal: 'Formal',
      casual: 'Casual',
      sport: 'Sport'
    },
    en: {
      generated: 'Generated Images',
      sommer: 'Summer',
      herbst: 'Autumn',
      winter: 'Winter',
      fruehling: 'Spring',
      formal: 'Formal',
      casual: 'Casual',
      sport: 'Sport'
    }
  };

  const t = albumTranslations[language] || albumTranslations.de;

  // Create default albums with sample images
  const defaultAlbums = [
    { id: 'generated', name: t.generated, images: [] },
    { id: 'sommer', name: t.sommer, images: [] },
    { id: 'herbst', name: t.herbst, images: [] },
    { id: 'winter', name: t.winter, images: [] },
    { id: 'fruehling', name: t.fruehling, images: [] },
    { id: 'formal', name: t.formal, images: [] },
    { id: 'casual', name: t.casual, images: [] },
    { id: 'sport', name: t.sport, images: [] }
  ];

  // Process sample images with proper metadata
  const processedSampleImages = sampleImages.map(sample => ({
    ...sample,
    timestamp: sample.timestamp || FIXED_DATE,
    id: sample.id,
    createdAt: FIXED_DATE,
    hasSessionData: false, // Example images don't use session storage
    hasFileSystemData: true, // They are stored in the filesystem
    filePath: sample.image, // The imported image path
    type: 'example',
    metadata: {
      isExample: true,
      category: sample.category,
      timestamp: FIXED_DATE
    }
  }));

  // Add sample images to their categories
  processedSampleImages.forEach(sample => {
    const albumIndex = defaultAlbums.findIndex(album => album.id === sample.category);
    if (albumIndex !== -1) {
      defaultAlbums[albumIndex].images.push(sample);
    }
  });

  // IMPORTANT: Also add all example images to the generated album (master collection)
  defaultAlbums[0].images = [...processedSampleImages];
  
  console.log(`[getDefaultAlbums] Created ${defaultAlbums.length} albums with ${processedSampleImages.length} example images in generated album`);

  return defaultAlbums;
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
  selectedClothingItem: null,
  albums: getDefaultAlbums('de'),
  homeZalandoUrl: '',
  homeClothPhotoUrl: null,
  
  // Profile integration state
  currentProfileId: null,
  isAlbumDataLoaded: false,

  // Session management
  preserveSessionImages: true, // New flag to control session image preservation

  // Helper to ensure session images are preserved
  ensureSessionImages: () => {
    // Check if we have any images in sessionStorage
    try {
      const savedSessionData = sessionStorage.getItem('tryonai_session_images');
      if (savedSessionData) {
        const parsedData = JSON.parse(savedSessionData);
        Object.keys(parsedData).forEach(key => {
          if (!sessionImages.has(key)) {
            sessionImages.set(key, parsedData[key]);
            console.log(`[SessionStorage] Restored missing image ${key}`);
          }
        });
      }
    } catch (error) {
      console.error('[SessionStorage] Failed to restore images:', error);
    }
  },

  // Basic setters
  setUserPhoto: (p) => set({ userPhoto: p }),
  setClothPhoto: (p) => set({ clothPhoto: p }),
  setSelectedClothingItem: (item) => set({ selectedClothingItem: item }),
  setHomeZalandoUrl: (url) => set({ homeZalandoUrl: url }),
  setHomeClothPhotoUrl: (url) => set({ homeClothPhotoUrl: url }),

  // ESSENTIAL: Load albums from profile (with image restoration)
  loadAlbumsFromProfile: (profileData, preserveSessionImages = false) => {
    const { ensureSessionImages } = get();
    const profileAlbums = profileData.albums || [];
    const defaultAlbums = getDefaultAlbums('de');
    const profileId = profileData.id || 'default';
    
    console.log('[Profile] Loading albums from profile:', {
      profileId: profileId,
      albumCount: profileAlbums.length,
      preserveSessionImages: preserveSessionImages,
      totalImages: profileAlbums.reduce((sum, album) => sum + (album.images?.length || 0), 0)
    });

    // First ensure we have all our session images
    if (preserveSessionImages) {
      ensureSessionImages();
    }
    
    // Merge: default albums first, then add any custom albums
    const mergedAlbums = [
      ...defaultAlbums.map(defaultAlbum => {
        const existingAlbum = profileAlbums.find(a => a.id === defaultAlbum.id);
        return existingAlbum || defaultAlbum; // Keep existing if found, otherwise use default
      }),
      ...profileAlbums.filter(album => !defaultAlbums.some(da => da.id === album.id)) // Add custom albums
    ];

    // Store current session image count for logging
    const sessionImageCount = sessionImages.size;

    // Set the state first
    set({ 
      albums: ensureGeneratedAlbum(mergedAlbums), 
      currentProfileId: profileId,
      isAlbumDataLoaded: true,
      preserveSessionImages: preserveSessionImages // Update the preservation flag
    });

    // Log the final state
    console.log('[Profile] Albums loaded successfully:', {
      albumCount: mergedAlbums.length,
      sessionImages: sessionImageCount,
      preserveSessionImages: preserveSessionImages
    });

    // Always persist the current state of session images
    persistSessionImages();
  },

  // ESSENTIAL: Save albums to profile (with image preservation)
  saveAlbumsToProfile: () => {
    const { albums, currentProfileId, isAlbumDataLoaded } = get();
    
    console.log('saveAlbumsToProfile called:', { 
      currentProfileId, 
      isAlbumDataLoaded, 
      albumsCount: albums.length,
      sessionImagesCount: sessionImages.size,
      albums: albums.map(a => ({ id: a.id, name: a.name, imageCount: a.images.length }))
    });
    
    if (!isAlbumDataLoaded || !currentProfileId) {
      console.log('Cannot save albums: not loaded or no profile ID');
      return;
    }
    
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        
        // Create lightweight version of albums for localStorage (without large base64 images)
        const lightweightAlbums = albums.map(album => ({
          ...album,
          images: album.images.map(image => {
            console.log(`Processing image ${image.id} - hasSessionData: ${image.hasSessionData}, type: ${image.type}`);

            // Only save essential metadata, never large image data
            const lightImage = {
              id: image.id,
              createdAt: image.createdAt,
              timestamp: image.timestamp,
              customPrompt: image.customPrompt,
              type: image.type,
              hasSessionData: image.hasSessionData || false,
              hasFileSystemData: image.hasFileSystemData || false,
              filePath: image.filePath || null,
              metadata: {
                prompt: image.customPrompt,
                timestamp: image.timestamp
              }
            };

            // Only include URL if it's small and not a base64 image
            if (image.url && !image.url.startsWith('data:image') && image.url.length < 500) {
              lightImage.url = image.url;
            }

            console.log(`Light image for ${image.id}:`, { ...lightImage, metadata: 'exists' });
            return lightImage;
          })
        }));
        
        // Collect session images for profile storage (this enables cross-session persistence)
        const savedImages = {};
        for (const [imageId, imageData] of sessionImages.entries()) {
          savedImages[imageId] = imageData;
        }
        
        // Log the sizes before saving
        const profileString = JSON.stringify({
          ...profile, 
          albums: lightweightAlbums,
          savedImages: {}, // We'll save this separately to avoid quota issues
          lastModified: new Date().toISOString()
        });
        console.log(`Profile size (without images): ${profileString.length} characters`);
        console.log(`Session images to save: ${Object.keys(savedImages).length} images`);
        
        const updatedProfile = { 
          ...profile, 
          albums: lightweightAlbums,
          lastModified: new Date().toISOString()
        };
        
        // Save profile without images first (to avoid quota issues)
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        
        // Try to save images separately (with smart size checking)
        if (Object.keys(savedImages).length > 0) {
          try {
            const imagesString = JSON.stringify(savedImages);
            const imageSizeMB = imagesString.length / (1024 * 1024);
            
            console.log(`[Profile] Attempting to save ${Object.keys(savedImages).length} images (${imageSizeMB.toFixed(2)}MB) to localStorage`);
            
            // Only try to save if under 8MB (leaving buffer for other data)
            if (imageSizeMB < 8) {
              localStorage.setItem(`userProfile_images_${currentProfileId}`, imagesString);
              console.log(`[Profile] ✅ Successfully saved all ${Object.keys(savedImages).length} images to localStorage`);
            } else {
              console.log(`[Profile] ℹ️ Images too large (${imageSizeMB.toFixed(2)}MB) for localStorage. Images remain in session only.`);
              console.log(`[Profile] 💡 Tip: Use "Export Profile" to save all images permanently, then "Import Profile" to restore them later.`);
            }
          } catch (imageError) {
            // localStorage quota exceeded - this is NORMAL and EXPECTED for many images
            console.log(`[Profile] ℹ️ localStorage quota exceeded (this is normal with many images). Images are available during this session and can be exported via ZIP.`);
            console.log(`[Profile] 💡 Tip: Use "Export Profile" to save all images permanently, then "Import Profile" to restore them later.`);
            
            // Don't rethrow - this is expected behavior, not an error
          }
        }
        
        console.log('Albums saved to profile successfully (lightweight version)');
      } else {
        console.log('No saved profile found in localStorage');
      }
    } catch (error) {
      console.error('Failed to save albums to profile:', error);
      console.error('Profile data that failed to save:', albums.map(a => ({
        id: a.id, 
        name: a.name, 
        imageCount: a.images.length,
        images: a.images.map(img => ({
          id: img.id,
          hasLargeData: !!(img.image || img.userPhoto || img.clothPhoto),
          dataKeys: Object.keys(img)
        }))
      })));
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
    console.log('addImageToAlbum called:', { albumId, imageId: image.id, imageType: typeof image, hasImage: !!image.image }); // Debug log
    
    // Handle different image formats
    let imageToAdd;
    const imageId = image.id || Date.now().toString() + Math.random().toString(36).substr(2, 5);
    const { currentProfileId, albums } = get();
    
    // Check for duplicates in the target album
    const targetAlbum = albums.find(a => a.id === albumId);
    if (targetAlbum && targetAlbum.images.some(img => img.id === imageId)) {
      console.log(`[useCloset] Image ${imageId} already exists in album ${albumId}, skipping add`);
      return; // Skip adding if image already exists in this album
    }
    
    if (image.image) {
      // Generated image format from TryOnStudio
      // Store the actual image data in session storage (immediate availability)
      if (!sessionImages.has(imageId)) {
        sessionImages.set(imageId, {
          mainImage: image.image,
          userPhoto: image.userPhoto,
          clothPhoto: image.clothPhoto
        });
        // Persist to sessionStorage after adding new image
        persistSessionImages();
        console.log('[useCloset] Stored and persisted large image in session storage with ID:', imageId);
      }
      
      // Also save to file system for persistence (async)
      if (currentProfileId) {
        saveImageToFS(currentProfileId, albumId, imageId, image.image)
          .then(filePath => {
            if (filePath) {
              console.log(`[FS] Image saved to file system: ${filePath}`);
            }
          })
          .catch(err => console.error('[FS] Failed to save to file system:', err));
      }
      
      // CRITICAL: Only store lightweight metadata in albums (NO large data)
      imageToAdd = {
        id: imageId,
        customPrompt: image.customPrompt,
        timestamp: image.timestamp || new Date().toISOString(),
        createdAt: new Date().toISOString(),
        type: 'generated',
        hasSessionData: true, // Flag to indicate session data exists
        hasFileSystemData: true, // Flag to indicate file system storage
        filePath: currentProfileId ? `${getProfileAlbumPath(currentProfileId)}/${sanitizeFileName(albumId)}/${imageId}.png` : null,
        customLabel: image.customLabel || 'Anprobiertes Kleidungsstück',
        // Remove all large data properties - only metadata
        metadata: {
          prompt: image.customPrompt,
          timestamp: image.timestamp || new Date().toISOString()
        }
      };
    } else if (image.type === 'example' || image.isExample) {
      // Example image
      imageToAdd = {
        ...image,
        id: image.id,
        timestamp: image.timestamp || FIXED_DATE,
        createdAt: image.createdAt || FIXED_DATE,
        type: 'example',
        hasSessionData: false,
        hasFileSystemData: true,
        filePath: image.image, // The imported image path
        metadata: {
          isExample: true,
          category: image.category,
          timestamp: FIXED_DATE
        }
      };
    } else {
      // Simple image format (small images or URLs only)
      imageToAdd = {
        id: imageId,
        createdAt: new Date().toISOString(),
        metadata: image.metadata || {},
        customLabel: image.isExample ? 'Beispielfoto' : (image.customLabel || 'Anprobiertes Kleidungsstück'),
        // Only include URL if it's small and not base64
        ...(image.url && !image.url.startsWith('data:image') && image.url.length < 500 ? { url: image.url } : {})
      };
    }

    console.log('About to add image to album:', { imageId, albumId, imageToAddKeys: Object.keys(imageToAdd) });

    set((state) => {
      let updatedAlbums = ensureGeneratedAlbum(state.albums.map(a => 
        a.id === albumId 
          ? { ...a, images: [...a.images, imageToAdd] }
          : a
      ));

      // IMPORTANT: For generated images, also add to the 'generated' album if not already there
      if (imageToAdd.type === 'generated' && albumId !== 'generated') {
        const generatedAlbum = updatedAlbums.find(a => a.id === 'generated');
        
        // Check if image already exists in generated album
        const existsInGenerated = generatedAlbum && generatedAlbum.images.some(img => img.id === imageToAdd.id);
        
        if (!existsInGenerated) {
          console.log(`[useCloset] Adding generated image to 'generated' album as well`);
          updatedAlbums = updatedAlbums.map(a => 
            a.id === 'generated'
              ? { ...a, images: [...a.images, { ...imageToAdd }] }
              : a
          );
        } else {
          console.log(`[useCloset] Image ${imageToAdd.id} already exists in 'generated' album, skipping duplicate`);
        }
      }

      return { albums: updatedAlbums };
    });
    
    console.log('Image added to album, triggering save'); // Debug log
    setTimeout(() => get().saveAlbumsToProfile(), 0);
  },

  // Add missing function for generated images
  addGeneratedImage: (image) => {
    console.log('addGeneratedImage called:', { imageId: image.id }); // Debug log
    
    // Make sure image has an ID - use the one provided or generate a new one
    const imageId = image.id || Date.now().toString() + Math.random().toString(36).substr(2, 5);
    
    // First check if this image already exists in the generated album
    const { albums } = get();
    const generatedAlbum = albums.find(a => a.id === 'generated');
    
    // Check for duplicates by ID
    if (generatedAlbum) {
      const exists = generatedAlbum.images.some(img => img.id === imageId);
      if (exists) {
        console.log(`[useCloset] Image ${imageId} already exists in generated album, skipping duplicate add`);
        return; // Skip adding if already exists
      }
    }
    
    // Use the addImageToAlbum function to ensure consistent handling
    get().addImageToAlbum('generated', { ...image, id: imageId });
  },

  // Helper function to get image data from session storage or file system
  getSessionImage: (imageId) => {
    return sessionImages.get(imageId);
  },

  // Helper function to check if session image exists
  hasSessionImage: (imageId) => {
    return sessionImages.has(imageId);
  },

  // Helper function to get image from file system
  getImageFromFS: async (imageData) => {
    if (!imageData.hasFileSystemData || !imageData.filePath) return null;
    
    try {
      const response = await fetch(imageData.filePath);
      if (response.ok) {
        return imageData.filePath;
      }
    } catch (error) {
      console.log('[FS] Image not found in file system:', imageData.filePath);
    }
    return null;
  },

  // Helper function to get best available image source
  getBestImageSrc: async (imageData) => {
    // Priority: 1. Session storage, 2. File system, 3. None
    if (imageData.hasSessionData && sessionImages.has(imageData.id)) {
      const sessionData = sessionImages.get(imageData.id);
      return sessionData?.mainImage || null;
    }
    
    if (imageData.hasFileSystemData) {
      const fsImage = await get().getImageFromFS(imageData);
      if (fsImage) return fsImage;
    }
    
    return imageData.url || null;
  },

  removeImageFromAlbum: (albumId, imageId) => {
    set((state) => ({
      albums: ensureGeneratedAlbum(state.albums.map(a => 
        a.id === albumId 
          ? { ...a, images: a.images.filter(img => img.id !== imageId) }
          : a
      ))
    }));
    setTimeout(() => get().saveAlbumsToProfile(), 0);
  },

  deleteImageFromAllAlbums: (imageId) => {
    set((state) => ({
      albums: ensureGeneratedAlbum(state.albums.map(a => ({ ...a, images: a.images.filter(img => img.id !== imageId) })))
    }));
    setTimeout(() => get().saveAlbumsToProfile(), 0);
  },

  // Export profile with images as ZIP
  exportProfileWithImages: async () => {
    const { albums, currentProfileId } = get();
    
    try {
      // Import JSZip dynamically
      const JSZip = (await import('jszip')).default;
      const { saveAs } = await import('file-saver');
      
      const zip = new JSZip();
      
      // Prepare profile data
      const profileData = JSON.parse(localStorage.getItem('userProfile') || '{}');
      const exportData = {
        profile: profileData,
        albums: albums,
        version: '1.0',
        exportDate: new Date().toISOString()
      };
      
      // Add profile metadata to ZIP
      zip.file('profile.json', JSON.stringify(exportData, null, 2));
      
      // Create images folder in ZIP
      const imagesFolder = zip.folder('images');
      let imageCount = 0;
      
      // Collect all images from session storage
      for (const album of albums) {
        for (const image of album.images) {
          if (image.hasSessionData && sessionImages.has(image.id)) {
            const sessionData = sessionImages.get(image.id);

            // Save main image
            if (sessionData.mainImage) {
              const imageData = sessionData.mainImage.split(',')[1]; // Remove data:image/png;base64, prefix
              imagesFolder.file(`${image.id}_main.png`, imageData, { base64: true });
              imageCount++;
            }

            // Save user photo if available
            if (sessionData.userPhoto) {
              const userData = sessionData.userPhoto.split(',')[1];
              imagesFolder.file(`${image.id}_user.png`, userData, { base64: true });
            }

            // Save cloth photo if available
            if (sessionData.clothPhoto) {
              const clothData = sessionData.clothPhoto.split(',')[1];
              imagesFolder.file(`${image.id}_cloth.png`, clothData, { base64: true });
            }

            console.log(`[Export] Added image ${image.id} to ZIP`);
          }
        }
      }
      
      console.log('[Export] Prepared profile data with images:', {
        profileId: currentProfileId,
        albumCount: albums.length,
        imageCount: imageCount
      });
      
      // Generate ZIP file and trigger download
      const content = await zip.generateAsync({ type: 'blob' });
      const fileName = `tryonai_profile_${currentProfileId || 'export'}_${new Date().toISOString().split('T')[0]}.zip`;
      saveAs(content, fileName);
      
      console.log(`[Export] Successfully exported profile as ${fileName}`);
      return { success: true, fileName, imageCount };
    } catch (error) {
      console.error('[Export] Failed to export profile with images:', error);
      throw error;
    }
  },

  // Import profile with images from ZIP
  importProfileWithImages: async (zipFile) => {
    try {
      // Import JSZip dynamically
      const JSZip = (await import('jszip')).default;
      
      // Load and parse ZIP file
      const zip = await JSZip.loadAsync(zipFile);
      
      // Extract profile data
      const profileFile = zip.file('profile.json');
      if (!profileFile) {
        throw new Error('Invalid profile ZIP: profile.json not found');
      }
      
      const profileJsonString = await profileFile.async('string');
      const { profile, albums, version } = JSON.parse(profileJsonString);
      
      console.log('[Import] Loading profile from ZIP:', {
        profileId: profile.id,
        version: version,
        albumCount: albums.length
      });
      
      // Clear current session images
      sessionImages.clear();
      
      // Extract and restore images
      const imagesFolder = zip.folder('images');
      let restoredImageCount = 0;
      
      if (imagesFolder) {
        for (const [relativePath, zipObject] of Object.entries(imagesFolder.files)) {
          if (!zipObject.dir && relativePath.endsWith('.png')) {
            const fileName = relativePath.split('/').pop();
            const [imageId, type] = fileName.replace('.png', '').split('_');

            // Initialize image data structure if it doesn't exist
            if (!sessionImages.has(imageId)) {
              sessionImages.set(imageId, {});
            }

            const imageData = sessionImages.get(imageId);
            const base64Data = await zipObject.async('base64');
            const dataUrl = `data:image/png;base64,${base64Data}`;

            // Store based on image type
            if (type === 'main') {
              imageData.mainImage = dataUrl;
              restoredImageCount++;
            } else if (type === 'user') {
              imageData.userPhoto = dataUrl;
            } else if (type === 'cloth') {
              imageData.clothPhoto = dataUrl;
            }

            console.log(`[Import] Restored image ${imageId}_${type}`);
          }
        }
      }
      
      // Update albums and profile in store
      const mergedAlbums = albums || [];
      set({ 
        albums: ensureGeneratedAlbum(mergedAlbums), 
        currentProfileId: profile.id || 'imported',
        isAlbumDataLoaded: true 
      });
      
      // Save to localStorage
      localStorage.setItem('userProfile', JSON.stringify(profile));
      
      // Also save images to localStorage for persistence
      if (sessionImages.size > 0) {
        const imagesToSave = {};
        for (const [imageId, imageData] of sessionImages.entries()) {
          imagesToSave[imageId] = imageData;
        }
        
        try {
          localStorage.setItem(`userProfile_images_${profile.id}`, JSON.stringify(imagesToSave));
          console.log(`[Import] Also saved ${Object.keys(imagesToSave).length} images to localStorage`);
        } catch (error) {
          console.warn('[Import] Could not save images to localStorage (quota exceeded), images will be session-only');
        }
      }
      
      console.log('[Import] Successfully restored profile with images:', {
        profileId: profile.id,
        albumCount: mergedAlbums.length,
        imageCount: restoredImageCount
      });
      
      return { 
        success: true, 
        profile: profile, 
        albumCount: mergedAlbums.length, 
        imageCount: restoredImageCount 
      };
    } catch (error) {
      console.error('[Import] Failed to import profile with images:', error);
      throw error;
    }
  },

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

  // Reset function with image cleanup
  reset: () => {
    // Clear session images when resetting
    sessionImages.clear();
    console.log('[Reset] Cleared all session images');
    
    set({
      userPhoto: null,
      clothPhoto: null,
      selectedClothingItem: null,
      albums: getDefaultAlbums('de'),
      homeZalandoUrl: '',
      homeClothPhotoUrl: null,
      currentProfileId: null,
      isAlbumDataLoaded: false,
    });
  },

  // Helper function to clear old profile images from localStorage
  clearOldProfileImages: (currentProfileId) => {
    try {
      // Get all localStorage keys
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('userProfile_images_') && !key.includes(currentProfileId)) {
          keysToRemove.push(key);
        }
      }
      
      // Remove old profile image data
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log(`[Cleanup] Removed old profile images: ${key}`);
      });
      
      return keysToRemove.length;
    } catch (error) {
      console.error('[Cleanup] Error clearing old profile images:', error);
      return 0;
    }
  },

  // Helper function to reset albums to default state (useful for debugging)
  resetAlbumsToDefault: () => {
    console.log('[Reset] Resetting albums to default state...');
    const defaultAlbums = getDefaultAlbums('de');
    set({ albums: ensureGeneratedAlbum(defaultAlbums) });
    console.log('[Reset] Albums reset to default with', defaultAlbums[0].images.length, 'example images in generated album');
  },

  // Helper function to get image label for UI display
  updateImageLabel: (imageId, newLabel) => {
    set((state) => ({
      albums: state.albums.map(album => ({
        ...album,
        images: album.images.map(img => 
          img.id === imageId 
            ? { ...img, customLabel: newLabel }
            : img
        )
      }))
    }));
    setTimeout(() => get().saveAlbumsToProfile(), 0);
  },
}));
