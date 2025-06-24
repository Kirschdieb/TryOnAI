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
  
  // Local state for inputs, initialized from store and synced back to store
  const [localClothPhotoUrl, setLocalClothPhotoUrl] = useState(storeClothPhotoUrl);
  const [localZalandoUrl, setLocalZalandoUrl] = useState(storeZalandoUrl);  // Check clipboard on component mount - prevent showing popup for the same URL multiple times
  useEffect(() => {
    const checkClipboard = async () => {
      try {
        const clipboardText = await navigator.clipboard.readText();
        // Check if clipboard contains any URL (not just Zalando)
        const urlPattern = /^https?:\/\/.+/i;
        if (clipboardText && urlPattern.test(clipboardText.trim())) {
          // Check if we've already shown popup for this URL in this session
          const lastPromptedUrl = sessionStorage.getItem('lastPromptedUrl');
          if (lastPromptedUrl === clipboardText.trim()) {
            return; // Don't show popup for the same URL again
          }
          
          // Mark this URL as prompted before showing the popup
          sessionStorage.setItem('lastPromptedUrl', clipboardText.trim());
          
          const shouldUse = window.confirm(t('home.clipboardPrompt') + '\n\n' + clipboardText);
          if (shouldUse) {
            setLocalZalandoUrl(clipboardText.trim());
            setHomeZalandoUrl(clipboardText.trim());
          }
        }
      } catch (error) {
        // Clipboard access might be denied, ignore silently
        console.log('Clipboard access not available');
      }
    };

    checkClipboard();
  }, [t, setHomeZalandoUrl]);

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

  const isValid = (userPhotoFile && (localClothPhotoUrl || localZalandoUrl.startsWith('https://www.zalando.')));

  const extractZalandoImage = async () => {
    if (!localZalandoUrl) return; // Use localZalandoUrl
    setIsExtracting(true);
    setExtractError(null);
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
        Virtual Try-On Experience
      </h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* User Photo Upload */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">1. Upload Your Photo</h2>
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
          <h2 className="text-xl font-semibold mb-4">2. Choose Clothing</h2>
          
          {/* Zalando URL Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paste Zalando URL
            </label>
            <input
              type="url"
              value={localZalandoUrl} // Use localZalandoUrl
              onChange={(e) => { // Update local and store state
                const newUrl = e.target.value;
                setLocalZalandoUrl(newUrl);
                setHomeZalandoUrl(newUrl); // Update store
              }}
              pattern="https://www.zalando."
              placeholder="https://www.zalando.de/..."
              className="w-full p-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender"
            />
            <Button
              onClick={extractZalandoImage}
              disabled={!localZalandoUrl || isExtracting} // Use localZalandoUrl
              className="mt-2"
            >
              {isExtracting ? 'Extracting...' : 'Extract Product Image'}
            </Button>
            {extractError && <p className="text-sm text-red-600 mt-1">{extractError}</p>}
          </div>

          <div className="relative">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
              <div className="border-t border-cream-300"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-cream-100 px-2 text-sm text-gray-500">OR</span>
              </div>
            </div>
          </div>

          {/* Direct Upload */}
          <div className="mt-6">
            <div className="relative aspect-[3/4] mb-4">
              <DropZone
                onFileSelect={(url) => { // Assuming DropZone provides a URL directly; update local and store state
                  setLocalClothPhotoUrl(url);
                  setHomeClothPhotoUrl(url); // Update store
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
          Try On
        </Button>
      </div>
    </div>
  );
}
