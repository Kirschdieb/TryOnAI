import React, { useState } from "react";
import { useLanguage } from '../../contexts/LanguageContext';

export default function ProfilePage() {
  const { t } = useLanguage();

  const [profile, setProfile] = useState({
    name: "Max Mustermann",
    email: "",
    phone: "",
    address: "",
    height: "",
    circumference: "",
    image: null,
    imageUrl: "",
    tryonImageFront: null,
    tryonImageFrontUrl: "",
    tryonImageBack: null,
    tryonImageBackUrl: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile((prev) => ({ ...prev, image: file, imageUrl: URL.createObjectURL(file) }));
    }
  };

  const handleTryonFrontImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile((prev) => ({ ...prev, tryonImageFront: file, tryonImageFrontUrl: URL.createObjectURL(file) }));
    }
  };

  const handleTryonBackImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile((prev) => ({ ...prev, tryonImageBack: file, tryonImageBackUrl: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if only one TryOn photo is uploaded
    const hasFrontPhoto = profile.tryonImageFront !== null;
    const hasBackPhoto = profile.tryonImageBack !== null;
    
    if ((hasFrontPhoto && !hasBackPhoto) || (!hasFrontPhoto && hasBackPhoto)) {
      const confirmSingle = window.confirm(t('profile.confirmSingle'));
      if (!confirmSingle) {
        return; // Don't save if user wants to add the missing photo
      }
    }
    
    // Hier könnte ein API-Call zum Speichern erfolgen
    alert(t('profile.profileSaved'));
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      {/* Persönliche Informationen */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
        <div className="flex flex-col items-center flex-1">
          <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-300 mb-2">
            {profile.imageUrl ? (
              <img src={profile.imageUrl} alt={t('profile.profileImage')} className="object-cover w-full h-full" />
            ) : (
              <span className="text-gray-400">{t('profile.profileImage')}</span>
            )}
          </div>
          <div className="font-semibold text-lg mb-1">{profile.name}</div>
          <div className="mt-2">
            <button 
              type="button" 
              onClick={() => document.getElementById('profileImage').click()}
              className="flex items-center gap-2 border-2 border-blue-500 text-blue-500 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition"
            >
              <span className="text-xl">+</span> {t('profile.upload')}
            </button>
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center md:items-start">
          <div className="text-gray-700 font-medium mb-2">{t('profile.requirements')}</div>
          <ul className="text-gray-500 text-sm list-disc pl-5">
            <li>{t('profile.req1')}</li>
            <li>{t('profile.req2')}</li>
          </ul>
        </div>
      </div>

      {/* Profilinformationen */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h3 className="font-semibold text-lg mb-2 border-b border-gray-200 pb-1">{t('profile.profileInfo')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('profile.email')}</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="w-full bg-gray-100 border-none rounded px-3 py-2"
                placeholder={t('profile.placeholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('profile.phone')}</label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="w-full bg-gray-100 border-none rounded px-3 py-2"
                placeholder={t('profile.placeholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('profile.address')}</label>
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleChange}
                className="w-full bg-gray-100 border-none rounded px-3 py-2"
                placeholder={t('profile.placeholder')}
              />
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2 border-b border-gray-200 pb-1">{t('profile.bodyMeasurements')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('profile.height')}</label>
              <input
                type="text"
                name="height"
                value={profile.height}
                onChange={handleChange}
                className="w-full bg-gray-100 border-none rounded px-3 py-2"
                placeholder={t('profile.placeholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('profile.circumference')}</label>
              <input
                type="text"
                name="circumference"
                value={profile.circumference}
                onChange={handleChange}
                className="w-full bg-gray-100 border-none rounded px-3 py-2"
                placeholder={t('profile.placeholder')}
              />
            </div>
          </div>
        </div>
        {/* TryOn Foto */}
        <div>
          <h3 className="font-semibold text-lg mb-2 border-b border-gray-200 pb-1">{t('profile.tryOnPhoto')}</h3>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex gap-4">
              {/* Front Photo */}
              <div className="flex flex-col items-center">
                <div className="w-40 h-56 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {profile.tryonImageFrontUrl ? (
                    <img src={profile.tryonImageFrontUrl} alt={t('profile.tryOnFront')} className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-gray-400">{t('profile.tryOnFront')}</span>
                  )}
                </div>
                <button 
                  type="button" 
                  onClick={() => document.getElementById('tryonImageFront').click()}
                  className="mt-2 flex items-center gap-1 border border-blue-500 text-blue-500 px-3 py-1 rounded text-sm font-medium hover:bg-blue-50 transition"
                >
                  <span className="text-sm">+</span> {t('profile.front')}
                </button>
                <input
                  id="tryonImageFront"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleTryonFrontImageChange}
                />
              </div>
              
              {/* Back Photo */}
              <div className="flex flex-col items-center">
                <div className="w-40 h-56 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {profile.tryonImageBackUrl ? (
                    <img src={profile.tryonImageBackUrl} alt={t('profile.tryOnBack')} className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-gray-400">{t('profile.tryOnBack')}</span>
                  )}
                </div>
                <button 
                  type="button" 
                  onClick={() => document.getElementById('tryonImageBack').click()}
                  className="mt-2 flex items-center gap-1 border border-blue-500 text-blue-500 px-3 py-1 rounded text-sm font-medium hover:bg-blue-50 transition"
                >
                  <span className="text-sm">+</span> {t('profile.back')}
                </button>
                <input
                  id="tryonImageBack"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleTryonBackImageChange}
                />
              </div>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <div className="text-gray-700 font-medium mb-2 mt-2">{t('profile.requirements')}</div>
              <ul className="text-gray-500 text-sm list-disc pl-5">
                <li>{t('profile.req1')}</li>
                <li>{t('profile.req2')}</li>
                <li>{t('profile.req3')}</li>
                <li>{t('profile.req4')}</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded transition"
          >
            {t('profile.saveProfile')}
          </button>
        </div>
      </form>
    </div>
  );
}
