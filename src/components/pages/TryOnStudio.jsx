import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCloset } from '../../store/useCloset';
import { useLanguage } from '../../contexts/LanguageContext';
import { FaUpload, FaTrash, FaPlus, FaCheck, FaInfoCircle } from 'react-icons/fa';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { BeachIcon, RainIcon, SnowIcon, OriginalIcon, EmptyIcon, StandingIcon, SittingIcon, HandsInPocketsIcon, ArmsCrossedIcon } from '../ui/BackgroundIcon';

// LoadingSpinner Komponente
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-lavender"></div>
    </div>
  );
}

// Custom Tooltip component
const Tooltip = ({ children }) => (
  <div className="absolute bottom-full right-0 mb-2 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 w-max max-w-[2400px]">
    <div className="inline-block">
      {children}
    </div>
    <div className="absolute bottom-0 right-4 transform translate-y-1 border-4 border-transparent border-t-gray-800"></div>
  </div>
);

// Format fit information with proper line breaks and styling
const formatFitInfo = (fitText) => {
  if (!fitText) return '';

  // Pattern for identifying the start of new points (Passform:, Modelgröße:, etc.)
  const keywordPattern = /(Passform|Modelgröße|Schnitt|Länge|Ärmellänge|trägt Größe|Regular Fit|Slim Fit|Loose Fit|Dehnbarkeit):/gi;
  
  // Replace pipe separators with spaces (from backend joining)
  let formattedText = fitText.replace(/\s*\|\s*/g, ' ');
  
  // Add line breaks before each new point
  formattedText = formattedText.replace(keywordPattern, '\n$&');
  
  // Remove duplicate Passform headers that might appear at the beginning
  formattedText = formattedText.replace(/^Passform\s+Passform/i, 'Passform');
  
  // Remove the standalone "Passform" header at the beginning
  formattedText = formattedText.replace(/^Passform\s*\n/i, '');
  
  // Trim extra spaces and line breaks
  return formattedText.trim();
};

