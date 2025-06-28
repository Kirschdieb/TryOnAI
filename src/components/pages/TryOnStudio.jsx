import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCloset } from '../../store/useCloset';
import { useLanguage } from '../../contexts/LanguageContext';
import Button from '../ui/Button';
import Card from '../ui/Card';

// LoadingSpinner Komponente
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-lavender"></div>
    </div>
  );
}


export default function TryOnStudio() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { userPhoto, clothPhoto, addOutfit } = useCloset(); // userPhoto is now a File object or null
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [extractedClothImage, setExtractedClothImage] = useState(null);
  const [isExtractingCloth, setIsExtractingCloth] = useState(false);
  const [extractError, setExtractError] = useState(null);
  const [userPhotoPreviewUrl, setUserPhotoPreviewUrl] = useState(null);
  const [showSaved, setShowSaved] = useState(false);

  // Effect to create and revoke blob URL for userPhoto preview if it's a File object
  useEffect(() => {
    if (userPhoto instanceof File) {
      const previewUrl = URL.createObjectURL(userPhoto);
      setUserPhotoPreviewUrl(previewUrl);
      return () => URL.revokeObjectURL(previewUrl); // Cleanup
    } else if (typeof userPhoto === 'string') {
      setUserPhotoPreviewUrl(userPhoto); // It might be a URL string in some cases (though current flow is File)
    } else {
      setUserPhotoPreviewUrl(null);
    }
  }, [userPhoto]);

  // Redirect if no photos
  if (!userPhoto || !clothPhoto) {
    navigate('/');
    return null;
  }

  const extractClothImage = async () => {
    const isZalandoLink = clothPhoto && /^https?:\/\/(www\.)?zalando\./i.test(clothPhoto);
    if (isZalandoLink) {
      setIsExtractingCloth(true);
      setExtractError(null);
      try {
        const res = await fetch(`http://localhost:3001/api/extract?url=${encodeURIComponent(clothPhoto)}`);
        if (!res.ok) throw new Error(`Extraction failed (${res.status})`);
        const data = await res.json();
        if (data.imageUrl) setExtractedClothImage(data.imageUrl);
        else throw new Error(data.error || 'No image found');
      } catch (err) {
        setExtractError(err.message);
      } finally {
        setIsExtractingCloth(false);
      }
    } else {
      setExtractedClothImage(clothPhoto);
    }
  };

  useEffect(() => {
    extractClothImage();
  }, [clothPhoto]);

  // Speichert das aktuelle Try-On Ergebnis im Closet
  const saveToCloset = () => {
    if (!result) return;
    addOutfit({
      userPhoto: userPhotoPreviewUrl,
      clothPhoto: extractedClothImage,
      image: result, // für Closet
      customPrompt: customPrompt,
      timestamp: new Date().toISOString(), // für Closet
    });
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const generateTryOn = async () => {
    setIsGenerating(true);
    setResult(null);
    if (!userPhoto) {
      alert(t('home.pleaseUpload'));
      setIsGenerating(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append('customPrompt', customPrompt);
      formData.append('userPhoto', userPhoto); // userPhoto is a File object
      const clothImageSource = extractedClothImage || clothPhoto;
      if (clothImageSource) {
        formData.append('clothImageUrl', clothImageSource);
      } else {
        alert(t('home.pleaseProvide'));
        setIsGenerating(false);
        return;
      }
      const response = await fetch('http://localhost:3001/api/tryon', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData && errorData.text) {
          alert(t('home.error') + ' ' + errorData.text);
        } else {
          throw new Error(t('home.generationFailed'));
        }
        return;
      }
      const data = await response.json();
      setResult(data.imageUrl);
      // Speichere Try-On in Closet
      addOutfit({
        userPhoto: userPhotoPreviewUrl,
        clothPhoto: extractedClothImage,
        resultImageUrl: data.imageUrl,
        customPrompt: customPrompt,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      alert(t('home.error') + ' ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Snackbar/Toast für Bestätigung */}
      {showSaved && (
        <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-all animate-fade-in">
          <span className="font-semibold">{t('studio.savedToCloset')}</span>
        </div>
      )}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Column 1: Your Photo */}
        <Card className="md:self-start">
          <h2 className="text-xl font-semibold mb-4">{t('studio.yourPhoto')}</h2>
          <div className="relative">
            <img
              src={userPhotoPreviewUrl || 'https://via.placeholder.com/300x400.png?text=Your+Photo'}
              alt="Your photo"
              className="w-full h-auto object-contain rounded-lg block"
            />
          </div>
        </Card>
        {/* Column 2: Clothing Item */}
        <Card className="md:self-start">
          <h2 className="text-xl font-semibold mb-4">{t('studio.clothingItem')}</h2>
          <div className="relative">
            {isExtractingCloth ? (
              <div className="w-full h-auto aspect-[3/4] bg-cream-200 rounded-lg animate-pulse"></div>
            ) : extractError ? (
              <div className="w-full h-auto aspect-[3/4] bg-cream-200 rounded-lg flex items-center justify-center">
                <p className="text-red-500">{extractError}</p>
              </div>
            ) : (
              extractedClothImage && (
                <img
                  src={extractedClothImage}
                  alt="Clothing"
                  className="w-full h-auto object-contain rounded-lg block"
                />
              )
            )}
          </div>
        </Card>
        {/* Column 3: Generation Area (Result & Customization stacked) */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-semibold mb-4">{t('studio.result')}</h2>
            <div className="relative h-[500px]">
              {isGenerating ? (
                <div className="absolute inset-0 bg-cream-200 rounded-lg flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              ) : result ? (
                <div className="relative h-full">
                  <img
                    src={result}
                    alt="Generated result"
                    className="w-full h-full object-contain rounded-lg"
                  />
                  <Button
                    onClick={saveToCloset}
                    className="absolute top-2 right-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                  >
                    {t('studio.saveToCloset')}
                  </Button>
                </div>
              ) : (
                <div className="absolute inset-0 bg-cream-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">{t('studio.clickGenerate')}</p>
                </div>
              )}
            </div>
          </Card>
          <Card>
            <h2 className="text-xl font-semibold mb-4">{t('studio.customization')}</h2>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder={t('studio.customPrompt')}
              className="w-full p-3 border border-cream-300 rounded-lg resize-none h-32 focus:outline-none focus:ring-2 focus:ring-lavender"
            />
            <Button
              onClick={generateTryOn}
              disabled={isGenerating}
              className="w-full mt-4"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                  {t('studio.generating')}
                </span>
              ) : (
                t('home.generateButton')
              )}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
