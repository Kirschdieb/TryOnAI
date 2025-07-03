import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCloset } from '../../store/useCloset';
import { useLanguage } from '../../contexts/LanguageContext';
import Card from '../ui/Card';
import Button from '../ui/Button';

// Hilfskomponente für "Zu Album hinzufügen" - verbesserte Version
function AddToAlbumSection({ selectedImage, albums, currentAlbumId, addImageToAlbum, onImageAdded = null }) {
  const [targetAlbumId, setTargetAlbumId] = useState('');
  const [added, setAdded] = useState(false);
  const { t } = useLanguage();
  
  // Nur Alben anzeigen, in denen das Bild noch nicht ist und die nicht das aktuelle Album sind
  const availableAlbums = albums.filter(a => a.id !== currentAlbumId && !a.images.some(img => img.id === selectedImage.id));
  
  if (availableAlbums.length === 0) return (
    <p className="text-gray-500 italic">{t('closet.noAlbumsAvailable')}</p>
  );
  
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <select
          className="border-2 border-gray-200 rounded-xl px-4 py-2 bg-white focus:border-lavender focus:outline-none focus:ring-2 focus:ring-lavender/30 transition-all w-full sm:flex-1"
          value={targetAlbumId}
          onChange={e => setTargetAlbumId(e.target.value)}
        >
          <option value="">{t('closet.selectAlbum')}</option>
          {availableAlbums.map(album => (
            <option key={album.id} value={album.id}>{album.name}</option>
          ))}
        </select>
        <Button
          variant="primary"
          disabled={!targetAlbumId || added}
          className="px-4 py-2 sm:w-auto w-full"
          onClick={() => {
            const newImageId = selectedImage.id || Date.now().toString() + Math.random().toString(36).substr(2, 5);
            // Album Name für Erfolgsanzeige speichern
            const albumName = albums.find(a => a.id === targetAlbumId)?.name || '';
            
            // Bild zum Album hinzufügen
            addImageToAlbum(targetAlbumId, { ...selectedImage, id: newImageId });
            
            // UI-Status aktualisieren
            setAdded(true);
            setTargetAlbumId('');
            
            // Optional Callback ausführen (falls übergeben)
            if (onImageAdded) {
              onImageAdded(targetAlbumId, albumName);
            }
            
            // Nach 3 Sekunden die Erfolgsmeldung zurücksetzen
            setTimeout(() => setAdded(false), 3000);
          }}
        >
          {added ? (
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t('studio.saveButtonSaved').replace('✓', '')}
            </span>
          ) : t('closet.addToAlbum')}
        </Button>
      </div>
      {added && (
        <div className="mt-3 py-2 px-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-md flex items-center gap-2 animate-fadeIn">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{t('closet.addedToAlbum')}</span>
        </div>
      )}
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
    deleteImageFromAllAlbums,
    initializeSampleImages
  } = useCloset();
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [renamingAlbumId, setRenamingAlbumId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  // Hilfsfunktion zum Schließen des Modals
  const closeModal = () => {
    setSelectedImage(null);
    setShowPrompt(false);
  };
  const [viewMode, setViewMode] = useState('albums'); // 'albums' oder 'album-content'
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  // Album Auswahl: Standardmäßig erstes Album auswählen
  const selectedAlbum = albums.find(a => a.id === selectedAlbumId) || albums[0];

  // Initialisiere Beispielbilder beim ersten Laden
  useEffect(() => {
    initializeSampleImages();
  }, [initializeSampleImages]);

  // Funktion zum Öffnen eines Albums mit Animation
  const openAlbum = (albumId) => {
    setIsTransitioning(true);
    setAnimationClass('animate-fade-out');
    
    setTimeout(() => {
      setSelectedAlbumId(albumId);
      setViewMode('album-content');
      setAnimationClass('animate-fade-in');
      setIsTransitioning(false);
    }, 300);
  };

  // Funktion zum Zurückkehren zur Album-Übersicht mit Animation
  const backToAlbums = () => {
    setIsTransitioning(true);
    setAnimationClass('animate-slide-out-right');
    
    setTimeout(() => {
      setViewMode('albums');
      setSelectedAlbumId(null);
      setAnimationClass('animate-slide-in-left');
      setIsTransitioning(false);
    }, 300);
  };

  return (

    <>
      {/* CSS Animations for Album Transitions */}
      <style jsx>{`
        .animate-fade-out {
          opacity: 0;
          transform: scale(0.95);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-fade-in {
          opacity: 1;
          transform: scale(1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: fadeInScale 0.3s ease-out;
        }
        
        .animate-slide-out-right {
          opacity: 0;
          transform: translateX(20px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-slide-in-left {
          opacity: 1;
          transform: translateX(0);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: slideInLeft 0.3s ease-out;
        }
        
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slideInLeft {
          0% {
            opacity: 0;
            transform: translateX(-20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
      
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
            {t('closet.subtitle')}
          </p>
        </div>

        {/* Album Verwaltung oder Album-Inhalt */}
        {viewMode === 'albums' ? (
          /* Album Grid Ansicht */
          <div className={`mb-12 transition-all duration-300 ${animationClass}`}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800">{t('closet.yourAlbums')}</h2>
              
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
                    className="cursor-pointer transition-all duration-300 hover:shadow-xl group relative overflow-hidden border-2 border-purple-200 hover:border-purple-500"
                    onClick={() => openAlbum(album.id)}
                  >
                    {/* Album Preview Image */}
                    <div className="relative aspect-square bg-gray-100 overflow-hidden rounded-2xl">
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
                            {album.images.length} {album.images.length === 1 ? t('closet.image') : t('closet.images')}
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
            <div className={`mb-12 transition-all duration-300 ${animationClass}`}>
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
                        className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200 flex-shrink-0"
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
              ) : selectedAlbum.images.length <= 4 ? (
                // Flex-Layout für 1-4 Bilder, um die Lücke zwischen Bildern zu vermeiden
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                  {selectedAlbum.images.map((img, idx) => (
                    <Card
                      key={img.id || idx}
                      onClick={() => setSelectedImage(img)}
                      className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                    >
                      <div className="relative aspect-[3/4]">
                        <img
                          src={img.image}
                          alt={img.customPrompt || 'Try-On'}
                          className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500 text-center">
                        {img.timestamp ? new Date(img.timestamp).toLocaleDateString() : ''}
                      </p>
                    </Card>
                  ))}
                </div>
              ) : (
                // Columns-Layout für mehr als 4 Bilder
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
                          className="absolute inset-0 w-full h-full object-cover rounded-2xl"
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
          <>
            {/* Decorative Separator */}
            <div className="flex items-center justify-center my-16">
              <div className="h-px w-16 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <div className="mx-4 w-3 h-3 rounded-full bg-purple-500"></div>
              <div className="h-px w-16 bg-gradient-to-r from-pink-500 to-purple-500"></div>
            </div>
            
            <div className="flex justify-center">
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
          </>
        )}

        {/* Bild Detail Modal - nur im Album-Inhalt sichtbar */}
        {viewMode === 'album-content' && selectedImage && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="absolute inset-0 bg-black opacity-50" onClick={closeModal}></div>
            
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full z-10 overflow-hidden">
              {/* Header mit X-Button */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-2xl font-bold text-gray-800">{t('closet.imageDetails')}</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Hauptinhalt - Bild neben Aktionen */}
              <div className="flex flex-col md:flex-row p-6">
                {/* Bild Anzeige - links bei größeren Bildschirmen */}
                <div className="md:w-1/2 flex items-center justify-center mb-6 md:mb-0 md:pr-6">
                  <div className="max-h-[60vh] overflow-hidden flex items-center justify-center">
                    <img
                      src={selectedImage.image}
                      alt={selectedImage.customPrompt || 'Try-On Bild'}
                      className="max-w-full max-h-full object-contain rounded-xl shadow-lg"
                    />
                  </div>
                </div>

                {/* Bild Aktionen - rechts bei größeren Bildschirmen */}
                <div className="md:w-1/2 flex flex-col">
                  {/* Anprobiertes Produkt - Miniatur */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      {t('closet.triedOnProduct') || 'Anprobiertes Produkt'}
                    </h3>
                    
                    {selectedImage.clothingItem ? (
                      // Produkt aus Browse-Bereich
                      <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl border">
                        {selectedImage.clothingItem.image && (
                          <img 
                            src={selectedImage.clothingItem.image} 
                            alt={selectedImage.clothingItem.name || 'Kleidungsstück'} 
                            className="w-16 h-16 object-cover rounded-lg border shadow-sm"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-800 truncate">
                            {selectedImage.clothingItem.name || 'Unbekanntes Kleidungsstück'}
                          </p>
                          {selectedImage.clothingItem.link ? (
                            <a 
                              href={selectedImage.clothingItem.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 hover:underline mt-1"
                            >
                              Produkt ansehen 
                              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          ) : (
                            <p className="text-sm text-gray-500 italic mt-1">
                              {language === 'de' ? 'Kein Link verfügbar' : 'No link available'}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : selectedImage.clothPhoto ? (
                      // Lokal hochgeladenes Kleidungsstück mit clothPhoto
                      <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl border">
                        <img 
                          src={selectedImage.clothPhoto} 
                          alt="Hochgeladenes Kleidungsstück" 
                          className="w-16 h-16 object-cover rounded-lg border shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-600">
                            {language === 'de' ? 'Eigenes Kleidungsstück' : 'Own Clothing Item'}
                          </p>
                          <p className="text-sm text-gray-500 italic">
                            {language === 'de' 
                              ? 'Dieses Foto wurde lokal von Ihnen hochgeladen' 
                              : 'This photo was uploaded locally by you'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      // Fallback wenn keine Kleidungsinformationen verfügbar sind
                      <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl border">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg border flex items-center justify-center">
                          <span className="text-gray-400 text-lg">👕</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-600">
                            {language === 'de' ? 'Kleidungsstück' : 'Clothing Item'}
                          </p>
                          <p className="text-sm text-gray-500 italic">
                            {language === 'de' 
                              ? 'Keine zusätzlichen Informationen verfügbar' 
                              : 'No additional information available'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bild Info falls vorhanden */}
                  {selectedImage.timestamp && (
                    <div className="mb-6">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-600">
                          <span className="font-medium">{t('closet.created')}:</span> {new Date(selectedImage.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Album-Auswahl mit Dropdown */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">{t('closet.addToAlbum')}</h3>
                    <AddToAlbumSection
                      selectedImage={selectedImage}
                      albums={albums}
                      currentAlbumId={selectedAlbum?.id}
                      addImageToAlbum={addImageToAlbum}
                    />
                  </div>
                  
                  {/* Prompt anzeigen/verstecken - immer sichtbar */}
                  <div className="mb-6">
                    {/* Debug: Log image data to console */}
                    {selectedImage && console.log('Selected Image Data:', selectedImage)}
                    <button
                      onClick={() => setShowPrompt(!showPrompt)}
                      className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 font-medium transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>{t('closet.showPrompt') || 'Prompt anzeigen'}</span>
                      <svg className={`w-4 h-4 transition-transform ${showPrompt ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {showPrompt && (
                      <div className="mt-3 p-3 bg-gray-50 border rounded-xl">
                        {selectedImage.fullGeneratedPrompt || selectedImage.customPrompt || selectedImage.prompt ? (
                          <p className="text-gray-700 italic">"{selectedImage.fullGeneratedPrompt || selectedImage.customPrompt || selectedImage.prompt}"</p>
                        ) : (
                          <p className="text-gray-500 italic">{language === 'de' ? 'Kein Prompt gefunden' : 'No prompt found'}</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="mt-auto">
                    <div className="flex gap-3 mb-3">
                      <Button
                        variant="danger"
                        className="flex-1 flex items-center justify-center gap-2 py-3"
                        onClick={() => {
                          if (window.confirm(t('closet.confirmDeleteImage') || 'Bild wirklich löschen?')) {
                            deleteImageFromAllAlbums(selectedImage.id);
                            closeModal();
                          }
                        }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {t('closet.deleteImage')}
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="flex-1 py-3"
                        onClick={closeModal}
                      >
                        {t('closet.close')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>


      {/* Image Detail Modal */}
      {selectedImage && viewMode !== 'album-content' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
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

            {/* Hauptinhalt - Bild neben Aktionen */}
            <div className="flex flex-col md:flex-row p-6">
              {/* Bild Anzeige - links bei größeren Bildschirmen */}
              <div className="md:w-1/2 flex items-center justify-center mb-6 md:mb-0 md:pr-6">
                <div className="max-h-[60vh] overflow-hidden flex items-center justify-center">
                  <img
                    src={selectedImage.image}
                    alt={selectedImage.customPrompt || 'Try-On'}
                    className="max-w-full max-h-full object-contain rounded-xl shadow-lg"
                  />
                </div>
              </div>

              {/* Bild Aktionen - rechts bei größeren Bildschirmen */}
              <div className="md:w-1/2 flex flex-col">
                {/* Anprobiertes Produkt - Miniatur */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    {t('closet.triedOnProduct') || 'Anprobiertes Produkt'}
                  </h3>
                  
                  {selectedImage.clothingItem ? (
                    // Produkt aus Browse-Bereich
                    <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl border">
                      {selectedImage.clothingItem.image && (
                        <img 
                          src={selectedImage.clothingItem.image} 
                          alt={selectedImage.clothingItem.name || 'Kleidungsstück'} 
                          className="w-16 h-16 object-cover rounded-lg border shadow-sm"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-800 truncate">
                          {selectedImage.clothingItem.name || 'Unbekanntes Kleidungsstück'}
                        </p>
                        {selectedImage.clothingItem.link ? (
                          <a 
                            href={selectedImage.clothingItem.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 hover:underline mt-1"
                          >
                            Produkt ansehen 
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        ) : (
                          <p className="text-sm text-gray-500 italic mt-1">
                            {language === 'de' ? 'Kein Link verfügbar' : 'No link available'}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : selectedImage.clothPhoto ? (
                    // Lokal hochgeladenes Kleidungsstück mit clothPhoto
                    <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl border">
                      <img 
                        src={selectedImage.clothPhoto} 
                        alt="Hochgeladenes Kleidungsstück" 
                        className="w-16 h-16 object-cover rounded-lg border shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-600">
                          {language === 'de' ? 'Eigenes Kleidungsstück' : 'Own Clothing Item'}
                        </p>
                        <p className="text-sm text-gray-500 italic">
                          {language === 'de' 
                            ? 'Dieses Foto wurde lokal von Ihnen hochgeladen' 
                            : 'This photo was uploaded locally by you'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    // Fallback wenn keine Kleidungsinformationen verfügbar sind
                    <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl border">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg border flex items-center justify-center">
                        <span className="text-gray-400 text-lg">👕</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-600">
                          {language === 'de' ? 'Kleidungsstück' : 'Clothing Item'}
                        </p>
                        <p className="text-sm text-gray-500 italic">
                          {language === 'de' 
                            ? 'Keine zusätzlichen Informationen verfügbar' 
                            : 'No additional information available'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Image Info mit Prompt Toggle */}
                <div className="mb-6 space-y-3">
                  {selectedImage.timestamp && (
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-600">
                        <span className="font-medium">{t('closet.created')}:</span> {new Date(selectedImage.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {/* Prompt anzeigen/verstecken - immer sichtbar */}
                  <div className="space-y-2">
                    {/* Debug: Log image data to console */}
                    {selectedImage && console.log('Selected Image Data (Modal 2):', selectedImage)}
                    <button
                      onClick={() => setShowPrompt(!showPrompt)}
                      className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 font-medium transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>{t('closet.showPrompt') || 'Prompt anzeigen'}</span>
                      <svg className={`w-4 h-4 transition-transform ${showPrompt ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {showPrompt && (
                      <div className="p-3 bg-white border rounded-lg animate-fadeIn">
                        {selectedImage.customPrompt || selectedImage.prompt ? (
                          <p className="text-gray-700 italic">"{selectedImage.customPrompt || selectedImage.prompt}"</p>
                        ) : (
                          <div>
                            <p className="text-gray-500 italic">{language === 'de' ? 'Kein Prompt gefunden' : 'No prompt found'}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              Debug: customPrompt = "{selectedImage.customPrompt}", prompt = "{selectedImage.prompt}"
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Add to Album Section - nur wenn nicht in einem Album oder in anderen Alben */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">{t('closet.addToAlbum')}</h3>
                  <AddToAlbumSection
                    selectedImage={selectedImage}
                    albums={albums}
                    currentAlbumId={selectedAlbum?.id}
                    addImageToAlbum={addImageToAlbum}
                  />
                </div>

                {/* Action Buttons */}
                <div className="mt-auto">
                  <div className="flex flex-col sm:flex-row gap-3 mb-3">
                    {/* Remove from Album - nur wenn in einem spezifischen Album und nicht "Generierte Bilder" */}
                    {selectedAlbum && selectedAlbum.id !== 'generated' && (
                      <Button
                        variant="secondary"
                        className="flex-1 flex items-center justify-center gap-2 py-3"
                        onClick={() => {
                          removeImageFromAlbum(selectedAlbum.id, selectedImage.id);
                          setSelectedImage(null);
                        }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                        {t('closet.removeFromAlbum')}
                      </Button>
                    )}

                    {/* Delete Image Permanently */}
                    <Button
                      variant="danger"
                      className="flex-1 flex items-center justify-center gap-2 py-3"
                      onClick={() => {
                        if (window.confirm(t('closet.confirmDeleteImage'))) {
                          deleteImageFromAllAlbums(selectedImage.id);
                          setSelectedImage(null);
                        }
                      }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      {t('closet.deleteImage')}
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="flex-1 py-3"
                      onClick={() => setSelectedImage(null)}
                    >
                      {t('closet.close')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>

  );
}
