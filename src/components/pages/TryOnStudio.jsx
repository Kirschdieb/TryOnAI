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

  const generateTryOn = async () => {
    setIsGenerating(true);
    setResult(null);
    try {
      const response = await fetch('http://localhost:3001/api/tryon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customPrompt }),
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
      setResult(data.resultImage);
      addOutfit({
        id: Date.now(),
        image: data.resultImage,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
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
              onClick={generateTryOn}
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
