import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCloset } from '../../store/useCloset';
import { useLanguage } from '../../contexts/LanguageContext';
import { FaInfoCircle } from 'react-icons/fa';
import Button from '../ui/Button';
import Card from '../ui/Card';
import DropZone from '../ui/DropZone';

// Custom Tooltip component
const Tooltip = ({ children }) => (
  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
    {children}
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 border-4 border-transparent border-t-gray-800"></div>
  </div>
);

export default function HomeUpload() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const {
    homeZalandoUrl: storeZalandoUrl,
    homeClothPhotoUrl: storeClothPhotoUrl,
    setUserPhoto,
    setClothPhoto, // For studio
    setHomeZalandoUrl,
    setHomeClothPhotoUrl,
  } = useCloset();
  const [userPhotoFile, setUserPhotoFile] = useState(null); // Stores the File object
  const [userPhotoPreviewUrl, setUserPhotoPreviewUrl] = useState(null); // For image preview
  
  // Cloth photo file state for direct upload
  const [clothPhotoFile, setClothPhotoFile] = useState(null);
  
  // Local state for inputs, initialized from store and synced back to store
  const [localClothPhotoUrl, setLocalClothPhotoUrl] = useState(storeClothPhotoUrl);
  const [localZalandoUrl, setLocalZalandoUrl] = useState(storeZalandoUrl);
  // Clipboard-Check entfernt, stattdessen Button unten
  const handlePasteFromClipboard = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      const urlPattern = /^https?:\/\/.+/i;
      if (clipboardText && urlPattern.test(clipboardText.trim())) {
        setLocalZalandoUrl(clipboardText.trim());
        setHomeZalandoUrl(clipboardText.trim());
      } else {
        alert(t('home.error') + ' ' + t('home.zalandoPlaceholder'));
      }
    } catch (error) {
      alert(t('home.error') + ' Clipboard not available');
    }
  };

  // Effect to update local state if store changes (e.g., browser back/forward or initial load)
  useEffect(() => {
    // Ensure we don't set local state to undefined if store is not fully initialized yet,
    // though Zustand usually provides initial values.
    if (storeZalandoUrl !== undefined) {
        setLocalZalandoUrl(storeZalandoUrl);
    }
  }, [storeZalandoUrl]);

  useEffect(() => {
    if (storeClothPhotoUrl !== undefined) {
        setLocalClothPhotoUrl(storeClothPhotoUrl);
    }
  }, [storeClothPhotoUrl]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState(null);

  const handleTryOn = async () => {
    // Convert File to base64 for storage to avoid blob URL issues
    let userPhotoToStore = userPhotoFile;
    if (userPhotoFile && userPhotoFile instanceof File) {
      try {
        userPhotoToStore = await convertFileToBase64(userPhotoFile);
      } catch (error) {
        console.error('Error converting user photo to base64 for storage:', error);
        // Fallback to File object if conversion fails
        userPhotoToStore = userPhotoFile;
      }
    }
    
    setUserPhoto(userPhotoToStore); // Store base64 or File object to the store for /studio
    // Use local state (synced with store) for cloth photo decision
    setClothPhoto(localClothPhotoUrl || localZalandoUrl); // Set cloth photo for /studio

    // Only clear homeClothPhotoUrl, but preserve homeZalandoUrl if it's a Zalando URL
    // This preserves the original Zalando URL for product info extraction in the studio
    if (localZalandoUrl && /^https?:\/\/(www\.)?zalando\./i.test(localZalandoUrl)) {
      // Keep the original Zalando URL for product info extraction
      setHomeZalandoUrl(localZalandoUrl);
    } else {
      // Clear it if it's not a Zalando URL
      setHomeZalandoUrl('');
    }
    setHomeClothPhotoUrl(null);

    navigate('/studio');
  };

  // Utility function to convert file to base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Effect to create base64 preview for user photo
  useEffect(() => {
    const convertUserPhoto = async () => {
      if (userPhotoFile) {
        try {
          const base64 = await convertFileToBase64(userPhotoFile);
          setUserPhotoPreviewUrl(base64);
        } catch (error) {
          console.error('Error converting user photo to base64:', error);
          setUserPhotoPreviewUrl(null);
        }
      } else {
        setUserPhotoPreviewUrl(null);
      }
    };
    convertUserPhoto();
  }, [userPhotoFile]);

  // Effect to create base64 for cloth photo file
  useEffect(() => {
    const convertClothPhoto = async () => {
      if (clothPhotoFile) {
        try {
          const base64 = await convertFileToBase64(clothPhotoFile);
          setLocalClothPhotoUrl(base64);
          setHomeClothPhotoUrl(base64);
        } catch (error) {
          console.error('Error converting cloth photo to base64:', error);
          setLocalClothPhotoUrl(null);
          setHomeClothPhotoUrl(null);
        }
      }
    };
    convertClothPhoto();
  }, [clothPhotoFile, setHomeClothPhotoUrl]);

  const isValid = (userPhotoFile && (localClothPhotoUrl || localZalandoUrl.startsWith('https://www.zalando.')));

  const extractZalandoImage = async () => {
    if (!localZalandoUrl) return; // Use localZalandoUrl
    setIsExtracting(true);
    setExtractError(null);
    // Cloth File zurücksetzen wenn Zalando URL verwendet wird
    setClothPhotoFile(null);
    try {
      const res = await fetch(`http://localhost:3001/api/extract?url=${encodeURIComponent(localZalandoUrl)}`); // Use localZalandoUrl
      if (!res.ok) throw new Error(`Extraction failed (${res.status})`);
      const data = await res.json();
      if (data.imageUrl) {
        setLocalClothPhotoUrl(data.imageUrl);
        setHomeClothPhotoUrl(data.imageUrl); // Update store
      } else {
        throw new Error(data.error || 'No image found');
      }
    } catch (err) {
      setExtractError(err.message);
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Decorative curved elements - small and corner-only */}
      
      {/* Top left curved element */}
      <div
        className="fixed top-0 left-0 w-80 h-80 -translate-x-20 -translate-y-20 -z-10"
        style={{
          background: 'linear-gradient(135deg, #7f3ffb 0%, #e14eca 100%)',
          borderRadius: '0 0 100% 0',
          transform: 'translate(-25%, -25%)',
        }}
        aria-hidden="true"
      />
      
      {/* Bottom right curved element */}
      <div
        className="fixed bottom-0 right-0 w-96 h-96 translate-x-24 translate-y-24 -z-10"
        style={{
          background: 'linear-gradient(315deg, #7f3ffb 0%, #e14eca 100%)',
          borderRadius: '100% 0 0 0',
          transform: 'translate(25%, 25%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-700 mb-4">
            {t('home.virtualTryOn')}
          </h1>
          <p className="text-xl text-purple-600 max-w-3xl mx-auto">
            {t('home.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
        {/* User Photo Upload */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">{t('home.uploadYourPhoto')}</h2>
          <div className="relative aspect-[3/4] mb-4">
            <DropZone
              onFileSelect={setUserPhotoFile} // setUserPhotoFile will receive the File object
              className="w-full h-full"
            />
            {userPhotoPreviewUrl && (
              <div className="absolute inset-0 pointer-events-none">
                <img
                  src={userPhotoPreviewUrl} // Use the blob URL for preview
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </Card>

        {/* Clothing Upload */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold">{t('home.chooseClothing')}</h2>
            <div className="relative group">
              <FaInfoCircle className="text-purple-600 cursor-help" />
              <Tooltip>
                {t('studio.clothingExtractionTip')}
              </Tooltip>
            </div>
          </div>
          
          {/* Single clothing image box - FIRST */}
          <div className="relative aspect-[3/4] mb-6">
            <DropZone
              onFileSelect={(file) => {
                setClothPhotoFile(file);
                // Zalando URL zurücksetzen wenn File hochgeladen wird
                setLocalZalandoUrl('');
                setHomeZalandoUrl('');
              }}
              className="w-full h-full"
            />
            {localClothPhotoUrl && (
              <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
                <img
                  src={localClothPhotoUrl}
                  alt="Clothing preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">{t('home.or')}</span>
            </div>
          </div>

          {/* Zalando URL Input - AFTER ODER */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              {t('home.pasteZalandoUrl')}
            </label>
            <div className="flex gap-3">
              <input
                type="url"
                value={localZalandoUrl}
                onChange={(e) => {
                  const newUrl = e.target.value;
                  setLocalZalandoUrl(newUrl);
                  setHomeZalandoUrl(newUrl);
                }}
                pattern="https://www.zalando."
                placeholder={t('home.zalandoPlaceholder')}
                className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handlePasteFromClipboard}
                title="Aus Zwischenablage einfügen"
                className="px-4 py-3 border-gray-200 hover:border-purple-300 hover:bg-purple-50"
              >
                📋
              </Button>
            </div>
            <Button
              onClick={extractZalandoImage}
              disabled={!localZalandoUrl || isExtracting}
              className="mt-3 w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-xl transition-all duration-200"
            >
              {isExtracting ? t('home.extracting') : t('home.extractImage')}
            </Button>
            {extractError && <p className="text-sm text-red-500 mt-2 font-medium">{extractError}</p>}
          </div>
        </Card>
      </div>

      {/* Try On Button */}
      <div className="mt-12 text-center">
        <Button
          onClick={handleTryOn}
          disabled={!isValid}
          className="w-full md:w-auto px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('home.tryOn')}
        </Button>
      </div>
      </div>
    </div>
  );
}
