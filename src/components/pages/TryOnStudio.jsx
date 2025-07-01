import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCloset } from '../../store/useCloset';
import { useLanguage } from '../../contexts/LanguageContext';
import { FaUpload, FaTrash, FaPlus, FaCheck } from 'react-icons/fa';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { BeachIcon, RainIcon, SnowIcon, OriginalIcon, StandingIcon, SittingIcon, HandsInPocketsIcon, ArmsCrossedIcon } from '../ui/BackgroundIcon';

// LoadingSpinner Komponente
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-lavender"></div>
    </div>
  );
}

const Studio = () => {
  const { t } = useLanguage();
  // Pose-Optionen
  const [selectedPose, setSelectedPose] = useState('standing');
  const poseOptions = [
    { value: 'standing', label: t('studio.pose.standing'), icon: <StandingIcon /> },
    { value: 'sitting', label: t('studio.pose.sitting'), icon: <SittingIcon /> },
    { value: 'pockets', label: t('studio.pose.pockets'), icon: <HandsInPocketsIcon /> },
    { value: 'armscrossed', label: t('studio.pose.armscrossed'), icon: <ArmsCrossedIcon /> },
  ];
  const navigate = useNavigate();
  const { userPhoto, clothPhoto, albums, addGeneratedImage, addImageToAlbum } = useCloset();
  const [customPrompt, setCustomPrompt] = useState('');
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

  if (!userPhoto || !clothPhoto) {
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
      timestamp: new Date().toISOString(),
    };
    
    // Speichere im State (temporär für die Sitzung)
    addGeneratedImage(imageObj);
    if (selectedAlbumId && selectedAlbumId !== 'generated') {
      addImageToAlbum(selectedAlbumId, { ...imageObj, id: Date.now().toString() + Math.random().toString(36).substr(2, 5) });
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
    <>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Column 1: Dein Foto */}
          <Card>
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
          <Card>
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
                  <img
                    src={extractedClothImage}
                    alt="Clothing"
                    className="w-full h-full object-contain rounded-lg block"
                  />
                )
              )}
            </div>
          </Card>

          {/* Column 3: Ergebnis */}
          <Card>
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
          <Card>
            <h2 className="text-xl font-semibold mb-4">{t('studio.backgroundTitle')}</h2>
            <div className="flex flex-col gap-2">
              {backgroundOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={selectedBackground === option.value ? 'primary' : 'secondary'}
                  className={`flex items-center w-full justify-start text-left !rounded-lg ${selectedBackground === option.value ? '' : 'bg-white border border-cream-300'} ${selectedBackground === option.value ? '' : 'hover:bg-cream-100'}`}
                  onClick={() => setSelectedBackground(option.value)}
                >
                  {option.icon}
                  {option.label}
                </Button>
              ))}
            </div>
          </Card>

          {/* Pose-Auswahl-Kachel */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">{t('studio.poseTitle')}</h2>
            <div className="flex flex-col gap-2">
              {poseOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={selectedPose === option.value ? 'primary' : 'secondary'}
                  className={`flex items-center w-full justify-start text-left !rounded-lg ${selectedPose === option.value ? '' : 'bg-white border border-cream-300'} ${selectedPose === option.value ? '' : 'hover:bg-cream-100'}`}
                  onClick={() => setSelectedPose(option.value)}
                >
                  {option.icon}
                  {option.label}
                </Button>
              ))}
            </div>
          </Card>

          {/* Bildqualität-Kachel */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">{t('studio.qualityTitle')}</h2>
            <p className="mb-4 text-sm text-gray-600">{t('studio.qualityDescription')}</p>
            <div className="flex flex-col gap-2">
              {qualityOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={imageQuality === option.value ? 'primary' : 'secondary'}
                  className={`flex items-center w-full justify-start text-left !rounded-lg ${imageQuality === option.value ? '' : 'bg-white border border-cream-300'} ${imageQuality === option.value ? '' : 'hover:bg-cream-100'}`}
                  onClick={() => setImageQuality(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </Card>

          {/* Bild speichern Kachel (conditional) */}
          {result && (
            <Card>
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
                  className="w-full bg-lavender hover:bg-lavender-dark text-white px-4 py-2 rounded shadow-lg"
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
          <Card className="max-w-2xl w-full">
            <h2 className="text-xl font-semibold mb-4">Benutzerdefinierte Anweisungen</h2>
            <textarea
              className="w-full border rounded p-2 h-24"
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
            className="w-full max-w-2xl text-lg py-4"
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
    </>
  );
}

export default Studio;
