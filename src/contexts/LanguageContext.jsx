import { createContext, useContext, useState, useEffect } from 'react';
import { useCloset } from '../store/useCloset';

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
    'nav.home': 'Startseite',
    'nav.tryOn': 'Try On',
    'nav.closet': 'Kleiderschrank',
    'nav.browse': 'Durchsuchen',
    'nav.profile': 'Profil',
    'nav.faq': 'FAQ',
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
    'landing.howItWorksSubtitle': 'In nur drei einfachen Schritten zu deinem perfekten Outfit',
    'landing.uploadPhoto': 'Lade dein Foto hoch',
    'landing.uploadPhotoDesc': 'Beginne mit dem Hochladen eines Ganzkörperfotos von dir in einer neutralen Pose. Unsere KI wird dein Bild für die perfekte Passform verarbeiten.',
    'landing.chooseClothing': 'Wähle Kleidung',
    'landing.chooseClothingDesc': 'Durchsuche unseren Katalog oder füge eine Zalando-URL ein, um die Kleidung auszuwählen, die du virtuell anprobieren möchtest.',
    'landing.aboutUs': 'Über uns',
    'landing.aboutUsDesc': 'Erfahre mehr über unser Team und unsere Mission, das Online-Shopping durch KI-Technologie zu revolutionieren.',
    'landing.aiMagic': 'KI-Magie',
    'landing.aiMagicDesc': 'Unsere KI erstellt realistische Anproben in Sekunden - ohne Umkleide!',
    'landing.readyTransform': 'Bereit, dein Shopping-Erlebnis zu transformieren?',
    'landing.ctaBadge': 'Bereit für die Zukunft des Shopping?',
    'landing.joinThousands': 'Schließe dich Tausenden von Nutzern an, die ihr Online-Shopping mit TryOnAI revolutioniert haben.',
    'landing.getStarted': 'Jetzt loslegen',
    // Demo Section
    'landing.demoTitle': 'Erlebe TryOnAI in Aktion',
    'landing.demoDescription': 'Sieh dir an, wie einfach es ist, Kleidung virtuell anzuprobieren. Von der Fotoauswahl bis zum fertigen Ergebnis - alles in wenigen Sekunden.',
    // FAQ Section
    'landing.faq.title': 'Häufig gestellte Fragen',
    'landing.faq.badge': 'Häufig gestellte Fragen',
    'landing.faq.q1': 'Wie funktioniert TryOnAI?',
    'landing.faq.a1': 'Lade einfach ein Foto hoch, wähle Kleidung aus und erlebe die Vorschau in Echtzeit.',
    'landing.faq.q2': 'Welche Dateiformate werden unterstützt?',
    'landing.faq.a2': 'Wir unterstützen JPG, PNG und GIF.',
    'landing.faq.q3': 'Ist meine Privatsphäre sicher?',
    'landing.faq.a3': 'Ja, alle Bilder werden verschlüsselt und nur temporär verarbeitet.',
    'landing.questionNotFound': 'Deine Frage nicht gefunden?',
    'landing.goToFAQSection': 'Zum kompletten FAQ-Bereich',
    
    // Testimonials Section

    'landing.testimonials.title': 'Was unsere Nutzer sagen',
    'landing.testimonials.badge': 'Das sagen unsere Nutzer',
    'landing.testimonials.u1.name': 'Marcus Weber',
    'landing.testimonials.u1.quote': 'TryOnAI hat mein Online-Shopping revolutioniert! Ich kann endlich sehen, wie Kleidung an mir aussieht, bevor ich kaufe.',
    'landing.testimonials.u2.name': 'Lisa Schmidt',
    'landing.testimonials.u2.quote': 'Unglaublich realistisch! Die KI-Technologie ist beeindruckend und spart mir so viel Zeit beim Einkaufen.',
    'landing.testimonials.u3.name': 'Anna Müller',
    'landing.testimonials.u3.quote': 'Perfekt für Online-Shopping! Nie wieder Fehlkäufe dank der virtuellen Anprobe.',
    
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
    'home.pasteZalandoUrl': 'Shop URL einfügen',
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
    'browse.categories.dresses': 'Kleider',
    'browse.categories.tops': 'Oberteile',
    'browse.categories.bottoms': 'Hosen',
    'browse.categories.outerwear': 'Außenbekleidung',
    'browse.categories.tshirts': 'Shirts',
    'browse.categories.jackets': 'Jacken',
    'browse.categories.shirts': 'Hemden',
    'browse.categories.pants': 'Hosen',
    'browse.categoryTitle': 'Kategorien',
    'browse.tryNow': 'Jetzt anprobieren',
    'browse.clickHint': 'Klicke auf Bild oder Name, um bei Zalando anzuzeigen',
    'browse.cantFind': 'Findest du nicht, was du suchst?',
    'browse.pasteUrl': 'Füge eine Zalando URL ein, um jeden Artikel aus ihrem Katalog anzuprobieren',
    'browse.uploadCustom': 'Eigenen Artikel hochladen',
    
    // Closet Page
    'closet.title': 'Mein Kleiderschrank',
    'closet.subtitle': 'Verwalte deine Anprobe-Bilder und erstelle persönliche Kollektionen',
    'closet.yourAlbums': 'Deine Alben',
    'closet.image': 'Bild',
    'closet.images': 'Bilder',
    'closet.empty': 'Dein Kleiderschrank ist leer',
    'closet.emptySubtitle': 'Beginne damit, Outfits zu erstellen!',
    'closet.albumEmpty': 'Dieses Album ist noch leer',
    'closet.albumEmptyDesc': 'Speichere deine Try-On Bilder in diesem Album, um eine persönliche Kollektion zu erstellen.',
    'closet.editButton': 'Bearbeiten',
    'closet.deleteButton': 'Löschen',
    'closet.backToAlbums': 'Zurück zu Alben',
    'closet.lastEdited': 'Zuletzt bearbeitet',
    'closet.imageDetails': 'Bild Details',
    'closet.created': 'Erstellt',
    'closet.prompt': 'Prompt',
    'closet.addToAlbum': 'Zu Album hinzufügen',
    'closet.removeFromAlbum': 'Aus Album entfernen',
    'closet.deleteImage': 'Bild löschen',
    'closet.confirmDeleteImage': 'Dieses Bild wirklich dauerhaft löschen?',
    'closet.selectAlbum': 'Album wählen...',
    'closet.triedOnProduct': 'Anprobiertes Produkt',
    'closet.showPrompt': 'Prompt anzeigen',
    'closet.close': 'Schließen',
    'closet.enterAlbumId': 'Album auswählen',
    'closet.browseClothes': 'Kleidung durchsuchen',
    'closet.browseBoxTitle': 'Weitere Kleidung entdecken',
    'closet.browseBoxDesc': 'Hier kannst du weitere Kleidungsideen über Zalando durchstöbern und Inspiration für deinen Kleiderschrank sammeln.',
    
    // Profile Page
    'profile.title': 'Profil',
    'profile.subtitle': 'Verwalte dein Profil und deine persönlichen Daten',
    'profile.upload': 'Foto hochladen',
    'profile.confirmSingle': 'Sind Sie sicher, dass Sie kein Bild der Rückseite hochladen wollen?',
    'profile.requirements': 'Voraussetzungen',
    'profile.profileInfo': 'Profilinformationen',
    'profile.bodyMeasurements': 'Körpermaße',
    'profile.tryOnPhoto': 'Dein TryOn Foto',
    'profile.profileImage': 'Profilbild',
    'profile.noImage': 'Kein Bild',
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
    'studio.title': 'Try-On Studio',
    'studio.subtitle': 'Erstelle deine perfekte virtuelle Anprobe mit KI-Power',
    'studio.poseTitle': 'Pose wählen',
    'studio.backgroundTitle': 'Hintergrund wählen',
    'studio.qualityTitle': 'Bildqualität',
    'studio.qualityDescription': 'Wähle die gewünschte Qualität (höhere Qualität = längere Generierungszeit)',
    'studio.qualityLow': 'Niedrig (schnell)',
    'studio.qualityMedium': 'Mittel (empfohlen)',
    'studio.qualityHigh': 'Hoch (langsam)',
    'studio.saveTitle': 'Bild speichern',
    'studio.saveDescription1': 'Das Bild wird automatisch in ',
    'studio.saveDescriptionBold': '"Generierte Bilder"',
    'studio.saveDescription2': ' gespeichert. Optional kannst du es zusätzlich in einem anderen Album speichern.',
    'studio.saveToAlbumLabel': 'Zusätzlich speichern in:',
    'studio.selectAlbum': 'Album wählen...',
    'studio.saveButton': 'Speichern',
    'studio.saveButtonSaved': 'Gespeichert ✓',
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
    
    // Try-On Studio Poses
    'studio.pose.standing': 'Stehend',
    'studio.pose.sitting': 'Sitzend',
    'studio.pose.pockets': 'Hände in den Taschen',
    'studio.pose.armscrossed': 'Arme verschränkt',
    // Try-On Studio Backgrounds
    'studio.background.original': 'Originalen Hintergrund beibehalten',
    'studio.background.summer': 'Sommerliches Strandambiente',
    'studio.background.autumn': 'Herbstliche Regenszene',
    'studio.background.winter': 'Winterliche Schneelandschaft',
    
    // About Page
    'about.title': 'Über TryOnAI',
    'about.subtitle': 'Erfahre mehr über unsere Vision und Technologie',
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
    'common.ok': 'OK',
    
    // Closet / Album
    'closet.addedToAlbum': 'Erfolgreich zum Album hinzugefügt!',
    'closet.noAlbumsAvailable': 'Keine weiteren Alben verfügbar',
    
    // Albums
    'albums.generated': 'Generierte Bilder',
    'albums.summer': 'Sommer',
    'albums.autumn': 'Herbst',
    'albums.winter': 'Winter',
    'albums.spring': 'Frühling',
    'albums.formal': 'Formal & Business',
    'albums.casual': 'Casual & Alltag',
    'albums.sport': 'Sport & Fitness',
  },
  en: {    // Navigation
    'nav.home': 'Homepage',
    'nav.tryOn': 'Try On',
    'nav.closet': 'Closet',
    'nav.browse': 'Browse',
    'nav.profile': 'Profile',
    'nav.faq': 'FAQ',
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
    'landing.howItWorksSubtitle': 'Your perfect outfit in just three simple steps',
    'landing.uploadPhoto': 'Upload Your Photo',
    'landing.uploadPhotoDesc': 'Start by uploading a full-body photo of yourself in a neutral pose. Our AI will process your image for the perfect fit.',
    'landing.chooseClothing': 'Choose Clothing',
    'landing.chooseClothingDesc': 'Browse our catalog or paste a Zalando URL to select the clothes you want to try on virtually.',
    'landing.aboutUs': 'About Us',
    'landing.aboutUsDesc': 'Learn more about our team and our mission to revolutionize online shopping through AI technology.',
    'landing.aiMagic': 'AI Magic',
    'landing.aiMagicDesc': 'Our AI creates realistic try-ons in seconds - no dressing room required!',
    'landing.readyTransform': 'Ready to transform your shopping experience?',
    'landing.ctaBadge': 'Ready for the future of shopping?',
    'landing.joinThousands': 'Join thousands of users who have revolutionized their online shopping with TryOnAI.',
    'landing.getStarted': 'Get Started Now',
    // Demo Section
    'landing.demoTitle': 'Experience TryOnAI in Action',
    'landing.demoDescription': 'See how easy it is to try on clothes virtually. From photo selection to final result - everything in just seconds.',
    // FAQ Section
    'landing.faq.title': 'Frequently Asked Questions',
    'landing.faq.badge': 'Frequently Asked Questions',
    'landing.faq.q1': 'How does TryOnAI work?',
    'landing.faq.a1': 'Simply upload a photo, choose clothing, and see a real-time preview.',
    'landing.faq.q2': 'Which file formats are supported?',
    'landing.faq.a2': 'We support JPG, PNG, and GIF.',
    'landing.faq.q3': 'Is my privacy protected?',
    'landing.faq.a3': 'Yes, all images are encrypted and processed temporarily only.',
    'landing.questionNotFound': 'Didn\'t find your question?',
    'landing.goToFAQSection': 'Go to complete FAQ section',
    
    // Testimonials Section
    'landing.testimonials.title': 'What our users say',
    'landing.testimonials.badge': 'What our users say',
    'landing.testimonials.u1.name': 'Marcus Weber',
    'landing.testimonials.u1.quote': 'TryOnAI has revolutionized my online shopping! I can finally see how clothes look on me before buying.',
    'landing.testimonials.u2.name': 'Lisa Schmidt',
    'landing.testimonials.u2.quote': 'Incredibly realistic! The AI technology is impressive and saves me so much time shopping.',
    'landing.testimonials.u3.name': 'Anna Müller',
    'landing.testimonials.u3.quote': 'Perfect for online shopping! No more wrong purchases thanks to virtual try-on.',

    
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
    'home.pasteZalandoUrl': 'Paste Shop URL',
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
    'browse.title': 'Browse Items',
    'browse.subtitle': 'Discover and try on our latest fashion',
    'browse.categories.all': 'All',
    'browse.categories.dresses': 'Dresses',
    'browse.categories.tops': 'Tops',
    'browse.categories.bottoms': 'Bottoms',
    'browse.categories.outerwear': 'Outerwear',
    'browse.categories.shirts': 'Shirts',
    'browse.categories.pants': 'Pants',
    'browse.categoryTitle': 'Categories',
    'browse.categories.tshirts': 'T-Shirts',
    'browse.categories.jackets': 'Jackets',
    'browse.tryNow': 'Try Now',
    'browse.clickHint': 'Click image or name to view on Zalando',
    'browse.cantFind': 'Can\'t find what you\'re looking for?',
    'browse.pasteUrl': 'Paste a Zalando URL to try on any clothing item from their catalog',
    'browse.uploadCustom': 'Upload Custom Item',
    
    // Closet Page
    'closet.title': 'My Closet',
    'closet.subtitle': 'Manage your try-on images and create personalized collections',
    'closet.yourAlbums': 'Your Albums',
    'closet.image': 'image',
    'closet.images': 'images',
    'closet.empty': 'Your closet is empty',
    'closet.emptySubtitle': 'Start creating outfits!',
    'closet.albumEmpty': 'This album is still empty',
    'closet.albumEmptyDesc': 'Save your Try-On images in this album to create a personal collection.',
    'closet.editButton': 'Edit',
    'closet.deleteButton': 'Delete',
    'closet.backToAlbums': 'Back to Albums',
    'closet.lastEdited': 'Last edited',
    'closet.imageDetails': 'Image Details',
    'closet.created': 'Created',
    'closet.prompt': 'Prompt',
    'closet.addToAlbum': 'Add to Album',
    'closet.removeFromAlbum': 'Remove from Album',
    'closet.deleteImage': 'Delete Image',
    'closet.confirmDeleteImage': 'Really delete this image permanently?',
    'closet.selectAlbum': 'Select album...',
    'closet.triedOnProduct': 'Tried-On Product',
    'closet.showPrompt': 'Show Prompt',
    'closet.close': 'Close',
    'closet.enterAlbumId': 'Select album',
    'closet.browseClothes': 'Browse Clothes',
    'closet.browseBoxTitle': 'Discover more clothing',
    'closet.browseBoxDesc': 'Here you can browse more clothing ideas via Zalando and get inspiration for your closet.',
    
    // Profile Page
    'profile.title': 'Profile',
    'profile.subtitle': 'Manage your profile and personal data',
    'profile.upload': 'Upload Photo',
    'profile.confirmSingle': 'Are you sure you don\'t want to upload a back view image?',
    'profile.requirements': 'Requirements',
    'profile.profileInfo': 'Profile Information',
    'profile.bodyMeasurements': 'Body Measurements',
    'profile.tryOnPhoto': 'Your TryOn Photo',
    'profile.profileImage': 'Profile Image',
    'profile.noImage': 'No Image',
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
    'studio.title': 'Try-On Studio',
    'studio.subtitle': 'Create your perfect virtual try-on with AI power',
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
    
    // Try-On Studio Poses
    'studio.pose.standing': 'Standing',
    'studio.pose.sitting': 'Sitting',
    'studio.pose.pockets': 'Hands in pockets',
    'studio.pose.armscrossed': 'Arms crossed',
    // Try-On Studio Backgrounds
    'studio.background.original': 'Keep original background',
    'studio.background.summer': 'Summer beach scene',
    'studio.background.autumn': 'Autumn rain scene',
    'studio.background.winter': 'Winter snow landscape',
    
    // About Page
    'about.title': 'About TryOnAI',
    'about.subtitle': 'Learn more about our vision and technology',
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
    'common.ok': 'OK',
    
    // Closet / Album
    'closet.addedToAlbum': 'Successfully added to album!',
    'closet.noAlbumsAvailable': 'No other albums available',
    
    // Albums
    'albums.generated': 'Generated Pictures',
    'albums.summer': 'Summer',
    'albums.autumn': 'Autumn',
    'albums.winter': 'Winter',
    'albums.spring': 'Spring',
    'albums.formal': 'Formal & Business',
    'albums.casual': 'Casual & Everyday',
    'albums.sport': 'Sport & Fitness',

    // Try-On Studio Section Titles & Save
    'studio.backgroundTitle': 'Choose background',
    'studio.poseTitle': 'Choose pose',
    'studio.qualityTitle': 'Image Quality',
    'studio.qualityDescription': 'Select the quality of the generated image. Higher quality may take longer.',
    'studio.qualityLow': 'Low',
    'studio.qualityMedium': 'Medium',
    'studio.qualityHigh': 'High',
    'studio.saveTitle': 'Save Image',
    'studio.saveDescription1': 'The image is automatically saved to the ',
    'studio.saveDescriptionBold': 'Generated Pictures',
    'studio.saveDescription2': ' album. You can also save it to an additional album.',
    'studio.saveToAlbumLabel': 'Save to another album:',
    'studio.selectAlbum': 'Select album...',
    'studio.saveButton': 'Save to Closet',
    'studio.saveButtonSaved': 'Saved to Closet',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get language from localStorage or default to 'de'
    const saved = localStorage.getItem('preferred-language');
    return saved || 'de';
  });

  const updateAlbumLanguage = useCloset(state => state.updateAlbumLanguage);

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('preferred-language', language);
  }, [language]);

  // Update album names when language changes
  useEffect(() => {
    if (updateAlbumLanguage) {
      updateAlbumLanguage(language);
    }
  }, [language, updateAlbumLanguage]);

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
