import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCloset } from '../../store/useCloset';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function Closet() {
  const { outfits } = useCloset();
  const [selectedOutfit, setSelectedOutfit] = useState(null);

  return (    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Your Virtual Closet</h1>
        <Link to="/browse">
          <Button variant="primary" className="px-6 py-3">
            Browse Clothes
          </Button>
        </Link>
      </div>      {outfits.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-500 mb-6">Your closet is empty. Try on some clothes to get started!</p>
          <Link to="/browse">
            <Button variant="primary">
              Browse Clothes
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-4 gap-4 space-y-4">
          {outfits.map((outfit) => (
            <Card
              key={outfit.id}
              onClick={() => setSelectedOutfit(outfit)}
              className="break-inside-avoid"
            >
              <div className="relative aspect-[3/4]">
                <img
                  src={outfit.image}
                  alt={`Outfit from ${new Date(outfit.timestamp).toLocaleDateString()}`}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500 text-center">
                {new Date(outfit.timestamp).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedOutfit && (
        <dialog
          open
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setSelectedOutfit(null)}
        >
          <div
            className="bg-cream-100 p-4 rounded-xl max-w-2xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[3/4]">
              <img
                src={selectedOutfit.image}
                alt="Full size outfit"
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-gray-500">
                Created on {new Date(selectedOutfit.timestamp).toLocaleDateString()}
              </p>
              <button
                onClick={() => setSelectedOutfit(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
