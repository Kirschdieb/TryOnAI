import React, { useState, useEffect } from "react";
import { useLanguage } from '../../contexts/LanguageContext';
import Card from '../ui/Card';

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
    imageUrl: "",
    tryonImageFrontUrl: "",
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
        // Ensure we only use base64 image URLs
        setProfile({
          ...parsedProfile,
          imageUrl: parsedProfile.imageUrl || "",
          tryonImageFrontUrl: parsedProfile.tryonImageFrontUrl || "",
          tryonImageBackUrl: parsedProfile.tryonImageBackUrl || ""
        });
      } catch (error) {
        console.error('Error parsing saved profile:', error);
        handleLogout(); // Reset if corrupted
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

  const isValidBase64Image = (str) => {
    return str && str.startsWith('data:image/') && str.includes('base64,');
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await convertFileToBase64(file);
        setProfile((prev) => ({ 
          ...prev, 
          imageUrl: base64 
        }));
        // Immediately save to localStorage
        const updatedProfile = { ...profile, imageUrl: base64 };
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      } catch (error) {
        alert('Error converting image. Please try again.');
      }
    }
  };

  const handleTryonFrontImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await convertFileToBase64(file);
        setProfile((prev) => ({ 
          ...prev, 
          tryonImageFrontUrl: base64 
        }));
        // Immediately save to localStorage
        const updatedProfile = { ...profile, tryonImageFrontUrl: base64 };
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      } catch (error) {
        alert('Error converting image. Please try again.');
      }
    }
  };

  const handleTryonBackImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await convertFileToBase64(file);
        setProfile((prev) => ({ 
          ...prev, 
          tryonImageBackUrl: base64 
        }));
        // Immediately save to localStorage
        const updatedProfile = { ...profile, tryonImageBackUrl: base64 };
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      } catch (error) {
        alert('Error converting image. Please try again.');
      }
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
          
          // Clean the imported profile to ensure only base64 images
          const cleanProfile = {
            name: importedProfile.name || "",
            email: importedProfile.email || "",
            phone: importedProfile.phone || "",
            address: importedProfile.address || "",
            height: importedProfile.height || "",
            size: importedProfile.size || "",
            imageUrl: (importedProfile.imageUrl && isValidBase64Image(importedProfile.imageUrl)) ? importedProfile.imageUrl : "",
            tryonImageFrontUrl: (importedProfile.tryonImageFrontUrl && isValidBase64Image(importedProfile.tryonImageFrontUrl)) ? importedProfile.tryonImageFrontUrl : "",
            tryonImageBackUrl: (importedProfile.tryonImageBackUrl && isValidBase64Image(importedProfile.tryonImageBackUrl)) ? importedProfile.tryonImageBackUrl : ""
          };
          
          setProfile(cleanProfile);
          localStorage.setItem('userProfile', JSON.stringify(cleanProfile));
          localStorage.setItem('isLoggedIn', 'true');
          setIsLoggedIn(true);
          setShowModal(false);
          alert(t('profile.importSuccess'));
        } catch (error) {
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
      imageUrl: "",
      tryonImageFrontUrl: "",
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
      imageUrl: "",
      tryonImageFrontUrl: "",
      tryonImageBackUrl: ""
    });
    setShowModal(true);
  };

  const handleExportProfile = () => {
    try {
      // Only export base64 images
      const exportData = {
        ...profile,
        exportDate: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `profile_${profile.name || 'user'}_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      alert(t('profile.exportSuccess'));
    } catch (error) {
      alert('Error exporting profile: ' + error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      // Save profile to localStorage
      localStorage.setItem('userProfile', JSON.stringify(profile));
      
      // Export profile as JSON
      handleExportProfile();
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        alert('Storage full! Profile will only be exported as file, not saved locally.');
        handleExportProfile();
      } else {
        alert('Error saving profile: ' + error.message);
      }
    }
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
    <div className="relative min-h-screen overflow-hidden">
      {/* Decorative curved elements - consistent with Closet page */}
      
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
            {t('profile.title')}
          </h1>
          <p className="text-xl text-purple-600 max-w-3xl mx-auto">
            {t('profile.subtitle') || 'Verwalte dein Profil und deine persönlichen Daten'}
          </p>
        </div>

        {/* Header with Logout */}
        <div className="flex justify-end items-center mb-8">
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg"
          >
            {t('profile.logout')}
          </button>
        </div>

        {/* Profile Content in Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Profile Picture Card */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              {t('profile.profileImage')}
            </h2>
            
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center overflow-hidden border-4 border-purple-200 mb-4 shadow-lg">
                {profile.imageUrl && isValidBase64Image(profile.imageUrl) ? (
                  <img 
                    src={profile.imageUrl} 
                    alt="Profilbild" 
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-purple-400 text-lg font-medium">{t('profile.noImage') || 'Kein Bild'}</span>
                )}
              </div>
              
              <div className="font-semibold text-xl mb-4 text-gray-800">
                {profile.name || "Max Mustermann"}
              </div>
              
              <button 
                type="button" 
                onClick={() => document.getElementById('profileImage').click()}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg"
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
          </Card>
          
          {/* Personal Information Card */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              {t('profile.profileInfo')}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">{t('profile.name')}</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder={t('profile.placeholder')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">{t('profile.email')}</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder={t('profile.placeholder')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">{t('profile.phone')}</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder={t('profile.placeholder')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">{t('profile.address')}</label>
                  <input
                    type="text"
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder={t('profile.placeholder')}
                  />
                </div>
              </div>
            </form>
          </Card>
        </div>

        {/* Body Measurements Card */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {t('profile.bodyMeasurements')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">{t('profile.height')}</label>
              <input
                type="text"
                name="height"
                value={profile.height}
                onChange={handleChange}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder={t('profile.placeholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">{t('profile.circumference')}</label>
              <input
                type="text"
                name="size"
                value={profile.size}
                onChange={handleChange}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder={t('profile.placeholder')}
              />
            </div>
          </div>
        </Card>
        
        {/* TryOn Photos Card */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {t('profile.tryOnPhoto')}
          </h2>
          
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex gap-6 justify-center lg:justify-start flex-wrap">
              {/* Front Photo */}
              <div className="flex flex-col items-center">
                <div className="w-40 h-56 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-purple-200 shadow-lg">
                  {profile.tryonImageFrontUrl && isValidBase64Image(profile.tryonImageFrontUrl) ? (
                    <img 
                      src={profile.tryonImageFrontUrl} 
                      alt="TryOn Vorne" 
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-purple-400 text-center text-sm font-medium">{t('profile.tryOnFront')}</span>
                  )}
                </div>
                <button 
                  type="button" 
                  onClick={() => document.getElementById('tryonImageFront').click()}
                  className="mt-3 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-md"
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
                <div className="w-40 h-56 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-purple-200 shadow-lg">
                  {profile.tryonImageBackUrl && isValidBase64Image(profile.tryonImageBackUrl) ? (
                    <img 
                      src={profile.tryonImageBackUrl} 
                      alt="TryOn Hinten" 
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-purple-400 text-center text-sm font-medium">{t('profile.tryOnBack')}</span>
                  )}
                </div>
                <button 
                  type="button" 
                  onClick={() => document.getElementById('tryonImageBack').click()}
                  className="mt-3 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-md"
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
            
            <div className="flex-1">
              <div className="text-gray-700 font-medium mb-4">{t('profile.requirements')}</div>
              <ul className="text-gray-500 text-sm list-disc pl-5 space-y-2">
                <li>{t('profile.req1')}</li>
                <li>{t('profile.req2')}</li>
                <li>{t('profile.req3')}</li>
                <li>{t('profile.req4')}</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-12 rounded-xl transition-all duration-200 shadow-lg text-lg"
          >
            {t('profile.saveProfile')}
          </button>
        </div>
      </div>
    </div>
  );
}
