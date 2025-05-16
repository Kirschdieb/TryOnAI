import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCloset } from '../../store/useCloset';
import Button from '../ui/Button';
import Card from '../ui/Card';
import DropZone from '../ui/DropZone';

export default function HomeUpload() {
  const navigate = useNavigate();
  const { setUserPhoto, setClothPhoto } = useCloset();
  const [userPhotoUrl, setUserPhotoUrl] = useState(null);
  const [clothPhotoUrl, setClothPhotoUrl] = useState(null);
  const [zalandoUrl, setZalandoUrl] = useState('');

  const handleTryOn = () => {
    setUserPhoto(userPhotoUrl);
    setClothPhoto(clothPhotoUrl || zalandoUrl);
    navigate('/studio');
  };

  const isValid = (userPhotoUrl && (clothPhotoUrl || zalandoUrl.startsWith('https://www.zalando.')));

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
              onFileSelect={setUserPhotoUrl}
              className="w-full h-full"
            />
            {userPhotoUrl && (
              <div className="absolute inset-0 pointer-events-none">
                <img
                  src={userPhotoUrl}
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
              value={zalandoUrl}
              onChange={(e) => setZalandoUrl(e.target.value)}
              pattern="https://www.zalando."
              placeholder="https://www.zalando.de/..."
              className="w-full p-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender"
            />
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
                onFileSelect={setClothPhotoUrl}
                className="w-full h-full"
              />
              {clothPhotoUrl && (
                <div className="absolute inset-0 pointer-events-none">
                  <img
                    src={clothPhotoUrl}
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
