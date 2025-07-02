import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCloset } from '../../store/useCloset';
import { useLanguage } from '../../contexts/LanguageContext';
import Card from '../ui/Card';
import Button from '../ui/Button';

// Hilfskomponente für "Zu Album hinzufügen"
function AddToAlbumSection({ selectedImage, albums, currentAlbumId, addImageToAlbum }) {
  const [targetAlbumId, setTargetAlbumId] = useState('');
  const [added, setAdded] = useState(false);
  // Nur Alben anzeigen, in denen das Bild noch nicht ist und die nicht das aktuelle Album sind
  const availableAlbums = albums.filter(a => a.id !== currentAlbumId && !a.images.some(img => img.id === selectedImage.id));
  if (availableAlbums.length === 0) return null;
  return (
    <div className="mt-4">
      <label className="block mb-1 font-medium">Zu Album hinzufügen:</label>
      <div className="flex gap-2 items-center">
        <select
          className="border rounded px-2 py-1"
          value={targetAlbumId}
          onChange={e => setTargetAlbumId(e.target.value)}
        >
          <option value="">Album wählen…</option>
          {availableAlbums.map(album => (
            <option key={album.id} value={album.id}>{album.name}</option>
          ))}
        </select>
        <Button
          variant="primary"
          disabled={!targetAlbumId || added}
          onClick={() => {
            addImageToAlbum(targetAlbumId, { ...selectedImage, id: selectedImage.id || Date.now().toString() + Math.random().toString(36).substr(2, 5) });
            setAdded(true);
            setTimeout(() => setAdded(false), 1200);
          }}
        >
          Hinzufügen
        </Button>
        {added && <span className="text-green-600 ml-2">Hinzugefügt!</span>}
      </div>
    </div>
  );
}