// Product Info Dialog Component
const ProductInfoDialog = ({ isOpen, onClose, productInfo, isLoading, isZalandoProduct, originalProductUrl, onFetchProductInfo }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h2 className="text-2xl font-semibold mb-4">Passform Informationen</h2>
        <div className="prose">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : productInfo ? (
            <div className="space-y-4">
              {/* Titel und Marke */}
              {productInfo.brand && (
                <h3 className="text-xl font-medium">{productInfo.brand}</h3>
              )}
              {productInfo.name && (
                <p className="text-lg">{productInfo.name}</p>
              )}
              
              {/* Passforminformationen */}
              {productInfo.fit && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="whitespace-pre-line">{formatFitInfo(productInfo.fit)}</p>
                </div>
              )}
              
              
              
              {/* Link zum Produkt */}
              {productInfo.url && (
                <div className="mt-6">
                  <a 
                    href={productInfo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-700 underline"
                  >
                    Zum Produkt bei Zalando →
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-500">
              <p className="mb-4">
                {isZalandoProduct 
                  ? "Produktinformationen für dieses Zalando-Produkt konnten nicht geladen werden."
                  : "Keine Produktinformationen verfügbar. Dies ist kein Zalando-Produkt."
                }
              </p>
              {isZalandoProduct && originalProductUrl && onFetchProductInfo && (
                <button
                  onClick={() => onFetchProductInfo(originalProductUrl)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? 'Lädt...' : 'Produktinformationen laden'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Studio = () => {
  const { t } = useLanguage();
  const [isProductInfoOpen, setIsProductInfoOpen] = useState(false);
  const [productInfo, setProductInfo] = useState(null);
  const [isLoadingProductInfo, setIsLoadingProductInfo] = useState(false);
  const [originalProductUrl, setOriginalProductUrl] = useState(null); // Store original Zalando URL
  const [isZalandoProduct, setIsZalandoProduct] = useState(false); // Track if this is a Zalando product
  // Pose-Optionen
  const [selectedPose, setSelectedPose] = useState('standing');
  const poseOptions = [
    { value: 'standing', label: t('studio.pose.standing'), icon: <StandingIcon /> },
    { value: 'sitting', label: t('studio.pose.sitting'), icon: <SittingIcon /> },
    { value: 'pockets', label: t('studio.pose.pockets'), icon: <HandsInPocketsIcon /> },
    { value: 'armscrossed', label: t('studio.pose.armscrossed'), icon: <ArmsCrossedIcon /> },
  ];
  const navigate = useNavigate();
  const { userPhoto, clothPhoto, selectedClothingItem, albums, addGeneratedImage, addImageToAlbum, homeZalandoUrl, setHomeZalandoUrl } = useCloset();
  const [customPrompt, setCustomPrompt] = useState('');
  const [fullGeneratedPrompt, setFullGeneratedPrompt] = useState(''); // Store the complete prompt sent to server
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [extractedClothImage, setExtractedClothImage] = useState(null);
  const [isExtractingCloth, setIsExtractingCloth] = useState(false);
  const [extractError, setExtractError] = useState(null);
  const [userPhotoPreviewUrl, setUserPhotoPreviewUrl] = useState(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveDisabled, setSaveDisabled] = useState(false);
  const [resultAspect, setResultAspect] = useState({ width: 3, height: 4 });
  // Hintergrundauswahl
  const [selectedBackground, setSelectedBackground] = useState('original');
  // Bildqualität
  const [imageQuality, setImageQuality] = useState('medium');

  // Bildqualität-Optionen
  const qualityOptions = [
    { value: 'low', label: t('studio.qualityLow') },
    { value: 'medium', label: t('studio.qualityMedium') },
    { value: 'high', label: t('studio.qualityHigh') },
  ];

  // Hintergrundoptionen
  const backgroundOptions = [
    { value: 'original', label: t('studio.background.original'), icon: <OriginalIcon /> },
    { value: 'empty', label: t('studio.background.empty'), icon: <EmptyIcon /> },
    { value: 'summer', label: t('studio.background.summer'), icon: <BeachIcon /> },
    { value: 'autumn', label: t('studio.background.autumn'), icon: <RainIcon /> },
    { value: 'winter', label: t('studio.background.winter'), icon: <SnowIcon /> },
  ];

  // Utility function to convert file to base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Effect to create base64 preview for userPhoto if it's a File object
  useEffect(() => {
    const convertUserPhoto = async () => {
      if (userPhoto instanceof File) {
        try {
          const base64 = await convertFileToBase64(userPhoto);
          setUserPhotoPreviewUrl(base64);
        } catch (error) {
          console.error('Error converting user photo to base64:', error);
          setUserPhotoPreviewUrl(null);
        }
      } else if (typeof userPhoto === 'string') {
        setUserPhotoPreviewUrl(userPhoto); // It might be a URL string or base64
      } else {
        setUserPhotoPreviewUrl(null);
      }
    };
    convertUserPhoto();
  }, [userPhoto]);

  // Redirect if no photos
  useEffect(() => {
    if (!userPhoto || !clothPhoto) {
      navigate('/');
    }
  }, [userPhoto, clothPhoto, navigate]);

  // Initialize Zalando product state and original URL
  useEffect(() => {
    if (clothPhoto) {
      const isZalandoLink = /^https?:\/\/(www\.)?zalando\./i.test(clothPhoto);
      const isZalandoImage = /ztat\.net/i.test(clothPhoto);
      
      if (isZalandoLink) {
        setIsZalandoProduct(true);
        setOriginalProductUrl(clothPhoto);
        console.log('Initialized with Zalando product URL:', clothPhoto);
      } else if (isZalandoImage) {
        setIsZalandoProduct(true);
        if (homeZalandoUrl && /^https?:\/\/(www\.)?zalando\./i.test(homeZalandoUrl)) {
          setOriginalProductUrl(homeZalandoUrl);
          console.log('Initialized with Zalando image URL, using stored original URL:', homeZalandoUrl);
        } else {
          console.log('Initialized with Zalando image URL, but no original URL available');
        }
      } else {
        setIsZalandoProduct(false);
        setOriginalProductUrl(null);
        console.log('Initialized with non-Zalando URL:', clothPhoto);
      }
    }
  }, [clothPhoto, homeZalandoUrl]);

  // Cleanup effect to clear homeZalandoUrl when component unmounts
  useEffect(() => {
    return () => {
      if (homeZalandoUrl) {
        setHomeZalandoUrl('');
        console.log('Cleared homeZalandoUrl on component unmount');
      }
    };
  }, [homeZalandoUrl, setHomeZalandoUrl]);

  if (!userPhoto || !clothPhoto) {
    return null;
  }

  const extractClothImage = async () => {
    const isZalandoLink = clothPhoto && /^https?:\/\/(www\.)?zalando\./i.test(clothPhoto);
    const isZalandoImage = clothPhoto && /ztat\.net/i.test(clothPhoto);
    
    console.log('Extracting cloth image for URL:', clothPhoto);
    console.log('Is Zalando link?', isZalandoLink);
    console.log('Is Zalando image?', isZalandoImage);
    console.log('Stored original Zalando URL:', homeZalandoUrl);
    
    setIsExtractingCloth(true);
    setExtractError(null);
    
    try {
      // If it's a direct Zalando link, extract both image and product info
      if (isZalandoLink) {
        setOriginalProductUrl(clothPhoto);
        setIsZalandoProduct(true);
        console.log('Fetching image from Zalando URL:', clothPhoto);
        
        // First get the image
        const res = await fetch(`http://localhost:3001/api/extract?url=${encodeURIComponent(clothPhoto)}`);
        if (!res.ok) throw new Error(`Extraction failed (${res.status})`);
        const data = await res.json();
        console.log('Image extraction response:', data);
        
        if (data.imageUrl) {
          setExtractedClothImage(data.imageUrl);
          
          // Then get product info using the original Zalando URL
          await fetchProductInfo(clothPhoto);
        } else {
          throw new Error(data.error || 'No image found');
        }
      }
      // If it's a Zalando image URL (ztat.net), use original URL if available
      else if (isZalandoImage) {
        setExtractedClothImage(clothPhoto);
        setIsZalandoProduct(true);
        
        // Check for stored original URL first, then fallback to originalProductUrl state
        const originalUrlToUse = homeZalandoUrl || originalProductUrl;
        
        if (originalUrlToUse && /^https?:\/\/(www\.)?zalando\./i.test(originalUrlToUse)) {
          console.log('Using stored/original URL for product info:', originalUrlToUse);
          setOriginalProductUrl(originalUrlToUse); // Ensure it's stored in state too
          await fetchProductInfo(originalUrlToUse);
        } else {
          console.log('Zalando image URL detected, but no original product URL available');
          setProductInfo(null);
        }
      }
      // Not a Zalando URL at all
      else {
        setExtractedClothImage(clothPhoto);
        setProductInfo(null);
        setOriginalProductUrl(null);
        setIsZalandoProduct(false);
      }
    } catch (err) {
      console.error('Extraction error:', err);
      setExtractError(err.message);
      setProductInfo(null);
      setIsZalandoProduct(false);
    } finally {
      setIsExtractingCloth(false);
    }
  };

  // Helper function to fetch product info
  const fetchProductInfo = async (url) => {
    try {
      setIsLoadingProductInfo(true);
      console.log('Fetching product info for URL:', url);
      const infoRes = await fetch(`http://localhost:3001/api/product-info?url=${encodeURIComponent(url)}`);
      const productData = await infoRes.json();
      console.log('Product info response:', productData);
      
      if (infoRes.ok && !productData.error) {
        setProductInfo(productData);
        setOriginalProductUrl(url);
      } else {
        console.error('Product info error:', productData.error || 'Unknown error');
        setProductInfo(null);
      }
    } catch (err) {
      console.error('Product info fetch error:', err);
      setProductInfo(null);
    } finally {
      setIsLoadingProductInfo(false);
    }
  };

  useEffect(() => {
    extractClothImage();
  }, [clothPhoto]);



  // Nach Generierung: Album-Auswahl zurücksetzen, aber nur wenn noch nicht gespeichert
  useEffect(() => {
    if (result && !saveDisabled) {
      setSelectedAlbumId(albums.find(a => a.id !== 'generated')?.id || '');
      setSaveSuccess(false);
      setSaveDisabled(false);
    }
  }, [result, albums]);

  // Bild speichern: immer in "Generierte Bilder", optional in weiteres Album
  const handleSave = () => {
    if (!result || saveDisabled) return;
    
    console.log('handleSave called'); // Debug log
    setSaveDisabled(true);
    
    const imageObj = {
      userPhoto: userPhotoPreviewUrl,
      clothPhoto: extractedClothImage,
      image: result,
      customPrompt: customPrompt,
      fullGeneratedPrompt: fullGeneratedPrompt, // Save the complete prompt that was sent to the backend
      clothingItem: selectedClothingItem, // Add clothing item information
      timestamp: new Date().toISOString(),
    };
    
    // Create a consistent ID for the image that will be used in all albums
    const consistentImageId = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    const imageWithId = { ...imageObj, id: consistentImageId };
    
    // Always add to the generated album first
    addGeneratedImage(imageWithId);
    
    // Then optionally add to another album if selected (use the same ID)
    if (selectedAlbumId && selectedAlbumId !== 'generated') {
      // Use the same image object with same ID to avoid duplicates
      addImageToAlbum(selectedAlbumId, imageWithId);
    }
    
    console.log('Image saved successfully (in session)'); // Debug log
    setSaveSuccess(true);
    
    // Bestätigung für 3 Sekunden anzeigen
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
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
      // Prompt für Pose generieren
      let posePrompt = '';
      switch (selectedPose) {
        case 'standing':
          posePrompt = 'Die Person soll auf dem Bild stehen.';
          break;
        case 'sitting':
          posePrompt = 'Die Person soll auf dem Bild sitzen.';
          break;
        case 'pockets':
          posePrompt = 'Die Person soll die Hände in den Taschen haben.';
          break;
        case 'armscrossed':
          posePrompt = 'Die Person soll die Arme verschränken.';
          break;
        default:
          posePrompt = '';
      }
      // Prompt für Hintergrund generieren
      let backgroundPrompt = '';
      switch (selectedBackground) {
        case 'summer':
          backgroundPrompt = 'Bitte generiere das Bild mit einem sommerlichen Strandambiente als Hintergrund. Körper und Gesicht sollen exakt wie auf dem Originalfoto bleiben.';
          break;
        case 'autumn':
          backgroundPrompt = 'Bitte generiere das Bild mit einer herbstlichen Regenszene als Hintergrund. Körper und Gesicht sollen exakt wie auf dem Originalfoto bleiben.';
          break;
        case 'winter':
          backgroundPrompt = 'Bitte generiere das Bild mit einer winterlichen Schneelandschaft als Hintergrund. Körper und Gesicht sollen exakt wie auf dem Originalfoto bleiben.';
          break;
        case 'empty':
          backgroundPrompt = 'Bitte generiere das Bild mit einem leeren weißen Hintergrund. Körper und Gesicht sollen exakt wie auf dem Originalfoto bleiben.';
          break;
        case 'original':
        default:
          backgroundPrompt = 'Bitte generiere das Bild mit dem originalen Hintergrund. Körper und Gesicht sollen exakt wie auf dem Originalfoto bleiben.';
      }
      // Prompt kombinieren
      let fullPrompt = '';
      if (posePrompt) {
        fullPrompt = posePrompt + ' ' + backgroundPrompt;
      } else {
        fullPrompt = backgroundPrompt;
      }
      if (customPrompt) {
        fullPrompt += ' ' + customPrompt;
      }
      
      // Store the full prompt that will be sent to the backend
      setFullGeneratedPrompt(fullPrompt.trim());
      
      formData.append('customPrompt', fullPrompt.trim());
      formData.append('imageQuality', imageQuality);
      
      // Handle userPhoto - convert base64 to blob if needed
      if (userPhoto instanceof File) {
        formData.append('userPhoto', userPhoto);
      } else if (typeof userPhoto === 'string' && userPhoto.startsWith('data:')) {
        // Convert base64 to blob for FormData
        const response = await fetch(userPhoto);
        const blob = await response.blob();
        formData.append('userPhoto', blob, 'user-photo.jpg');
      } else {
        alert('Invalid user photo format. Please try uploading again.');
        setIsGenerating(false);
        return;
      }
      
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
      // Bildgröße auslesen, sobald geladen
      const img = new window.Image();
      img.onload = function () {
        setResultAspect({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = data.imageUrl;
    } catch (err) {
      alert(t('home.error') + ' ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen">
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

      <div className="max-w-7xl mx-auto relative z-10 px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-700 mb-4">
            {t('studio.title')}
          </h1>
          <p className="text-xl text-purple-600 max-w-3xl mx-auto">
            {t('studio.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Column 1: Dein Foto */}
          <Card className="rounded-2xl shadow-lg border border-purple-100 bg-white">
            <h2 className="text-xl font-semibold mb-4">{t('studio.yourPhoto')}</h2>
            <div
              className="relative w-full flex items-center justify-center bg-cream-100 rounded-lg"
              style={{ aspectRatio: `${resultAspect.width} / ${resultAspect.height}`, height: 400 * (resultAspect.height / resultAspect.width) }}
            >
              <img
                src={userPhotoPreviewUrl || 'https://via.placeholder.com/300x400.png?text=Your+Photo'}
                alt="Your photo"
                className="w-full h-full object-contain rounded-lg block"
              />
            </div>
          </Card>

          {/* Column 2: Kleidungsstück */}
          <Card className="rounded-2xl shadow-lg border border-purple-100 bg-white">
            <h2 className="text-xl font-semibold mb-4">{t('studio.clothingItem')}</h2>
            <div
              className="relative w-full flex items-center justify-center bg-cream-100 rounded-lg"
              style={{ aspectRatio: `${resultAspect.width} / ${resultAspect.height}`, height: 400 * (resultAspect.height / resultAspect.width) }}
            >
              {isExtractingCloth ? (
                <div className="w-full h-full bg-cream-200 rounded-lg animate-pulse"></div>
              ) : extractError ? (
                <div className="w-full h-full bg-cream-200 rounded-lg flex items-center justify-center">
                  <p className="text-red-500">{extractError}</p>
                </div>
              ) : (
                extractedClothImage && (
                  <div 
                    className="relative w-full h-full group cursor-pointer"
                    onClick={() => setIsProductInfoOpen(true)}
                  >
                    <img
                      src={extractedClothImage}
                      alt="Clothing"
                      className="w-full h-full object-contain rounded-lg block transition-transform duration-200 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-200 rounded-lg"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="bg-white bg-opacity-90 text-gray-800 px-4 py-2 rounded-lg shadow-lg">
                        Produktdetails anzeigen
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </Card>

          {/* Column 3: Ergebnis */}
          <Card className="rounded-2xl shadow-lg border border-purple-100 bg-white">
            <h2 className="text-xl font-semibold mb-4">{t('studio.result')}</h2>
            <div
              className="relative w-full flex items-center justify-center bg-cream-100 rounded-lg"
              style={{ aspectRatio: `${resultAspect.width} / ${resultAspect.height}`, height: 400 * (resultAspect.height / resultAspect.width) }}
            >
              {isGenerating ? (
                <div className="absolute inset-0 bg-cream-200 rounded-lg flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              ) : result ? (
                <div className="relative w-full h-full">
                  <img
                    src={result}
                    alt="Generated result"
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              ) : (
                <div className="absolute inset-0 bg-cream-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">{t('studio.clickGenerate')}</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Grid for selectors */}
        <div className={`grid ${result ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-8 mt-8`}>
          {/* Hintergrundauswahl-Kachel */}
          <Card className="rounded-2xl shadow-lg border border-purple-100 bg-white">
            <h2 className="text-xl font-semibold mb-4">{t('studio.backgroundTitle')}</h2>
            <div className="flex flex-col gap-2">
              {backgroundOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={selectedBackground === option.value ? 'primary' : 'secondary'}
                  className={`flex items-center w-full justify-start text-left rounded-2xl px-4 py-2 font-medium transition-all duration-200 ${selectedBackground === option.value ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' : 'bg-white border border-purple-200 text-purple-700 hover:bg-purple-50'} `}
                  onClick={() => setSelectedBackground(option.value)}
                >
                  {option.icon}
                  <span className="ml-2">{option.label}</span>
                </Button>
              ))}
            </div>
          </Card>

          {/* Pose-Auswahl-Kachel */}
          <Card className="rounded-2xl shadow-lg border border-purple-100 bg-white">
            <h2 className="text-xl font-semibold mb-4">{t('studio.poseTitle')}</h2>
            <div className="flex flex-col gap-2">
              {poseOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={selectedPose === option.value ? 'primary' : 'secondary'}
                  className={`flex items-center w-full justify-start text-left rounded-2xl px-4 py-2 font-medium transition-all duration-200 ${selectedPose === option.value ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' : 'bg-white border border-purple-200 text-purple-700 hover:bg-purple-50'} `}
                  onClick={() => setSelectedPose(option.value)}
                >
                  {option.icon}
                  <span className="ml-2">{option.label}</span>
                </Button>
              ))}
            </div>
          </Card>

          {/* Bildqualität-Kachel */}
          <Card className="rounded-2xl shadow-lg border border-purple-100 bg-white">
            <h2 className="text-xl font-semibold mb-4">{t('studio.qualityTitle')}</h2>
            <p className="mb-4 text-sm text-gray-600">{t('studio.qualityDescription')}</p>
            <div className="flex flex-col gap-2">
              {qualityOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={imageQuality === option.value ? 'primary' : 'secondary'}
                  className={`flex items-center w-full justify-start text-left rounded-2xl px-4 py-2 font-medium transition-all duration-200 ${imageQuality === option.value ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' : 'bg-white border border-purple-200 text-purple-700 hover:bg-purple-50'} `}
                  onClick={() => setImageQuality(option.value)}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{option.label}</span>
                    {option.value === 'low' && (
                      <div className="relative group">
                        <FaInfoCircle className="text-current ml-2" />
                        <Tooltip>
                          {t('studio.qualityWarning')}
                        </Tooltip>
                      </div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </Card>

          {/* Bild speichern Kachel (conditional) */}
          {result && (
            <Card className="rounded-2xl shadow-lg border border-purple-100 bg-white">
              <h3 className="text-lg font-semibold mb-2">{t('studio.saveTitle')}</h3>
              <p className="mb-2 text-sm">
                {t('studio.saveDescription1')}
                <b>{t('studio.saveDescriptionBold')}</b>
                {t('studio.saveDescription2')}
              </p>
              <div className="mb-4">
                <label className="block mb-1 text-sm">{t('studio.saveToAlbumLabel')}</label>
                <select
                  className="w-full border rounded px-2 py-1"
                  value={selectedAlbumId}
                  onChange={e => setSelectedAlbumId(e.target.value)}
                  disabled={saveDisabled}
                >
                  <option value="">{t('studio.selectAlbum')}</option>
                  {albums.filter(a => a.id !== 'generated').map(album => (
                    <option key={album.id} value={album.id}>{album.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2 justify-end mt-4">
                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={saveDisabled}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-2xl font-semibold shadow-lg transition-all duration-200"
                  style={{ boxShadow: '0 4px 24px 0 rgba(80, 80, 180, 0.10)' }}
                >
                  {saveDisabled ? t('studio.saveButtonSaved') : t('studio.saveButton')}
                </Button>
                {saveSuccess && (
                  <div className="mt-3 bg-green-100 text-green-800 px-4 py-2 rounded-lg text-center font-semibold transition-all animate-fade-in">
                    {t('studio.saveButtonSaved')}
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
        {/* Benutzerdefinierte Anweisungen über dem Button */}
        <div className="flex w-full justify-center mt-8 mb-6">
          <Card className="max-w-2xl w-full rounded-2xl shadow-lg border border-purple-100 bg-white">
            <h2 className="text-xl font-semibold mb-4">Benutzerdefinierte Anweisungen</h2>
            <textarea
              className="w-full border-2 border-purple-200 rounded-2xl p-3 h-24 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="Fügen Sie spezifische Anweisungen für die KI hinzu..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
            />
          </Card>
        </div>
        {/* Anprobe generieren Button unter allen Kacheln */}
        <div className="flex w-full justify-center mt-4">
          <Button
            onClick={generateTryOn}
            disabled={isGenerating}
            className="w-full max-w-2xl text-lg py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl font-semibold shadow-lg transition-all duration-200"
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
        </div>
      </div>
      
      {/* Product Info Dialog */}
      <ProductInfoDialog 
        isOpen={isProductInfoOpen} 
        onClose={() => setIsProductInfoOpen(false)}
        productInfo={productInfo}
        isLoading={isLoadingProductInfo}
        isZalandoProduct={isZalandoProduct}
        originalProductUrl={originalProductUrl}
        onFetchProductInfo={fetchProductInfo}
      />
    </div>
  );
}

export default Studio;
