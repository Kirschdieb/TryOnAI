import { useCloset } from '../../store/useCloset';
import { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Link } from 'react-router-dom';


export default function Dashboard() {
  const { albums } = useCloset();
  const generatedAlbum = albums.find(a => a.id === 'generated');
  const [profile, setProfile] = useState({});
  const [recentImages, setRecentImages] = useState([]);
  const { t, language } = useLanguage();

  useEffect(() => {
    const stored = localStorage.getItem('userProfile');
    if (stored) setProfile(JSON.parse(stored));
    if (generatedAlbum && generatedAlbum.images) {
      const sorted = [...generatedAlbum.images].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      setRecentImages(sorted.slice(0, 5));
    }
  }, [generatedAlbum]);

  // Statistiken für Balken
  const totalImages = generatedAlbum?.images.length || 0;
  const totalAlbums = albums.length;
  const maxImagesInAlbum = Math.max(...albums.map(a => a.images?.length || 0), 1);

  // Profil-Vollständigkeit berechnen (Name, E-Mail, Telefon, Größe, Umfang)
  // Unterstütze sowohl 'circumference' als auch 'umfang' als Feldname
  const getCircumference = () => profile.circumference || profile.umfang || '—';
  // Profilfelder nur mit Größe (ohne Umfang)
  const profileFields = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'E-Mail' },
    { key: 'phone', label: 'Telefon' },
    { key: 'height', label: 'Größe' }
  ];
  const isFilled = (val) => val !== undefined && val !== null && val !== '' && val !== '—';
  const filledFields = profileFields.filter(f => isFilled(profile[f.key]));
  const profilePercent = Math.round((filledFields.length / profileFields.length) * 100);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Debug: Aktuelle Sprache und Übersetzungswert */}
      <div className="mb-4 p-2 bg-yellow-100 text-yellow-900 rounded">
        <div>Sprache: <b>{language}</b></div>
        <div>t('dashboard.title'): <b>{t('dashboard.title')}</b></div>
      </div>
      <h1 className="text-4xl font-extrabold mb-10 text-center text-lavender">{t('dashboard.title')}</h1>

      {/* Statistiken als große Zahlen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
          <span className="text-5xl font-extrabold text-lavender">{totalImages}</span>
          <span className="mt-2 text-lg text-gray-700 font-semibold">{t('dashboard.stats.generated')}</span>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
          <span className="text-5xl font-extrabold text-lavender">{totalAlbums}</span>
          <span className="mt-2 text-lg text-gray-700 font-semibold">{t('dashboard.stats.albums')}</span>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
          <span className="text-2xl font-bold text-lavender">{generatedAlbum?.images[0]?.timestamp ? new Date(generatedAlbum.images[0].timestamp).toLocaleDateString() : '—'}</span>
          <span className="mt-2 text-lg text-gray-700 font-semibold">{t('dashboard.stats.lastImage')}</span>
        </div>
      </div>

      {/* Balkendiagramm: Bilder pro Album */}
      <div className="mb-10 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-700">{t('dashboard.imagesPerAlbum')}</h2>
        <div className="space-y-3">
          {albums.map((album, idx) => (
            <div key={album.id || idx}>
              <div className="flex justify-between mb-1">
                <span className="font-medium text-gray-800">{album.name || t(`albums.${album.id}`) || album.id}</span>
                <span className="text-gray-500">{album.images?.length || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-400 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((album.images?.length || 0) / maxImagesInAlbum) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profil mit Fortschrittsbalken */}
      <div className="mb-10 bg-white rounded-xl shadow p-6 flex flex-col md:flex-row items-center gap-8">
        <div className="flex flex-col items-center justify-center w-full md:w-64">
          <span className="text-5xl font-extrabold text-lavender mb-2">{profilePercent}%</span>
          <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div
              className="h-6 bg-lavender rounded-full transition-all duration-500"
              style={{ width: `${profilePercent}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500">{t('dashboard.profile.complete')}</span>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2 text-gray-700">{t('dashboard.profile.title')}</h2>
          <p className="text-gray-800"><span className="font-semibold">{t('dashboard.profile.name')}:</span> {profile.name || '—'}</p>
          <p className="text-gray-800"><span className="font-semibold">{t('dashboard.profile.email')}:</span> {profile.email || '—'}</p>
          <p className="text-gray-800"><span className="font-semibold">{t('dashboard.profile.phone')}:</span> {profile.phone || '—'}</p>
          <p className="text-gray-800"><span className="font-semibold">{t('dashboard.profile.height')}:</span> {profile.height || '—'}</p>
        </div>
      </div>

      {/* Letzte Aktivitäten */}
      <div className="mb-10 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-700">{t('dashboard.recent')}</h2>
        {recentImages.length === 0 ? (
          <p>{t('dashboard.noRecent')}</p>
        ) : (
          <div className="flex flex-wrap gap-6">
            {recentImages.map((img, idx) => (
              <div key={idx} className="w-36">
                <img src={img.url || img.src} alt={t('dashboard.stats.generated')} className="rounded-xl shadow mb-2 aspect-square object-cover" />
                <div className="text-xs text-gray-500 text-center">{img.timestamp ? new Date(img.timestamp).toLocaleString() : ''}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Schnellzugriffe */}
      <div className="mb-10 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-700">{t('dashboard.quick')}</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/studio" className="bg-blue-500 text-white px-5 py-3 rounded-lg text-lg font-semibold shadow hover:bg-blue-600 transition">{t('dashboard.quick.studio')}</Link>
          <Link to="/closet" className="bg-green-500 text-white px-5 py-3 rounded-lg text-lg font-semibold shadow hover:bg-green-600 transition">{t('dashboard.quick.closet')}</Link>
          <Link to="/profile" className="bg-gray-500 text-white px-5 py-3 rounded-lg text-lg font-semibold shadow hover:bg-gray-600 transition">{t('dashboard.quick.profile')}</Link>
        </div>
      </div>

      {/* Hinweise & Tipps */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-700">{t('dashboard.tips')}</h2>
        <ul className="list-disc ml-6 text-gray-700">
          <li>{t('dashboard.tips.1')}</li>
          <li>{t('dashboard.tips.2')}</li>
          <li>{t('dashboard.tips.3')}</li>
        </ul>
      </div>
    </div>
  );
}
