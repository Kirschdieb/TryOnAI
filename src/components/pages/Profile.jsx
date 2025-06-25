import React, { useState, useEffect } from "react";
import { useLanguage } from '../../contexts/LanguageContext';

export default function ProfilePage() {
  const { t } = useLanguage();
  
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    height: "",
    size: "",
    image: null,
    imageUrl: "",
    tryonImageFront: null,
    tryonImageFrontUrl: "",
    tryonImageBack: null,
    tryonImageBackUrl: ""
  });

  // Check if user is logged in on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    const loginStatus = localStorage.getItem('isLoggedIn');
    
    if (loginStatus === 'true' && savedProfile) {
      setIsLoggedIn(true);
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(parsedProfile);
      } catch (error) {
        console.error('Error parsing saved profile:', error);
      }
    } else {
      setShowModal(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertFileToBase64(file);
      setProfile((prev) => ({ 
        ...prev, 
        image: base64, 
        imageUrl: URL.createObjectURL(file) 
      }));
    }
  };

  const handleTryonFrontImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertFileToBase64(file);
      setProfile((prev) => ({ 
        ...prev, 
        tryonImageFront: base64, 
        tryonImageFrontUrl: URL.createObjectURL(file) 
      }));
    }
  };

  const handleTryonBackImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertFileToBase64(file);
      setProfile((prev) => ({ 
        ...prev, 
        tryonImageBack: base64, 
        tryonImageBackUrl: URL.createObjectURL(file) 
      }));
    }
  };

  const handleLogin = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const text = await file.text();
          const importedProfile = JSON.parse(text);
          setProfile(importedProfile);
          localStorage.setItem('userProfile', JSON.stringify(importedProfile));
          localStorage.setItem('isLoggedIn', 'true');
          setIsLoggedIn(true);
          setShowModal(false);
          alert(t('profile.importSuccess'));
        } catch (error) {
          console.error('Error importing profile:', error);
          alert(t('profile.importError'));
        }
      }
    };
    input.click();
  };

  const handleRegister = () => {
    const newProfile = {
      name: "Max Mustermann",
      email: "",
      phone: "",
      address: "",
      height: "",
      size: "",
      image: null,
      imageUrl: "",
      tryonImageFront: null,
      tryonImageFrontUrl: "",
      tryonImageBack: null,
      tryonImageBackUrl: ""
    };
    setProfile(newProfile);
    localStorage.setItem('userProfile', JSON.stringify(newProfile));
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
    setShowModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userProfile');
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setProfile({
      name: "",
      email: "",
      phone: "",
      address: "",
      height: "",
      size: "",
      image: null,
      imageUrl: "",
      tryonImageFront: null,
      tryonImageFrontUrl: "",
      tryonImageBack: null,
      tryonImageBackUrl: ""
    });
    setShowModal(true);
  };

  const handleExportProfile = () => {
    const dataStr = JSON.stringify(profile, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `profile_${profile.name || 'user'}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    alert(t('profile.exportSuccess'));
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
    
    // Save profile to localStorage
    localStorage.setItem('userProfile', JSON.stringify(profile));
    
    // Export profile as JSON
    handleExportProfile();
  };

  if (showModal && !isLoggedIn) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-mx-4">
          <h2 className="text-2xl font-bold mb-2 text-center">{t('profile.modal.welcome')}</h2>
          <p className="text-gray-600 mb-6 text-center">{t('profile.modal.subtitle')}</p>
          
          <div className="space-y-4">
            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              {t('profile.modal.login')}
            </button>
            <p className="text-sm text-gray-500 text-center">{t('profile.modal.loginDesc')}</p>
            
            <hr className="my-4" />
            
            <button
              onClick={handleRegister}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              {t('profile.modal.register')}
            </button>
            <p className="text-sm text-gray-500 text-center">{t('profile.modal.registerDesc')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      {/* Header with Logout */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('profile.title')}</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
        >
          {t('profile.logout')}
        </button>
      </div>

      {/* Profile Picture Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
        <div className="flex flex-col items-center flex-1">
          <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-300 mb-2">
            {profile.imageUrl ? (
              <img src={profile.imageUrl} alt={t('profile.profileImage')} className="object-cover w-full h-full" />
            ) : (
              <span className="text-gray-400">{t('profile.profileImage')}</span>
            )}
          </div>
          <div className="font-semibold text-lg mb-1">{profile.name || "Max Mustermann"}</div>
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

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h3 className="font-semibold text-lg mb-2 border-b border-gray-200 pb-1">{t('profile.profileInfo')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('profile.name')}</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full bg-gray-100 border-none rounded px-3 py-2"
                placeholder={t('profile.placeholder')}
              />
            </div>
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
          </div>
          <div className="mt-4">
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
                name="size"
                value={profile.size}
                onChange={handleChange}
                className="w-full bg-gray-100 border-none rounded px-3 py-2"
                placeholder={t('profile.placeholder')}
              />
            </div>
          </div>
        </div>
        
        {/* TryOn Photo Section */}
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
