import React, { useState } from "react";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "Max Mustermann",
    email: "",
    phone: "",
    address: "",
    height: "",
    size: "",
    image: null,
    imageUrl: "",
    tryonImage: null,
    tryonImageUrl: ""
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

  const handleTryonImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile((prev) => ({ ...prev, tryonImage: file, tryonImageUrl: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Hier könnte ein API-Call zum Speichern erfolgen
    alert("Profil gespeichert!");
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      {/* Persönliche Informationen */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
        <div className="flex flex-col items-center flex-1">
          <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-300 mb-2">
            {profile.imageUrl ? (
              <img src={profile.imageUrl} alt="Profilbild" className="object-cover w-full h-full" />
            ) : (
              <span className="text-gray-400">Profilbild</span>
            )}
          </div>
          <div className="font-semibold text-lg mb-1">{profile.name}</div>
          <label htmlFor="profileImage" className="inline-block mt-2">
            <button type="button" className="flex items-center gap-2 border-2 border-blue-500 text-blue-500 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition">
              <span className="text-xl">+</span> Upload Photo
            </button>
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
        <div className="flex-1 flex flex-col items-center md:items-start">
          <div className="text-gray-700 font-medium mb-2">Voraussetzungen</div>
          <ul className="text-gray-500 text-sm list-disc pl-5">
            <li>Min. 400 x 400px</li>
            <li>Max. 2MB</li>
          </ul>
        </div>
      </div>

      {/* Profilinformationen */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h3 className="font-semibold text-lg mb-2 border-b border-gray-200 pb-1">Profilinformationen</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">E-Mail</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="w-full bg-gray-100 border-none rounded px-3 py-2"
                placeholder="Placeholder"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Telefon</label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="w-full bg-gray-100 border-none rounded px-3 py-2"
                placeholder="Placeholder"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Adresse</label>
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleChange}
                className="w-full bg-gray-100 border-none rounded px-3 py-2"
                placeholder="Placeholder"
              />
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2 border-b border-gray-200 pb-1">Körpermaße</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Größe</label>
              <input
                type="text"
                name="height"
                value={profile.height}
                onChange={handleChange}
                className="w-full bg-gray-100 border-none rounded px-3 py-2"
                placeholder="Placeholder"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Umfang</label>
              <input
                type="text"
                name="size"
                value={profile.size}
                onChange={handleChange}
                className="w-full bg-gray-100 border-none rounded px-3 py-2"
                placeholder="Placeholder"
              />
            </div>
          </div>
        </div>
        {/* TryOn Foto */}
        <div>
          <h3 className="font-semibold text-lg mb-2 border-b border-gray-200 pb-1">Dein TryOn Foto</h3>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex gap-4">
              <div className="w-40 h-56 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {profile.tryonImageUrl ? (
                  <img src={profile.tryonImageUrl} alt="TryOn" className="object-cover w-full h-full" />
                ) : (
                  <span className="text-gray-400">TryOn Foto</span>
                )}
              </div>
              <div className="w-40 h-56 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {/* Platz für weiteres Bild, falls gewünscht */}
                <span className="text-gray-400">TryOn Foto</span>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <label htmlFor="tryonImage" className="inline-block mb-2">
                <button type="button" className="flex items-center gap-2 border-2 border-blue-500 text-blue-500 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition">
                  <span className="text-xl">+</span> Upload Photo
                </button>
                <input
                  id="tryonImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleTryonImageChange}
                />
              </label>
              <div className="text-gray-700 font-medium mb-2 mt-2">Voraussetzungen</div>
              <ul className="text-gray-500 text-sm list-disc pl-5">
                <li>Min. 400 x 400px</li>
                <li>Max. 2MB</li>
                <li>Gesamter Körper von Vorne, Seiten oder Hinten</li>
                <li>Gesicht muss nicht erkennbar sein</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded transition"
          >
            Profil speichern
          </button>
        </div>
      </form>
    </div>
  );
}
