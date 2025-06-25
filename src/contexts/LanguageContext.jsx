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
    
    // Landing Page
    'landing.experience': 'Erlebe die Zukunft des Online-Shoppings',
    'landing.title': 'Virtuelle Anprobe',
    'landing.subtitle': 'Transformiere dein Online-Shopping-Erlebnis mit unserer KI-gestützten virtuellen Anprobe-Technologie. Sehe genau, wie Kleidung an dir aussehen wird, bevor du kaufst.',
    'landing.tryNow': 'Jetzt testen',
    'landing.viewCloset': 'Kleiderschrank ansehen',
    'landing.howItWorks': 'So funktioniert es',
    'landing.uploadPhoto': 'Lade dein Foto hoch',
    'landing.uploadPhotoDesc': 'Beginne mit dem Hochladen eines Ganzkörperfotos von dir in einer neutralen Pose. Unsere KI wird dein Bild für die perfekte Passform verarbeiten.',
    'landing.chooseClothing': 'Wähle Kleidung',
    'landing.chooseClothingDesc': 'Durchsuche unseren Katalog oder füge eine Zalando-URL ein, um die Kleidung auszuwählen, die du virtuell anprobieren möchtest.',
    'landing.aboutUs': 'Über uns',
    'landing.aboutUsDesc': 'Erfahre mehr über unser Team und unsere Mission, das Online-Shopping durch KI-Technologie zu revolutionieren.',
    'landing.readyTransform': 'Bereit, dein Shopping-Erlebnis zu transformieren?',
    'landing.joinThousands': 'Schließe dich Tausenden von Nutzern an, die ihr Online-Shopping mit TryOnAI revolutioniert haben.',
    'landing.getStarted': 'Jetzt loslegen',
    
    // Home/Try-On Page
    'home.title': 'KI-gestützte Anprobe',
    'home.subtitle': 'Lade dein Foto hoch und probiere Kleidung virtuell an',
    'home.uploadUser': 'Dein Foto hochladen',
    'home.enterUrl': 'Zalando URL eingeben',
    'home.orUpload': 'oder Kleidungsfoto hochladen',
    'home.generateButton': 'Anprobe generieren',
    'home.clipboardPrompt': 'Möchtest du diesen Link für die Anprobe verwenden?',
    'home.virtualTryOn': 'Virtuelle Anprobe',
    'home.uploadYourPhoto': '1. Lade dein Foto hoch',
    'home.chooseClothing': '2. Wähle Kleidung',
    'home.pasteZalandoUrl': 'Zalando URL einfügen',
    'home.zalandoPlaceholder': 'https://www.zalando.de/...',
    'home.extracting': 'Extrahiere...',
    'home.extractImage': 'Produktbild extrahieren',
    'home.or': 'ODER',
    'home.tryOn': 'Anprobieren',
    'home.pleaseUpload': 'Bitte lade zuerst ein Benutzerfoto hoch.',
    'home.pleaseProvide': 'Bitte gib ein Kleidungsbild oder eine URL an.',
    'home.error': 'Fehler:',
    'home.generationFailed': 'Generierung fehlgeschlagen',
    
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
    'profile.requirements': 'Voraussetzungen',
    'profile.profileInfo': 'Profilinformationen',
    'profile.bodyMeasurements': 'Körpermaße',
    'profile.tryOnPhoto': 'Dein TryOn Foto',
    'profile.profileImage': 'Profilbild',
    'profile.saveProfile': 'Profil speichern',
    'profile.profileSaved': 'Profil gespeichert!',
    'profile.email': 'E-Mail',
    'profile.phone': 'Telefon',
    'profile.address': 'Adresse',
    'profile.height': 'Größe',
    'profile.circumference': 'Umfang',
    'profile.placeholder': 'Placeholder',
    'profile.front': 'Vorne',
    'profile.back': 'Hinten',
    'profile.tryOnFront': 'TryOn Foto (Vorne)',
    'profile.tryOnBack': 'TryOn Foto (Hinten)',
    'profile.req1': 'Min. 400 x 400px',
    'profile.req2': 'Max. 2MB',
    'profile.req3': 'Gesamter Körper von Vorne, Seiten oder Hinten',
    'profile.req4': 'Gesicht muss nicht erkennbar sein',

    // Profile Modal
    'profile.modal.welcome': 'Willkommen bei TryOnAI',
    'profile.modal.subtitle': 'Erstelle oder lade dein Profil',
    'profile.modal.login': 'Profil laden',
    'profile.modal.register': 'Neues Profil erstellen',
    'profile.modal.loginDesc': 'Lade ein vorhandenes Profil',
    'profile.modal.registerDesc': 'Erstelle ein neues Profil',
    'profile.modal.close': 'Schließen',
    'profile.import': 'Profil importieren',
    'profile.export': 'Profil exportieren',
    'profile.exportDesc': 'Exportiere dein Profil als JSON-Datei',
    'profile.importDesc': 'Importiere ein Profil aus einer JSON-Datei',
    'profile.logout': 'Abmelden',
    'profile.name': 'Name',
    'profile.exportSuccess': 'Profil erfolgreich exportiert!',
    'profile.importSuccess': 'Profil erfolgreich importiert!',
    'profile.importError': 'Fehler beim Importieren des Profils',
    
    // Try-On Studio
    'studio.generating': 'Generiere...',
    'studio.tryAgain': 'Erneut versuchen',
    'studio.saveToCloset': 'In Kleiderschrank speichern',
    'studio.savedToCloset': 'In Kleiderschrank gespeichert!',
    'studio.customPrompt': 'Eigene Eingabe (optional)',
    'studio.clickGenerate': 'Klicke Generieren zum Starten',
    'studio.yourPhoto': 'Dein Foto',
    'studio.clothingItem': 'Kleidungsstück',
    'studio.result': 'Ergebnis',
    'studio.customization': 'Anpassung',
    
    // About Page
    'about.title': 'Über TryOnAI',
    'about.mission': 'Unsere Mission',
    'about.missionText': 'TryOnAI möchte das Online-Shopping revolutionieren, indem es ein nahtloses virtuelles Anprobe-Erlebnis bietet. Unsere Plattform kombiniert modernste KI-Technologie mit einer intuitiven Benutzeroberfläche, um Ihnen zu helfen, zu visualisieren, wie Kleidung an Ihnen aussehen wird, bevor Sie einen Kauf tätigen.',
    'about.howItWorks': 'Wie es funktioniert',
    'about.step1Title': 'Lade dein Foto hoch',
    'about.step1Text': 'Beginne damit, ein Ganzkörperfoto von dir in einer neutralen Pose hochzuladen.',
    'about.step2Title': 'Wähle Kleidung aus',
    'about.step2Text': 'Wähle Kleidungsstücke aus, indem du ein Bild hochlädst oder eine Zalando-Produkt-URL einfügst.',
    'about.step3Title': 'Generiere Vorschau',
    'about.step3Text': 'Unsere KI-Technologie erstellt eine realistische Vorschau davon, wie die Kleidung an dir aussieht.',
    'about.technology': 'Technologie',
    'about.technologyText': 'TryOnAI wird mit modernen Web-Technologien und KI erstellt:',
    'about.tech1': 'React und Vite für ein responsives Frontend',
    'about.tech2': 'Tailwind CSS für schönes, individuelles Styling',
    'about.tech3': 'State Management mit Zustand',
    'about.tech4': 'KI-gestützte Bildverarbeitung für realistische Anprobe-Ergebnisse',
    'about.privacy': 'Datenschutz & Sicherheit',
    'about.privacyText': 'Wir nehmen Ihren Datenschutz ernst. Alle hochgeladenen Fotos werden sicher verarbeitet und nicht dauerhaft auf unseren Servern gespeichert. Die virtuellen Anprobe-Ergebnisse werden nur in Ihrem lokalen Browser-Speicher zu Ihrer Bequemlichkeit gespeichert.',
    
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
    
    // Landing Page
    'landing.experience': 'Experience the future of online shopping',
    'landing.title': 'Virtual Try-On Experience',
    'landing.subtitle': 'Transform your online shopping experience with our AI-powered virtual try-on technology. See exactly how clothes will look on you before making a purchase.',
    'landing.tryNow': 'Try It Now',
    'landing.viewCloset': 'View Closet',
    'landing.howItWorks': 'How It Works',
    'landing.uploadPhoto': 'Upload Your Photo',
    'landing.uploadPhotoDesc': 'Start by uploading a full-body photo of yourself in a neutral pose. Our AI will process your image for the perfect fit.',
    'landing.chooseClothing': 'Choose Clothing',
    'landing.chooseClothingDesc': 'Browse our catalog or paste a Zalando URL to select the clothes you want to try on virtually.',
    'landing.aboutUs': 'About Us',
    'landing.aboutUsDesc': 'Learn more about our team and our mission to revolutionize online shopping through AI technology.',
    'landing.readyTransform': 'Ready to transform your shopping experience?',
    'landing.joinThousands': 'Join thousands of users who have revolutionized their online shopping with TryOnAI.',
    'landing.getStarted': 'Get Started Now',
    
    // Home/Try-On Page
    'home.title': 'AI-Powered Try-On',
    'home.subtitle': 'Upload your photo and try on clothes virtually',
    'home.uploadUser': 'Upload Your Photo',
    'home.enterUrl': 'Enter Zalando URL',
    'home.orUpload': 'or upload clothing photo',
    'home.generateButton': 'Generate Try-On',
    'home.clipboardPrompt': 'Would you like to use this link for try-on?',
    'home.virtualTryOn': 'Virtual Try-On Experience',
    'home.uploadYourPhoto': '1. Upload Your Photo',
    'home.chooseClothing': '2. Choose Clothing',
    'home.pasteZalandoUrl': 'Paste Zalando URL',
    'home.zalandoPlaceholder': 'https://www.zalando.de/...',
    'home.extracting': 'Extracting...',
    'home.extractImage': 'Extract Product Image',
    'home.or': 'OR',
    'home.tryOn': 'Try On',
    'home.pleaseUpload': 'Please upload a user photo first.',
    'home.pleaseProvide': 'Please provide a clothing image or URL.',
    'home.error': 'Error:',
    'home.generationFailed': 'Generation failed',
    
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
    'profile.requirements': 'Requirements',
    'profile.profileInfo': 'Profile Information',
    'profile.bodyMeasurements': 'Body Measurements',
    'profile.tryOnPhoto': 'Your TryOn Photo',
    'profile.profileImage': 'Profile Image',
    'profile.saveProfile': 'Save Profile',
    'profile.profileSaved': 'Profile saved!',
    'profile.email': 'Email',
    'profile.phone': 'Phone',
    'profile.address': 'Address',
    'profile.height': 'Height',
    'profile.circumference': 'Circumference',
    'profile.placeholder': 'Placeholder',
    'profile.front': 'Front',
    'profile.back': 'Back',
    'profile.tryOnFront': 'TryOn Photo (Front)',
    'profile.tryOnBack': 'TryOn Photo (Back)',
    'profile.req1': 'Min. 400 x 400px',
    'profile.req2': 'Max. 2MB',
    'profile.req3': 'Full body from front, side or back',
    'profile.req4': 'Face doesn\'t need to be visible',

    // Profile Modal
    'profile.modal.welcome': 'Welcome to TryOnAI',
    'profile.modal.subtitle': 'Create or load your profile',
    'profile.modal.login': 'Load Profile',
    'profile.modal.register': 'Create New Profile',
    'profile.modal.loginDesc': 'Load an existing profile',
    'profile.modal.registerDesc': 'Create a new profile',
    'profile.modal.close': 'Close',
    'profile.import': 'Import Profile',
    'profile.export': 'Export Profile',
    'profile.exportDesc': 'Export your profile as JSON file',
    'profile.importDesc': 'Import a profile from JSON file',
    'profile.logout': 'Logout',
    'profile.name': 'Name',
    'profile.exportSuccess': 'Profile exported successfully!',
    'profile.importSuccess': 'Profile imported successfully!',
    'profile.importError': 'Error importing profile',
    
    // Try-On Studio
    'studio.generating': 'Generating...',
    'studio.tryAgain': 'Try Again',
    'studio.saveToCloset': 'Save to Closet',
    'studio.savedToCloset': 'Saved to Closet!',
    'studio.customPrompt': 'Custom Prompt (optional)',
    'studio.clickGenerate': 'Click Generate to start',
    'studio.yourPhoto': 'Your Photo',
    'studio.clothingItem': 'Clothing Item',
    'studio.result': 'Result',
    'studio.customization': 'Customization',
    
    // About Page
    'about.title': 'About TryOnAI',
    'about.mission': 'Our Mission',
    'about.missionText': 'TryOnAI aims to revolutionize online shopping by providing a seamless virtual try-on experience. Our platform combines cutting-edge AI technology with an intuitive interface to help you visualize how clothes will look on you before making a purchase.',
    'about.howItWorks': 'How It Works',
    'about.step1Title': 'Upload Your Photo',
    'about.step1Text': 'Start by uploading a full-body photo of yourself in a neutral pose.',
    'about.step2Title': 'Select Clothing',
    'about.step2Text': 'Choose clothing items by uploading an image or pasting a Zalando product URL.',
    'about.step3Title': 'Generate Preview',
    'about.step3Text': 'Our AI technology will create a realistic preview of how the clothing looks on you.',
    'about.technology': 'Technology',
    'about.technologyText': 'TryOnAI is built using modern web technologies and AI:',
    'about.tech1': 'React and Vite for a responsive frontend',
    'about.tech2': 'Tailwind CSS for beautiful, custom styling',
    'about.tech3': 'State management with Zustand',
    'about.tech4': 'AI-powered image processing for realistic try-on results',
    'about.privacy': 'Privacy & Security',
    'about.privacyText': 'We take your privacy seriously. All uploaded photos are processed securely and are not stored permanently on our servers. The virtual try-on results are saved only in your local browser storage for your convenience.',
    
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
