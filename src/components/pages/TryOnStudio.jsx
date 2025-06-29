import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCloset } from '../../store/useCloset';
import { useLanguage } from '../../contexts/LanguageContext';
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

  // Hintergrundoptionen
  const backgroundOptions = [
    { value: 'original', label: t('studio.background.original'), icon: <OriginalIcon /> },
    { value: 'summer', label: t('studio.background.summer'), icon: <BeachIcon /> },
    { value: 'autumn', label: t('studio.background.autumn'), icon: <RainIcon /> },
    { value: 'winter', label: t('studio.background.winter'), icon: <SnowIcon /> },
  ];

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
          {/* Column 1: Dein Foto + Hintergrund */}
          <div className="flex flex-col gap-6">
            <Card className="md:self-start">
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
          </div>
          {/* Column 2: Kleidungsstück + Pose */}
          <div className="flex flex-col gap-6">
            {/* Clothing Item */}
            <Card className="md:self-start">
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
          </div>
          {/* Column 3: Ergebnis + Speichern */}
          <div className="flex flex-col gap-6">
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
            {result && (
              <Card>
                <h3 className="text-lg font-semibold mb-2">{t('studio.saveTitle')}</h3>
                <p className="mb-2">{t('studio.saveInfo1')} <b>{t('albums.generated')}</b> {t('studio.saveInfo2')}</p>
                <div className="mb-4">
                  <label className="block mb-1">{t('studio.saveInfo3')}</label>
                  <select
                    className="w-full border rounded px-2 py-1"
                    value={selectedAlbumId}
                    onChange={e => setSelectedAlbumId(e.target.value)}
                    disabled={saveDisabled}
                  >
                    <option value="">{t('studio.saveInfo4')}</option>
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
                    className="w-full max-w-xs bg-lavender hover:bg-lavender-dark text-white px-4 py-2 rounded shadow-lg"
                    style={{ boxShadow: '0 4px 24px 0 rgba(80, 80, 180, 0.10)' }}
                  >
                    {saveDisabled ? t('studio.savedToCloset') : t('studio.saveToCloset')}
                  </Button>
                  {saveSuccess && (
                    <div className="mt-3 bg-green-100 text-green-800 px-4 py-2 rounded-lg text-center font-semibold transition-all animate-fade-in">
                      {t('studio.savedToCloset')}
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
        {/* Anprobe generieren Button unter allen Kacheln */}
        <div className="flex w-full justify-center mt-8">
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
