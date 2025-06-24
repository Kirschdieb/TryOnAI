import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCloset } from '../../store/useCloset';
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
  const navigate = useNavigate();
  const { userPhoto, clothPhoto, addOutfit } = useCloset(); // userPhoto is now a File object or null
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [extractedClothImage, setExtractedClothImage] = useState(null);
  const [isExtractingCloth, setIsExtractingCloth] = useState(false);
  const [extractError, setExtractError] = useState(null);
  const [userPhotoPreviewUrl, setUserPhotoPreviewUrl] = useState(null);

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

  const generateTryOn = async () => {
    setIsGenerating(true);
    setResult(null);

    if (!userPhoto) {
      alert('Please upload a user photo first.');
      setIsGenerating(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('customPrompt', customPrompt);
      formData.append('userPhoto', userPhoto); // userPhoto is a File object
      
      const clothImageSource = extractedClothImage || clothPhoto;
      if (clothImageSource) {
        // We send clothImageUrl; backend will download if it's a URL or process if it's a data URL (though less likely now)
        // If clothImageSource were a File object (e.g., direct cloth upload), we'd append it as 'clothPhotoFile'
        formData.append('clothImageUrl', clothImageSource);
      } else {
        alert('Please provide a clothing image or URL.');
        setIsGenerating(false);
        return;
      }

      const response = await fetch('http://localhost:3001/api/tryon', {
        method: 'POST',
        // 'Content-Type' header is set automatically by the browser for FormData
        body: formData,
      });
      if (!response.ok) {
        // Versuche, Text-Response zu lesen
        const errorData = await response.json();
        if (errorData && errorData.text) {
          alert('Error: ' + errorData.text);
        } else {
          throw new Error('Generation failed');
        }
        return;
      }
      const data = await response.json();
      setResult(data.imageUrl);
      addOutfit({
        id: Date.now(),
        image: data.imageUrl,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto"> {/* Adjusted max-width for 3 columns */}
      <div className="grid md:grid-cols-3 gap-8"> {/* Changed to 3 columns */}
        {/* Column 1: Your Photo */}
        <Card className="md:self-start"> {/* Added md:self-start */}
          <h2 className="text-xl font-semibold mb-4">Your Photo</h2>
          <div className="relative"> {/* Removed fixed height */}
            <img
              src={userPhotoPreviewUrl || 'https://via.placeholder.com/300x400.png?text=Your+Photo'}
              alt="Your photo"
              className="w-full h-auto object-contain rounded-lg block" /* Adjusted for auto height */
            />
          </div>
        </Card>
        
        {/* Column 2: Clothing Item */}
        <Card className="md:self-start"> {/* Added md:self-start */}
          <h2 className="text-xl font-semibold mb-4">Clothing Item</h2>
          <div className="relative"> {/* Removed fixed height */}
            {isExtractingCloth ? (
              <div className="w-full h-auto aspect-[3/4] bg-cream-200 rounded-lg animate-pulse"></div> /* Placeholder with aspect ratio */
            ) : extractError ? (
              <div className="w-full h-auto aspect-[3/4] bg-cream-200 rounded-lg flex items-center justify-center">
                <p className="text-red-500">{extractError}</p>
              </div>
            ) : (
              extractedClothImage && (
                <img
                  src={extractedClothImage}
                  alt="Clothing"
                  className="w-full h-auto object-contain rounded-lg block" /* Adjusted for auto height */
                />
              )
            )}
          </div>
        </Card>

        {/* Column 3: Generation Area (Result & Customization stacked) */}
        <div className="space-y-6">
          <Card> {/* Result Card First */}
            <h2 className="text-xl font-semibold mb-4">Result</h2>
            <div className="relative h-[500px]"> {/* Changed aspect ratio to fixed height */}
              {isGenerating ? (
                <div className="absolute inset-0 bg-cream-200 rounded-lg flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              ) : result ? (
                <img
                  src={result}
                  alt="Generated result"
                  className="absolute inset-0 w-full h-full object-contain rounded-lg"
                />
              ) : (
                <div className="absolute inset-0 bg-cream-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Click Generate to start</p>
                </div>
              )}
            </div>
          </Card>

          <Card> {/* Customization Card Second */}
            <h2 className="text-xl font-semibold mb-4">Customization</h2>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Add any specific instructions for the AI (optional)"
              className="w-full p-3 border border-cream-300 rounded-lg resize-none h-32
                focus:outline-none focus:ring-2 focus:ring-lavender"
            />            <Button
              onClick={generateTryOn}
              disabled={isGenerating}
              className="w-full mt-4"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                  Generating...
                </span>
              ) : (
                'Generate Try-On'
              )}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