export default function Closet() {
  const { t, language } = useLanguage();
  const {
    albums,
    addAlbum,
    renameAlbum,
    deleteAlbum,
    addImageToAlbum,
    removeImageFromAlbum
  } = useCloset();
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [renamingAlbumId, setRenamingAlbumId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  // Album Auswahl: Standardmäßig erstes Album auswählen
  const selectedAlbum = albums.find(a => a.id === selectedAlbumId) || albums[0];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Decorative curved elements - different positions for variety */}
      
      {/* Top right curved element */}
      <div
        className="fixed top-0 right-0 w-72 h-72 translate-x-18 -translate-y-18 -z-10"
        style={{
          background: 'linear-gradient(225deg, #7f3ffb 0%, #e14eca 100%)',
          borderRadius: '0 0 0 100%',
          transform: 'translate(25%, -25%)',
        }}
        aria-hidden="true"
      />
      
      {/* Bottom left curved element */}
      <div
        className="fixed bottom-0 left-0 w-88 h-88 -translate-x-22 translate-y-22 -z-10"
        style={{
          background: 'linear-gradient(45deg, #7f3ffb 0%, #e14eca 100%)',
          borderRadius: '0 100% 0 0',
          transform: 'translate(-25%, 25%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-700 mb-4">
            {t('closet.title') || 'Kleiderschrank'}
          </h1>
          <p className="text-xl text-purple-600 max-w-3xl mx-auto">
            Verwalte deine Try-On Bilder und erstelle personalisierte Kollektionen
          </p>
        </div>

        {/* Album Verwaltung */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Deine Alben</h2>
          <div className="flex flex-wrap gap-3 items-center justify-center mb-6">
            {albums.map(album => (
              <div 
                key={album.id} 
                className={`px-4 py-3 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedAlbum && selectedAlbum.id === album.id 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-600 shadow-lg' 
                    : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:shadow-md'
                }`}
                onClick={() => setSelectedAlbumId(album.id)}
              >
                {album.id === 'generated' ? (
                  <span className="font-medium">{language === 'de' ? 'Generierte Bilder' : 'Generated Pictures'}</span>
                ) : renamingAlbumId === album.id ? (
                  <form onSubmit={e => { e.preventDefault(); renameAlbum(album.id, renameValue); setRenamingAlbumId(null); }} className="flex gap-2">
                    <input 
                      value={renameValue} 
                      onChange={e => setRenameValue(e.target.value)} 
                      className="border rounded-lg px-2 py-1 text-gray-800" 
                      autoFocus 
                    />
                    <Button type="submit" variant="primary" className="px-3 py-1 text-sm">OK</Button>
                    <Button type="button" variant="outline" className="px-3 py-1 text-sm" onClick={() => setRenamingAlbumId(null)}>✕</Button>
                  </form>
                ) : (
                  <div className="flex items-center gap-2">
                    <span 
                      className="font-medium"
                      onDoubleClick={() => { setRenamingAlbumId(album.id); setRenameValue(album.name); }}
                    >
                      {album.name}
                    </span>
                    {album.id !== 'generated' && (
                      <div className="flex gap-1">
                        <button 
                          onClick={e => { e.stopPropagation(); setRenamingAlbumId(album.id); setRenameValue(album.name); }} 
                          className="text-gray-400 hover:text-purple-600 transition-colors duration-200"
                          title="Umbenennen"
                        >
                          ✏️
                        </button>
                        {albums.length > 1 && (
                          <button 
                            onClick={e => { e.stopPropagation(); deleteAlbum(album.id); if (selectedAlbumId === album.id) setSelectedAlbumId(albums[0]?.id || null); }} 
                            className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                            title="Löschen"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Neues Album erstellen */}
          <div className="flex justify-center">
            <form onSubmit={e => { e.preventDefault(); if (newAlbumName.trim()) { addAlbum(newAlbumName.trim()); setNewAlbumName(''); } }} className="flex gap-3">
              <input 
                value={newAlbumName} 
                onChange={e => setNewAlbumName(e.target.value)} 
                placeholder="Neues Album erstellen..." 
                className="border-2 border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200" 
              />
              <Button 
                type="submit" 
                variant="primary" 
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium transition-all duration-200"
              >
                + Album
              </Button>
            </form>
          </div>
        </div>

      {/* Album Inhalt */}
      {selectedAlbum && selectedAlbum.images.length === 0 && (
        <Card className="text-center py-12">
          <p className="text-gray-500 mb-6">{t('closet.empty') || 'Dieses Album ist leer.'}</p>
          <p className="text-gray-400 mb-6">{t('closet.emptySubtitle') || 'Speichere Try-On Bilder in dieses Album.'}</p>
        </Card>
      )}
      {selectedAlbum && selectedAlbum.images.length > 0 && (
        <div className="columns-1 sm:columns-2 lg:columns-4 gap-4 space-y-4 mb-10">
          {selectedAlbum.images.map((img, idx) => (
            <Card
              key={img.id || idx}
              onClick={() => setSelectedImage(img)}
              className="break-inside-avoid"
            >
              <div className="relative aspect-[3/4]">
                <img
                  src={img.image}
                  alt={img.customPrompt || 'Try-On'}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500 text-center">
                {img.timestamp ? new Date(img.timestamp).toLocaleDateString() : ''}
              </p>
              <button onClick={e => { e.stopPropagation(); removeImageFromAlbum(selectedAlbum.id, img.id); }} className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white bg-opacity-80 rounded-full p-1">🗑️</button>
            </Card>
          ))}
        </div>
      )}

        {/* Zalando Browse Box */}
        <div className="flex justify-center mt-12">
          <Card className="max-w-xl w-full text-center">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto mb-4 text-purple-500">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                {t('closet.browseBoxTitle') || 'Weitere Kleidung entdecken'}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('closet.browseBoxDesc') || 'Hier kannst du weitere Kleidungsideen über Zalando durchstöbern und Inspiration für deinen Kleiderschrank sammeln.'}
              </p>
            </div>
            <Link to="/browse" className="w-full flex justify-center">
              <Button 
                variant="primary"
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {t('closet.browseClothes') || 'Kleidung entdecken'}
              </Button>
            </Link>
          </Card>
        </div>

      {/* Modal für Bilddetails */}
      {selectedImage && (
        <dialog
          open
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-2xl max-h-[90vh] overflow-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Bild Details
              </h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <img
                  src={selectedImage.image}
                  alt="Try-On"
                  className="w-full rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <p><strong>Erstellt:</strong> {selectedImage.timestamp ? new Date(selectedImage.timestamp).toLocaleString() : ''}</p>
                {selectedImage.customPrompt && (
                  <p><strong>Prompt:</strong> {selectedImage.customPrompt}</p>
                )}
                {/* Zu Album hinzufügen */}
                <AddToAlbumSection
                  selectedImage={selectedImage}
                  albums={albums}
                  currentAlbumId={selectedAlbum.id}
                  addImageToAlbum={addImageToAlbum}
                />
              </div>
            </div>
          </div>
        </dialog>
      )}
      </div>
    </div>
  );
}
