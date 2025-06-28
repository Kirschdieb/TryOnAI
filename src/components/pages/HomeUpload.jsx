import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCloset } from '../../store/useCloset';
import { useLanguage } from '../../contexts/LanguageContext';
import Button from '../ui/Button';
import Card from '../ui/Card';
import DropZone from '../ui/DropZone';

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

  const handleTryOn = () => {
    setUserPhoto(userPhotoFile); // Pass the File object to the store for /studio
    // Use local state (synced with store) for cloth photo decision
    setClothPhoto(localClothPhotoUrl || localZalandoUrl); // Set cloth photo for /studio

    // Clear the home page specific inputs from the store after they've been used for the studio
    setHomeZalandoUrl('');
    setHomeClothPhotoUrl(null);

    navigate('/studio');
  };

  // Effect to create and revoke blob URL for preview
  useEffect(() => {
    if (userPhotoFile) {
      const previewUrl = URL.createObjectURL(userPhotoFile);
      setUserPhotoPreviewUrl(previewUrl);
      return () => URL.revokeObjectURL(previewUrl); // Cleanup
    } else {
      setUserPhotoPreviewUrl(null);
    }
  }, [userPhotoFile]);

  // Effect to create and revoke blob URL for cloth photo file preview
  useEffect(() => {
    if (clothPhotoFile) {
      const previewUrl = URL.createObjectURL(clothPhotoFile);
      setLocalClothPhotoUrl(previewUrl);
      setHomeClothPhotoUrl(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    }
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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">
        {t('home.virtualTryOn')}
      </h1>
      
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
          <h2 className="text-xl font-semibold mb-4">{t('home.chooseClothing')}</h2>
          
          {/* Zalando URL Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('home.pasteZalandoUrl')}
            </label>
            <div className="flex gap-2">
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
                className="w-full p-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handlePasteFromClipboard}
                title="Aus Zwischenablage einfügen"
              >
                📋
              </Button>
            </div>
            <Button
              onClick={extractZalandoImage}
              disabled={!localZalandoUrl || isExtracting}
              className="mt-2"
            >
              {isExtracting ? t('home.extracting') : t('home.extractImage')}
            </Button>
            {extractError && <p className="text-sm text-red-600 mt-1">{extractError}</p>}
          </div>

          <div className="relative">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
              <div className="border-t border-cream-300"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-cream-100 px-2 text-sm text-gray-500">{t('home.or')}</span>
              </div>
            </div>
          </div>

          {/* Direct Upload */}
          <div className="mt-6">
            <div className="relative aspect-[3/4] mb-4">
              <DropZone
                onFileSelect={(file) => {
                  setClothPhotoFile(file);
                  // Zalando URL zurücksetzen wenn File hochgeladen wird
                  setLocalZalandoUrl('');
                  setHomeZalandoUrl('');
                }}
                className="w-full h-full"
              />
              {localClothPhotoUrl && ( // Use localClothPhotoUrl for condition
                <div className="absolute inset-0 pointer-events-none">
                  <img
                    src={localClothPhotoUrl} // Use localClothPhotoUrl for src
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Try On Button */}
      <div className="mt-8 text-center">
        <Button
          onClick={handleTryOn}
          disabled={!isValid}
          className="w-full md:w-auto"
        >
          {t('home.tryOn')}
        </Button>
      </div>
    </div>
  );
}
