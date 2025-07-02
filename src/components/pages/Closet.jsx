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
  const { t } = useLanguage();
  
  // Nur Alben anzeigen, in denen das Bild noch nicht ist und die nicht das aktuelle Album sind
  const availableAlbums = albums.filter(a => a.id !== currentAlbumId && !a.images.some(img => img.id === selectedImage.id));
  
  if (availableAlbums.length === 0) return null;
  
  return (
    <div className="mt-4">
      <label className="block mb-1 font-medium">{t('closet.addToAlbum')}:</label>
      <div className="flex gap-2 items-center">
        <select
          className="border rounded px-2 py-1 bg-white"
          value={targetAlbumId}
          onChange={e => setTargetAlbumId(e.target.value)}
        >
          <option value="">{t('closet.selectAlbum') || 'Album wählen...'}</option>
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
          {added ? '✓' : t('closet.addToAlbum')}
        </Button>
        {added && <span className="text-green-600 ml-2">✓</span>}
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
    removeImageFromAlbum,
    deleteImageFromAllAlbums
  } = useCloset();
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [renamingAlbumId, setRenamingAlbumId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [viewMode, setViewMode] = useState('albums'); // 'albums' oder 'album-content'

  // Album Auswahl: Standardmäßig erstes Album auswählen
  const selectedAlbum = albums.find(a => a.id === selectedAlbumId) || albums[0];

  // Funktion zum Öffnen eines Albums
  const openAlbum = (albumId) => {
    setSelectedAlbumId(albumId);
    setViewMode('album-content');
  };

  // Funktion zum Zurückkehren zur Album-Übersicht
  const backToAlbums = () => {
    setViewMode('albums');
    setSelectedAlbumId(null);
  };

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

        {/* Album Verwaltung oder Album-Inhalt */}
        {viewMode === 'albums' ? (
          /* Album Grid Ansicht */
          <div className="mb-12">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800">Deine Alben</h2>
              
              {/* Neues Album erstellen */}
              <form onSubmit={e => { e.preventDefault(); if (newAlbumName.trim()) { addAlbum(newAlbumName.trim()); setNewAlbumName(''); } }} className="flex gap-3">
                <input 
                  value={newAlbumName} 
                  onChange={e => setNewAlbumName(e.target.value)} 
                  placeholder="Neues Album..." 
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

            {/* Album Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {albums.map(album => {
                const firstImage = album.images[0];
                
                return (
                  <Card
                    key={album.id}
                    className="cursor-pointer transition-all duration-300 hover:shadow-xl group relative overflow-hidden"
                    onClick={() => openAlbum(album.id)}
                  >
                    {/* Album Preview Image */}
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                      {firstImage ? (
                        <img
                          src={firstImage.image}
                          alt={album.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                          <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-2">
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <p className="text-sm">Leer</p>
                          </div>
                        </div>
                      )}

                      {/* Album Actions (nur für Custom-Alben) */}
                      {album.id !== 'generated' && (
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setRenamingAlbumId(album.id);
                                setRenameValue(album.name);
                              }}
                              className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 p-1.5 rounded-full shadow-md transition-all duration-200"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            {albums.length > 1 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm(`Album "${album.name}" wirklich löschen?`)) {
                                    deleteAlbum(album.id);
                                  }
                                }}
                                className="bg-white bg-opacity-90 hover:bg-opacity-100 text-red-500 p-1.5 rounded-full shadow-md transition-all duration-200"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Album Info */}
                    <div className="p-4">
                      {renamingAlbumId === album.id ? (
                        <form 
                          onSubmit={e => { 
                            e.preventDefault(); 
                            renameAlbum(album.id, renameValue); 
                            setRenamingAlbumId(null); 
                          }} 
                          className="space-y-2"
                          onClick={e => e.stopPropagation()}
                        >
                          <input 
                            value={renameValue} 
                            onChange={e => setRenameValue(e.target.value)} 
                            className="w-full border rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                            autoFocus 
                          />
                          <div className="flex gap-2">
                            <Button type="submit" variant="primary" className="px-3 py-1 text-sm flex-1">Speichern</Button>
                            <Button type="button" variant="outline" className="px-3 py-1 text-sm" onClick={() => setRenamingAlbumId(null)}>Abbrechen</Button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <h3 className="font-semibold text-lg text-gray-800 mb-1 truncate">
                            {album.id === 'generated' 
                              ? (language === 'de' ? 'Generierte Bilder' : 'Generated Pictures')
                              : album.name
                            }
                          </h3>
                          <p className="text-gray-500 text-sm">
                            {album.images.length} {album.images.length === 1 ? 'Bild' : 'Bilder'}
                          </p>
                        </>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          /* Album-Inhalt Ansicht */
          selectedAlbum && (
            <div className="mb-12">
              {/* Zurück-Navigation und Album-Header */}
              <div className="mb-8">
                {/* Zurück-Button */}
                <button
                  onClick={backToAlbums}
                  className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all duration-200 mb-6"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {t('closet.backToAlbums')}
                </button>

                {/* Album-Header mit Titel und Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Album Cover als klickbares Element */}
                    {selectedAlbum.images[0] && (
                      <div 
                        className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200 flex-shrink-0"
                        onClick={backToAlbums}
                        title="Zurück zu allen Alben"
                      >
                        <img
                          src={selectedAlbum.images[0].image}
                          alt={selectedAlbum.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div>
                      {renamingAlbumId === selectedAlbum.id ? (
                        <form 
                          onSubmit={e => { 
                            e.preventDefault(); 
                            renameAlbum(selectedAlbum.id, renameValue); 
                            setRenamingAlbumId(null); 
                          }} 
                          className="flex gap-3 items-center"
                        >
                          <input 
                            value={renameValue} 
                            onChange={e => setRenameValue(e.target.value)} 
                            className="text-3xl font-bold text-gray-800 bg-transparent border-b-2 border-purple-500 focus:outline-none focus:border-purple-600 transition-colors" 
                            autoFocus 
                          />
                          <div className="flex gap-2">
                            <Button type="submit" variant="primary" className="px-4 py-2 text-sm">Speichern</Button>
                            <Button type="button" variant="outline" className="px-4 py-2 text-sm" onClick={() => setRenamingAlbumId(null)}>Abbrechen</Button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                            {selectedAlbum.id === 'generated' 
                              ? (language === 'de' ? 'Generierte Bilder' : 'Generated Pictures')
                              : selectedAlbum.name
                            }
                          </h1>
                          <p className="text-lg text-gray-500">
                            {selectedAlbum.images.length} {selectedAlbum.images.length === 1 ? 'Bild' : 'Bilder'}
                            {selectedAlbum.images.length > 0 && (
                              <span className="ml-2">
                                • {t('closet.lastEdited')}: {new Date().toLocaleDateString()}
                              </span>
                            )}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons - nur für Custom-Alben */}
                  {selectedAlbum.id !== 'generated' && renamingAlbumId !== selectedAlbum.id && (
                    <div className="flex gap-3">
                      <Button
                        onClick={() => { 
                          setRenamingAlbumId(selectedAlbum.id); 
                          setRenameValue(selectedAlbum.name); 
                        }}
                        className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        {t('closet.editButton')}
                      </Button>
                      
                      {albums.length > 1 && (
                        <Button
                          onClick={() => { 
                            if (window.confirm(`Album "${selectedAlbum.name}" wirklich löschen?`)) {
                              deleteAlbum(selectedAlbum.id);
                              backToAlbums();
                            }
                          }}
                          className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          {t('closet.deleteButton')}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Album-Inhalt */}
              {selectedAlbum.images.length === 0 ? (
                <Card className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 text-gray-300">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-3">
                    {t('closet.albumEmpty')}
                  </h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    {t('closet.albumEmptyDesc')}
                  </p>
                </Card>
              ) : (
                <div className="columns-1 sm:columns-2 lg:columns-4 gap-4 space-y-4 mb-10">
                  {selectedAlbum.images.map((img, idx) => (
                    <Card
                      key={img.id || idx}
                      onClick={() => setSelectedImage(img)}
                      className="break-inside-avoid cursor-pointer hover:shadow-lg transition-shadow duration-200"
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
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )
        )}

        {/* Zalando Browse Box - nur in Album-Übersicht anzeigen */}
        {viewMode === 'albums' && (
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
            </Card>          </div>
        )}

        {/* Bild Detail Modal - nur im Album-Inhalt sichtbar */}
        {viewMode === 'album-content' && selectedImage && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50" onClick={() => setSelectedImage(null)}></div>
            
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full z-10 overflow-hidden">
              {/* Bild Anzeige */}
              <div className="relative pt-4 pb-2">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <img
                  src={selectedImage.image}
                  alt={selectedImage.customPrompt || 'Try-On Bild'}
                  className="w-full h-auto rounded-lg"
                />
              </div>

              {/* Bild Aktionen */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2 mb-4">
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => {
                      // Bild zu neuem Album hinzufügen
                      const newAlbumId = prompt(t('closet.enterAlbumId') || 'Gib die Album-ID ein:');
                      if (newAlbumId) {
                        addImageToAlbum(newAlbumId, { ...selectedImage, id: selectedImage.id || Date.now().toString() + Math.random().toString(36).substr(2, 5) });
                        setSelectedImage(null);
                      }
                    }}
                  >
                    {t('closet.addToAlbum')}
                  </Button>
                  <Button
                    variant="danger"
                    className="flex-1"
                    onClick={() => {
                      if (window.confirm(t('closet.confirmDeleteImage') || 'Bild wirklich löschen?')) {
                        deleteImageFromAllAlbums(selectedImage.id);
                        setSelectedImage(null);
                      }
                    }}
                  >
                    {t('closet.deleteImage')}
                  </Button>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setSelectedImage(null)}
                >
                  {t('closet.close')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Detail Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">{t('closet.imageDetails')}</h2>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Image Display */}
              <div className="mb-6">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.customPrompt || 'Try-On'}
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                />
              </div>

              {/* Image Info */}
              <div className="mb-6 space-y-2">
                {selectedImage.timestamp && (
                  <p className="text-gray-600">
                    <span className="font-medium">{t('closet.created')}:</span> {new Date(selectedImage.timestamp).toLocaleDateString()}
                  </p>
                )}
                {selectedImage.customPrompt && (
                  <p className="text-gray-600">
                    <span className="font-medium">{t('closet.prompt')}:</span> {selectedImage.customPrompt}
                  </p>
                )}
              </div>

              {/* Add to Album Section - nur wenn nicht in einem Album oder in anderen Alben */}
              <AddToAlbumSection
                selectedImage={selectedImage}
                albums={albums}
                currentAlbumId={selectedAlbum?.id}
                addImageToAlbum={addImageToAlbum}
              />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                {/* Remove from Album - nur wenn in einem spezifischen Album und nicht "Generierte Bilder" */}
                {selectedAlbum && selectedAlbum.id !== 'generated' && (
                  <Button
                    onClick={() => {
                      removeImageFromAlbum(selectedAlbum.id, selectedImage.id);
                      setSelectedImage(null);
                    }}
                    className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 justify-center"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                    {t('closet.removeFromAlbum')}
                  </Button>
                )}

                {/* Delete Image Permanently */}
                <Button
                  onClick={() => {
                    if (window.confirm(t('closet.confirmDeleteImage'))) {
                      deleteImageFromAllAlbums(selectedImage.id);
                      setSelectedImage(null);
                    }
                  }}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 justify-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  {t('closet.deleteImage')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
