import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCloset } from '../../store/useCloset';
import { useLanguage } from '../../contexts/LanguageContext';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function Closet() {
  const { t } = useLanguage();
  const { outfits } = useCloset();
  const [selectedOutfit, setSelectedOutfit] = useState(null);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">{t('closet.title')}</h1>
      
      {(() => {
        // Filter only valid outfits (must have image and timestamp)
        const validOutfits = outfits.filter(
          (o) => o && typeof o.image === 'string' && o.image && typeof o.timestamp === 'string' && !isNaN(Date.parse(o.timestamp))
        );
        return (
          <>
            {validOutfits.length === 0 ? (
              <Card className="text-center py-12">
                <p className="text-gray-500 mb-6">{t('closet.empty')}</p>
                <p className="text-gray-400 mb-6">{t('closet.emptySubtitle')}</p>
              </Card>
            ) : (
              <div className="columns-1 sm:columns-2 lg:columns-4 gap-4 space-y-4 mb-10">
                {validOutfits.map((outfit, idx) => (
                  <Card
                    key={outfit.id || idx}
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
            {/* Zalando Browse Box */}
            <div className="flex justify-center mt-8">
              <div className="bg-white rounded-xl shadow-lg px-8 py-8 max-w-xl w-full flex flex-col items-center border border-gray-200">
                <h2 className="text-lg font-semibold mb-2 text-center">{t('closet.browseBoxTitle') || 'Weitere Kleidung entdecken'}</h2>
                <p className="text-gray-500 mb-6 text-center">
                  {t('closet.browseBoxDesc') || 'Hier kannst du weitere Kleidungsideen über Zalando durchstöbern und Inspiration für deinen Kleiderschrank sammeln.'}
                </p>
                <Link to="/browse" className="w-full flex justify-center">
                  <Button variant="primary">
                    {t('closet.browseClothes')}
                  </Button>
                </Link>
              </div>
            </div>
          </>
        );
      })()}

      {/* Modal */}
      {selectedOutfit && (
        <dialog
          open
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setSelectedOutfit(null)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-2xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Outfit Details
              </h3>
              <button
                onClick={() => setSelectedOutfit(null)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <img
                  src={selectedOutfit.image}
                  alt="Outfit"
                  className="w-full rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <p><strong>Created:</strong> {new Date(selectedOutfit.timestamp).toLocaleString()}</p>
                {selectedOutfit.clothingName && (
                  <p><strong>Clothing:</strong> {selectedOutfit.clothingName}</p>
                )}
                {selectedOutfit.customPrompt && (
                  <p><strong>Prompt:</strong> {selectedOutfit.customPrompt}</p>
                )}
              </div>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
