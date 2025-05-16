import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCloset } from '../../store/useCloset';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function TryOnStudio() {
  const navigate = useNavigate();
  const { userPhoto, clothPhoto, addOutfit } = useCloset();
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);

  // Redirect if no photos
  if (!userPhoto || !clothPhoto) {
    navigate('/');
    return null;
  }

  const fakeGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For now, just use the cloth photo as the result
    setResult(clothPhoto);
    addOutfit({
      id: Date.now(),
      image: clothPhoto,
      timestamp: new Date().toISOString(),
    });
    
    setIsGenerating(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Original Photos */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Your Photo</h2>
            <div className="relative aspect-[3/4]">
              <img
                src={userPhoto}
                alt="Your photo"
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
            </div>
          </Card>
          
          <Card>
            <h2 className="text-xl font-semibold mb-4">Clothing Item</h2>
            <div className="relative aspect-[3/4]">
              <img
                src={clothPhoto}
                alt="Clothing"
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
            </div>
          </Card>
        </div>

        {/* Generation Area */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Customization</h2>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Add any specific instructions for the AI (optional)"
              className="w-full p-3 border border-cream-300 rounded-lg resize-none h-32
                focus:outline-none focus:ring-2 focus:ring-lavender"
            />
            <Button
              onClick={fakeGenerate}
              disabled={isGenerating}
              className="w-full mt-4"
            >
              {isGenerating ? 'Generating...' : 'Generate Try-On'}
            </Button>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4">Result</h2>
            <div className="relative aspect-[3/4]">
              {isGenerating ? (
                <div className="absolute inset-0 bg-cream-200 rounded-lg animate-pulse" />
              ) : result ? (
                <img
                  src={result}
                  alt="Generated result"
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="absolute inset-0 bg-cream-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Click Generate to start</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
