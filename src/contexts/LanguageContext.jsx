import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation object
const translations = {
  de: {    // Navigation
    'nav.tryOn': 'Try On',
    'nav.closet': 'Kleiderschrank',
    'nav.profile': 'Profil',
    'nav.about': 'About',
    'nav.switchToEnglish': 'Zu English wechseln',
    'nav.switchToGerman': 'Zu Deutsch wechseln',
    
    // Home/Try-On Page
    'home.title': 'KI-gestützte Anprobe',
    'home.subtitle': 'Lade dein Foto hoch und probiere Kleidung virtuell an',
    'home.uploadUser': 'Dein Foto hochladen',
    'home.enterUrl': 'Zalando URL eingeben',
    'home.orUpload': 'oder Kleidungsfoto hochladen',
    'home.generateButton': 'Anprobe generieren',
    'home.clipboardPrompt': 'Möchtest du diesen Link für die Anprobe verwenden?',
    
    // Browse Page
    'browse.title': 'Kleidung durchsuchen',
    'browse.subtitle': 'Entdecke unsere beliebten Herrenprodukte und finde das perfekte Outfit zum virtuellen Anprobieren',
    'browse.categories.all': 'Alle',
    'browse.categories.shirts': 'Hemden',
    'browse.categories.pants': 'Hosen',
    'browse.categories.tshirts': 'Shirts',
    'browse.categories.jackets': 'Jacken',
    'browse.tryNow': 'Jetzt anprobieren',
    'browse.clickHint': 'Klicke auf Bild oder Name, um bei Zalando anzuzeigen',
    'browse.cantFind': 'Findest du nicht, was du suchst?',
    'browse.pasteUrl': 'Füge eine Zalando URL ein, um jeden Artikel aus ihrem Katalog anzuprobieren',
    'browse.uploadCustom': 'Eigenen Artikel hochladen',
    
    // Closet Page
    'closet.title': 'Mein Kleiderschrank',
    'closet.empty': 'Dein Kleiderschrank ist leer',
    'closet.emptySubtitle': 'Beginne damit, Outfits zu erstellen!',
    'closet.browseClothes': 'Kleidung durchsuchen',
    
    // Profile Page
    'profile.title': 'Profil',
    'profile.upload': 'Foto hochladen',
    'profile.confirmSingle': 'Sind Sie sicher, dass Sie kein Bild der Rückseite hochladen wollen?',
      // Try-On Studio
    'studio.generating': 'Generiere...',
    'studio.tryAgain': 'Erneut versuchen',
    'studio.saveToCloset': 'In Kleiderschrank speichern',
    'studio.customPrompt': 'Eigene Eingabe (optional)',
    'studio.clickGenerate': 'Klicke Generieren zum Starten',
    
    // About Page
    'about.title': 'Über TryOnAI',
    
    // Common
    'common.loading': 'Lädt...',
    'common.error': 'Fehler',
    'common.back': 'Zurück',
    'common.next': 'Weiter',
    'common.cancel': 'Abbrechen',
    'common.ok': 'OK'
  },
  en: {    // Navigation
    'nav.tryOn': 'Try On',
    'nav.closet': 'Closet',
    'nav.profile': 'Profile',
    'nav.about': 'About',
    'nav.switchToEnglish': 'Switch to English',
    'nav.switchToGerman': 'Switch to German',
    
    // Home/Try-On Page
    'home.title': 'AI-Powered Try-On',
    'home.subtitle': 'Upload your photo and try on clothes virtually',
    'home.uploadUser': 'Upload Your Photo',
    'home.enterUrl': 'Enter Zalando URL',
    'home.orUpload': 'or upload clothing photo',
    'home.generateButton': 'Generate Try-On',
    'home.clipboardPrompt': 'Would you like to use this link for try-on?',
    
    // Browse Page
    'browse.title': 'Browse Clothing',
    'browse.subtitle': 'Discover our popular men\'s products and find the perfect outfit for virtual try-on',
    'browse.categories.all': 'All',
    'browse.categories.shirts': 'Shirts',
    'browse.categories.pants': 'Pants',
    'browse.categories.tshirts': 'T-Shirts',
    'browse.categories.jackets': 'Jackets',
    'browse.tryNow': 'Try Now',
    'browse.clickHint': 'Click image or name to view on Zalando',
    'browse.cantFind': 'Can\'t find what you\'re looking for?',
    'browse.pasteUrl': 'Paste a Zalando URL to try on any clothing item from their catalog',
    'browse.uploadCustom': 'Upload Custom Item',
    
    // Closet Page
    'closet.title': 'My Closet',
    'closet.empty': 'Your closet is empty',
    'closet.emptySubtitle': 'Start creating outfits!',
    'closet.browseClothes': 'Browse Clothes',
    
    // Profile Page
    'profile.title': 'Profile',
    'profile.upload': 'Upload Photo',
    'profile.confirmSingle': 'Are you sure you don\'t want to upload a back view image?',
      // Try-On Studio
    'studio.generating': 'Generating...',
    'studio.tryAgain': 'Try Again',
    'studio.saveToCloset': 'Save to Closet',
    'studio.customPrompt': 'Custom Prompt (optional)',
    'studio.clickGenerate': 'Click Generate to start',
    
    // About Page
    'about.title': 'About TryOnAI',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.cancel': 'Cancel',
    'common.ok': 'OK'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get language from localStorage or default to 'de'
    const saved = localStorage.getItem('preferred-language');
    return saved || 'de';
  });

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('preferred-language', language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'de' ? 'en' : 'de');
  };

  const value = {
    language,
    setLanguage,
    t,
    toggleLanguage
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
