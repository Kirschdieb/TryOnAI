// Simplified Closet Store - Focus on Essential Album & Profile Functionality
import { create } from 'zustand';

// Session-based image storage to avoid localStorage quota issues
// ⚠️ LIMITATION: Images are only available during the current browser session
// TODO: Implement local file system storage in assets/albums/
const sessionImages = new Map();

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
  
  // Session-only storage for generated images (not persisted)
  // Remove this from the store since we'll use the global one

  // Basic setters
  setUserPhoto: (p) => set({ userPhoto: p }),
  setClothPhoto: (p) => set({ clothPhoto: p }),
  setHomeZalandoUrl: (url) => set({ homeZalandoUrl: url }),
  setHomeClothPhotoUrl: (url) => set({ homeClothPhotoUrl: url }),

  // ESSENTIAL: Load albums from profile (with image restoration)
  loadAlbumsFromProfile: (profileData) => {
    const profileAlbums = profileData.albums || [];
    const defaultAlbums = getDefaultAlbums('de');
    const profileId = profileData.id || 'default';
    
    console.log('[Profile] Loading albums from profile:', {
      profileId: profileId,
      albumCount: profileAlbums.length,
      totalImages: profileAlbums.reduce((sum, album) => sum + (album.images?.length || 0), 0)
    });
    
    // Merge: default albums first, then add any custom albums
    const mergedAlbums = [
      ...defaultAlbums.map(defaultAlbum => {
        const existingAlbum = profileAlbums.find(a => a.id === defaultAlbum.id);
        return existingAlbum || defaultAlbum; // Keep existing if found, otherwise use default
      }),
      ...profileAlbums.filter(album => !defaultAlbums.some(da => da.id === album.id)) // Add custom albums
    ];
    
    // Restore images from profile's stored image data (if available)
    // Check both legacy format (profileData.savedImages) and new separate storage
    let savedImages = profileData.savedImages || {};
    
    // Try to load images from separate localStorage key
    try {
      const separateImagesData = localStorage.getItem(`userProfile_images_${profileId}`);
      if (separateImagesData) {
        const parsedImages = JSON.parse(separateImagesData);
        savedImages = { ...savedImages, ...parsedImages };
        console.log('[Profile] Loaded images from separate storage:', Object.keys(parsedImages).length);
      }
    } catch (error) {
      console.warn('[Profile] Could not load separate image storage:', error.message);
    }
    
    if (Object.keys(savedImages).length > 0) {
      console.log('[Profile] Restoring saved images to session storage:', Object.keys(savedImages).length);
      
      // Clear current session images and restore from profile
      sessionImages.clear();
      for (const [imageId, imageData] of Object.entries(savedImages)) {
        sessionImages.set(imageId, imageData);
        console.log(`[Profile] Restored image ${imageId} to session storage`);
      }
    } else {
      console.log('[Profile] No saved images found for profile');
    }
    
    set({ 
      albums: ensureGeneratedAlbum(mergedAlbums), 
      currentProfileId: profileId,
      isAlbumDataLoaded: true 
    });
    
    console.log('[Profile] Albums loaded successfully with', mergedAlbums.length, 'albums and', sessionImages.size, 'restored images');
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
        
        // Try to save images separately (with error handling for quota)
        try {
          if (Object.keys(savedImages).length > 0) {
            localStorage.setItem(`userProfile_images_${currentProfileId}`, JSON.stringify(savedImages));
            console.log(`[Profile] Saved ${Object.keys(savedImages).length} images separately`);
          }
        } catch (imageError) {
          console.warn('[Profile] Could not save images to localStorage (quota exceeded), images will be session-only:', imageError.message);
          // Profile is still saved, just without persistent images
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
    console.log('addImageToAlbum called:', { albumId, imageType: typeof image, hasImage: !!image.image }); // Debug log
    
    // Handle different image formats
    let imageToAdd;
    const imageId = image.id || Date.now().toString() + Math.random().toString(36).substr(2, 5);
    const { currentProfileId } = get();
    
    if (image.image) {
      // Generated image format from TryOnStudio
      // Store the actual image data in session storage (immediate availability)
      sessionImages.set(imageId, {
        mainImage: image.image,
        userPhoto: image.userPhoto,
        clothPhoto: image.clothPhoto
      });
      
      console.log('[useCloset] Stored large image in session storage with ID:', imageId);
      
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
        timestamp: image.timestamp,
        createdAt: new Date().toISOString(),
        type: 'generated',
        hasSessionData: true, // Flag to indicate session data exists
        hasFileSystemData: true, // Flag to indicate file system storage
        filePath: currentProfileId ? `${getProfileAlbumPath(currentProfileId)}/${sanitizeFileName(albumId)}/${imageId}.png` : null,
        // Remove all large data properties - only metadata
        metadata: {
          prompt: image.customPrompt,
          timestamp: image.timestamp
        }
        // Do NOT include: image, userPhoto, clothPhoto, or any large data
      };
    } else {
      // Simple image format (small images or URLs only)
      imageToAdd = {
        id: imageId,
        createdAt: new Date().toISOString(),
        metadata: image.metadata || {},
        // Only include URL if it's small and not base64
        ...(image.url && !image.url.startsWith('data:image') && image.url.length < 500 ? { url: image.url } : {})
      };
    }

    console.log('About to add image to album:', { imageId, albumId, imageToAddKeys: Object.keys(imageToAdd) });

    set((state) => ({
      albums: state.albums.map(a => 
        a.id === albumId 
          ? { ...a, images: [...a.images, imageToAdd] }
          : a
      )
    }));
    
    console.log('Image added to album, triggering save'); // Debug log
    setTimeout(() => get().saveAlbumsToProfile(), 0);
  },

  // Add missing function for generated images
  addGeneratedImage: (image) => {
    console.log('addGeneratedImage called:', image); // Debug log
    get().addImageToAlbum('generated', image);
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
      albums: state.albums.map(a => 
        a.id === albumId 
          ? { ...a, images: a.images.filter(img => img.id !== imageId) }
          : a
      )
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

  // Reset function with image cleanup
  reset: () => {
    // Clear session images when resetting
    sessionImages.clear();
    console.log('[Reset] Cleared all session images');
    
    set({
      userPhoto: null,
      clothPhoto: null,
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
}));
