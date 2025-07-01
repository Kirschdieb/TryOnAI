import React, { useState, useEffect } from "react";
import { useLanguage } from '../../contexts/LanguageContext';
import { useCloset } from '../../store/useCloset';

export default function ProfilePage() {
  const { t } = useLanguage();
  const { loadAlbumsFromProfile, saveAlbumsToProfile, albums } = useCloset();
  
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
    tryonImageBackUrl: "",
    albums: []
  });

  // Check if user is logged in on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    const loginStatus = localStorage.getItem('isLoggedIn');
    
    if (loginStatus === 'true' && savedProfile) {
      setIsLoggedIn(true);
      try {
        const parsedProfile = JSON.parse(savedProfile);
        
        // Ensure profile has an ID
        if (!parsedProfile.id) {
          parsedProfile.id = Date.now().toString();
        }
        
        // Ensure we only use base64 image URLs
        const profileWithDefaults = {
          ...parsedProfile,
          imageUrl: parsedProfile.imageUrl || "",
          tryonImageFrontUrl: parsedProfile.tryonImageFrontUrl || "",
          tryonImageBackUrl: parsedProfile.tryonImageBackUrl || "",
          albums: parsedProfile.albums || []
        };
        
        setProfile(profileWithDefaults);
        
        // Load user's albums into closet store (this will merge with defaults)
        loadAlbumsFromProfile(profileWithDefaults);
        
        // After loading, save the merged albums back to localStorage
        setTimeout(() => {
          saveAlbumsToProfile();
        }, 100);
        
      } catch (error) {
        console.error('Error parsing saved profile:', error);
        handleLogout(); // Reset if corrupted
      }
    } else {
      setShowModal(true);
    }
  }, [loadAlbumsFromProfile, saveAlbumsToProfile]);

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
            tryonImageBackUrl: (importedProfile.tryonImageBackUrl && isValidBase64Image(importedProfile.tryonImageBackUrl)) ? importedProfile.tryonImageBackUrl : "",
            albums: importedProfile.albums || [],
            id: importedProfile.id || Date.now().toString()
          };
          
          setProfile(cleanProfile);
          localStorage.setItem('userProfile', JSON.stringify(cleanProfile));
          localStorage.setItem('isLoggedIn', 'true');
          setIsLoggedIn(true);
          setShowModal(false);
          
          // Load imported albums into store (this will merge with defaults)
          loadAlbumsFromProfile(cleanProfile);
          
          // Save the merged albums (with defaults) back to localStorage
          setTimeout(() => {
            saveAlbumsToProfile();
          }, 100);
          
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
      tryonImageBackUrl: "",
      albums: [],
      id: Date.now().toString()
    };
    setProfile(newProfile);
    localStorage.setItem('userProfile', JSON.stringify(newProfile));
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
    setShowModal(false);
    
    // Load default albums into store (this will add all default albums)
    loadAlbumsFromProfile(newProfile);
    
    // Save the merged albums (with defaults) back to localStorage
    setTimeout(() => {
      saveAlbumsToProfile();
    }, 100);
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
      tryonImageBackUrl: "",
      albums: []
    });
    setShowModal(true);
  };

  const handleExportProfile = () => {
    try {
      // Get current album references from localStorage (not loaded URLs)
      const savedProfile = localStorage.getItem('userProfile');
      const profileData = savedProfile ? JSON.parse(savedProfile) : profile;
      
      const exportData = {
        ...profileData,
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

  // Function to save profile to assets folder as default
  const handleSaveProfileToAssets = () => {
    try {
      // Get current profile from localStorage (should have latest albums)
      const savedProfile = localStorage.getItem('userProfile');
      const profileData = savedProfile ? JSON.parse(savedProfile) : profile;
      
      const exportData = {
        ...profileData,
        exportDate: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      // Default save to assets folder with user name
      const exportFileDefaultName = `profile_${profile.name || 'user'}_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      // Clear instructions for Windows file path
      const projectAssetsPath = 'c:\\Users\\Geiler Stecher\\Documents\\unikram\\python\\DPI_Projekt\\TryOnAI\\src\\assets\\';
      const downloadPath = `%USERPROFILE%\\Downloads\\${exportFileDefaultName}`;
      
      const instructions = `✅ Profile downloaded successfully!

📁 TO MOVE TO PROJECT ASSETS:

1. Open File Explorer
2. Go to your Downloads folder
3. Find: ${exportFileDefaultName}
4. Cut the file (Ctrl+X)
5. Navigate to: ${projectAssetsPath}
6. Paste the file (Ctrl+V)

🎯 The profile is now ready for use in your project!`;
      
      alert(instructions);
    } catch (error) {
      alert('Error saving profile: ' + error.message);
    }
  };

  // Alternative: Copy profile data to clipboard for easy pasting into assets
  const handleCopyProfileToClipboard = () => {
    try {
      // Get current profile from localStorage (should have latest albums)
      const savedProfile = localStorage.getItem('userProfile');
      const profileData = savedProfile ? JSON.parse(savedProfile) : profile;
      
      const exportData = {
        ...profileData,
        exportDate: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      
      // Copy to clipboard
      navigator.clipboard.writeText(dataStr).then(() => {
        const filename = `profile_${profile.name || 'user'}_${new Date().toISOString().split('T')[0]}.json`;
        const projectAssetsPath = 'c:\\Users\\Geiler Stecher\\Documents\\unikram\\python\\DPI_Projekt\\TryOnAI\\src\\assets\\';
        
        const instructions = `✅ Profile copied to clipboard!

📋 TO CREATE FILE IN PROJECT ASSETS:

1. Open VS Code or File Explorer
2. Navigate to: ${projectAssetsPath}
3. Create new file: ${filename}
4. Paste the content (Ctrl+V)
5. Save the file

🎯 The profile is now ready for use in your project!`;
        
        alert(instructions);
      }).catch(() => {
        // Fallback to download if clipboard fails
        alert('Clipboard access failed. Switching to download method...');
        handleSaveProfileToAssets();
      });
    } catch (error) {
      alert('Error copying profile: ' + error.message);
    }
  };

  const handleExportWithInstructions = () => {
    try {
      // Auto-save current albums to profile first
      saveAlbumsToProfile();
      
      // Update profile in localStorage
      localStorage.setItem('userProfile', JSON.stringify(profile));
      
      // Then export
      handleSaveProfileToAssets();
    } catch (error) {
      alert('Error exporting profile: ' + error.message);
    }
  };

  const handleCopyWithInstructions = () => {
    try {
      // Auto-save current albums to profile first
      saveAlbumsToProfile();
      
      // Update profile in localStorage
      localStorage.setItem('userProfile', JSON.stringify(profile));
      
      // Then copy to clipboard
      handleCopyProfileToClipboard();
    } catch (error) {
      alert('Error copying profile: ' + error.message);
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
            {profile.imageUrl && isValidBase64Image(profile.imageUrl) ? (
              <img 
                src={profile.imageUrl} 
                alt="Profilbild" 
                className="object-cover w-full h-full"
              />
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
      <div className="space-y-8">
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
                  {profile.tryonImageFrontUrl && isValidBase64Image(profile.tryonImageFrontUrl) ? (
                    <img 
                      src={profile.tryonImageFrontUrl} 
                      alt="TryOn Vorne" 
                      className="object-cover w-full h-full"
                    />
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
                  {profile.tryonImageBackUrl && isValidBase64Image(profile.tryonImageBackUrl) ? (
                    <img 
                      src={profile.tryonImageBackUrl} 
                      alt="TryOn Hinten" 
                      className="object-cover w-full h-full"
                    />
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

        {/* Album Statistics Section */}
        <div>
          <h3 className="font-semibold text-lg mb-2 border-b border-gray-200 pb-1">{t('profile.albumOverview') || 'Album Overview'}</h3>
          <AlbumStatistics />
        </div>
        
        <div className="flex flex-col gap-4">
          {/* Save & Export Options */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-center">Save Profile</h3>
            <p className="text-sm text-gray-600 mb-4 text-center">
              Choose how to save your profile. Both options will automatically save all changes and albums.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {/* Download Option */}
              <button
                type="button"
                onClick={handleExportWithInstructions}
                className="flex-1 sm:flex-none bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded transition flex items-center justify-center gap-2"
              >
                <span>📥</span>
                Save & Download
              </button>
              
              {/* Clipboard Option */}
              <button
                type="button"
                onClick={handleCopyWithInstructions}
                className="flex-1 sm:flex-none bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded transition flex items-center justify-center gap-2"
              >
                <span>📋</span>
                Save & Copy
              </button>
            </div>
            
            <div className="mt-3 text-xs text-gray-500 text-center">
              <p><strong>Save & Download:</strong> Downloads profile file to move to assets folder</p>
              <p><strong>Save & Copy:</strong> Copies profile JSON to create new file in assets folder</p>
            </div>
          </div>
        </div>
    </div>
    </div>
  );
}

// Simple Album Statistics Component (Essential functionality only)
const AlbumStatistics = () => {
  const { albums } = useCloset();

  const totalImages = albums.reduce((sum, album) => sum + album.images.length, 0);
  const customAlbums = albums.filter(a => !['generated', 'sommer', 'herbst', 'winter', 'fruehling', 'formal', 'casual', 'sport'].includes(a.id));

  return (
    <div className="bg-gray-50 rounded-lg p-4 mt-4">
      <h4 className="font-semibold mb-2">Your Albums</h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Total Albums:</span>
          <span className="ml-2 font-medium">{albums.length}</span>
        </div>
        <div>
          <span className="text-gray-600">Total Images:</span>
          <span className="ml-2 font-medium">{totalImages}</span>
        </div>
        <div>
          <span className="text-gray-600">Custom Albums:</span>
          <span className="ml-2 font-medium">{customAlbums.length}</span>
        </div>
        <div>
          <span className="text-gray-600">Generated Images:</span>
          <span className="ml-2 font-medium">{albums.find(a => a.id === 'generated')?.images.length || 0}</span>
        </div>
      </div>
    </div>
  );
};
