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
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">{t('closet.title') || 'Kleiderschrank'}</h1>

      {/* Album Verwaltung */}
      <div className="mb-8 flex flex-wrap gap-4 items-center justify-center">
        {albums.map(album => (
          <div key={album.id} className={`px-4 py-2 rounded-lg border cursor-pointer ${selectedAlbum && selectedAlbum.id === album.id ? 'bg-lavender text-white' : 'bg-white text-gray-700'}`}
            onClick={() => setSelectedAlbumId(album.id)}>
            {album.id === 'generated' ? (
              <span>{language === 'de' ? 'Generierte Bilder' : 'Generated Pictures'}</span>
            ) : renamingAlbumId === album.id ? (
              <form onSubmit={e => { e.preventDefault(); renameAlbum(album.id, renameValue); setRenamingAlbumId(null); }} className="flex gap-2">
                <input value={renameValue} onChange={e => setRenameValue(e.target.value)} className="border rounded px-2 py-1 text-black" autoFocus />
                <Button type="submit" variant="primary" className="px-2 py-1 hover:underline hover:bg-purple-700 transition-colors">OK</Button>
                <Button type="button" variant="primary" className="px-2 py-1 hover:underline hover:bg-purple-700 transition-colors" onClick={() => setRenamingAlbumId(null)}>Abbrechen</Button>
              </form>
            ) : (
              <span onDoubleClick={() => { setRenamingAlbumId(album.id); setRenameValue(album.name); }}>{album.name}</span>
            )}
            {album.id !== 'generated' && albums.length > 1 && (
              <button onClick={e => { e.stopPropagation(); deleteAlbum(album.id); if (selectedAlbumId === album.id) setSelectedAlbumId(albums[0]?.id || null); }} className="ml-2 text-red-500 hover:text-red-700">🗑️</button>
            )}
            {album.id !== 'generated' && (
              <button onClick={e => { e.stopPropagation(); setRenamingAlbumId(album.id); setRenameValue(album.name); }} className="ml-1 text-gray-400 hover:text-gray-700">✏️</button>
            )}
          </div>
        ))}
        <form onSubmit={e => { e.preventDefault(); if (newAlbumName.trim()) { addAlbum(newAlbumName.trim()); setNewAlbumName(''); } }} className="flex gap-2">
          <input value={newAlbumName} onChange={e => setNewAlbumName(e.target.value)} placeholder="Neues Album..." className="border rounded px-2 py-1" />
          <Button type="submit" variant="primary" className="px-2 py-1">+</Button>
        </form>
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
      <div className="flex justify-center mt-8">
        <div className="bg-white rounded-xl shadow-lg px-8 py-8 max-w-xl w-full flex flex-col items-center border border-gray-200">
          <h2 className="text-lg font-semibold mb-2 text-center">{t('closet.browseBoxTitle') || 'Weitere Kleidung entdecken'}</h2>
          <p className="text-gray-500 mb-6 text-center">
            {t('closet.browseBoxDesc') || 'Hier kannst du weitere Kleidungsideen über Zalando durchstöbern und Inspiration für deinen Kleiderschrank sammeln.'}
          </p>
          <Link to="/browse" className="w-full flex justify-center">
            <Button variant="primary">
              {t('closet.browseClothes') || 'Kleidung entdecken'}
            </Button>
          </Link>
        </div>
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
  );
}
