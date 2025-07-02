import { useLanguage } from '../../contexts/LanguageContext';

export default function Datenschutz() {
  const { t, language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">
        {language === 'de' ? 'Datenschutzerklärung' : 'Privacy Policy'}
      </h1>

      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {language === 'de' ? '1. Datenschutz auf einen Blick' : '1. Data Protection at a Glance'}
          </h2>
          <div className="bg-blue-50 p-6 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">
              {language === 'de' ? 'Allgemeine Hinweise' : 'General Information'}
            </h3>
            <p>
              {language === 'de' 
                ? 'Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Diese Anwendung ist ein Universitätsprojekt und dient ausschließlich Bildungszwecken.'
                : 'The following information provides a simple overview of what happens to your personal data when you visit this website. This application is a university project and serves educational purposes only.'}
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {language === 'de' ? '2. Welche Daten sammeln wir?' : '2. What Data Do We Collect?'}
          </h2>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">
              {language === 'de' ? 'Hochgeladene Bilder' : 'Uploaded Images'}
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li>
                {language === 'de' 
                  ? 'Benutzerfotos für Try-On-Funktionen werden temporär verarbeitet'
                  : 'User photos for try-on functions are processed temporarily'}
              </li>
              <li>
                {language === 'de' 
                  ? 'Kleidungsbilder werden für die Anprobe-Simulation verwendet'
                  : 'Clothing images are used for try-on simulation'}
              </li>
              <li>
                {language === 'de' 
                  ? 'Bilder werden lokal im Browser gespeichert (LocalStorage)'
                  : 'Images are stored locally in the browser (LocalStorage)'}
              </li>
              <li>
                {language === 'de' 
                  ? 'Keine permanente Speicherung auf unseren Servern'
                  : 'No permanent storage on our servers'}
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">
              {language === 'de' ? 'Technische Daten' : 'Technical Data'}
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li>
                {language === 'de' 
                  ? 'IP-Adresse (automatisch beim Webseitenbesuch)'
                  : 'IP address (automatically when visiting the website)'}
              </li>
              <li>
                {language === 'de' 
                  ? 'Browser-Informationen'
                  : 'Browser information'}
              </li>
              <li>
                {language === 'de' 
                  ? 'Betriebssystem-Informationen'
                  : 'Operating system information'}
              </li>
              <li>
                {language === 'de' 
                  ? 'Zugriffszeitpunkt'
                  : 'Access time'}
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {language === 'de' ? '3. Wie verwenden wir Ihre Daten?' : '3. How Do We Use Your Data?'}
          </h2>
          
          <div className="bg-yellow-50 p-6 rounded-lg">
            <ul className="list-disc list-inside space-y-2">
              <li>
                {language === 'de' 
                  ? 'Bereitstellung der Try-On-AI-Funktionalität'
                  : 'Providing Try-On-AI functionality'}
              </li>
              <li>
                {language === 'de' 
                  ? 'Verbesserung der Anwendung (nur zu Bildungszwecken)'
                  : 'Improving the application (educational purposes only)'}
              </li>
              <li>
                {language === 'de' 
                  ? 'Technische Wartung und Fehlerbehebung'
                  : 'Technical maintenance and troubleshooting'}
              </li>
              <li>
                {language === 'de' 
                  ? 'Keine kommerzielle Nutzung der Daten'
                  : 'No commercial use of data'}
              </li>
              <li>
                {language === 'de' 
                  ? 'Keine Weitergabe an Dritte'
                  : 'No sharing with third parties'}
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {language === 'de' ? '4. KI und Bildverarbeitung' : '4. AI and Image Processing'}
          </h2>
          
          <div className="bg-purple-50 p-6 rounded-lg">
            <p className="mb-4">
              {language === 'de' 
                ? 'Unsere Try-On-AI verarbeitet Ihre hochgeladenen Bilder mit folgenden Prinzipien:'
                : 'Our Try-On-AI processes your uploaded images with the following principles:'}
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                {language === 'de' 
                  ? 'Lokale Verarbeitung im Browser, wann immer möglich'
                  : 'Local processing in the browser whenever possible'}
              </li>
              <li>
                {language === 'de' 
                  ? 'Temporäre Server-Verarbeitung für komplexe KI-Operationen'
                  : 'Temporary server processing for complex AI operations'}
              </li>
              <li>
                {language === 'de' 
                  ? 'Automatische Löschung nach Verarbeitung'
                  : 'Automatic deletion after processing'}
              </li>
              <li>
                {language === 'de' 
                  ? 'Keine Speicherung für Training oder andere Zwecke'
                  : 'No storage for training or other purposes'}
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {language === 'de' ? '5. Ihre Rechte' : '5. Your Rights'}
          </h2>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <p className="mb-4">
              {language === 'de' 
                ? 'Sie haben folgende Rechte bezüglich Ihrer Daten:'
                : 'You have the following rights regarding your data:'}
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                {language === 'de' 
                  ? 'Auskunft über gespeicherte Daten'
                  : 'Information about stored data'}
              </li>
              <li>
                {language === 'de' 
                  ? 'Berichtigung falscher Daten'
                  : 'Correction of incorrect data'}
              </li>
              <li>
                {language === 'de' 
                  ? 'Löschung Ihrer Daten'
                  : 'Deletion of your data'}
              </li>
              <li>
                {language === 'de' 
                  ? 'Widerspruch gegen Datenverarbeitung'
                  : 'Objection to data processing'}
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {language === 'de' ? '6. Kontakt' : '6. Contact'}
          </h2>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="mb-2">
              {language === 'de' 
                ? 'Bei Fragen zum Datenschutz kontaktieren Sie uns:'
                : 'For questions about data protection, contact us:'}
            </p>
            <p><strong>E-Mail:</strong> datenschutz@tryonai.de</p>
            <p><strong>Post:</strong> TryOnAI Datenschutz, Musterstraße 123, 12345 Musterstadt</p>
          </div>
        </section>

        <div className="text-sm text-gray-500 mt-8 p-4 bg-gray-100 rounded-lg">
          <p>
            {language === 'de' 
              ? 'Letzte Aktualisierung: Juli 2025 | Diese Datenschutzerklärung gilt für das Universitätsprojekt TryOnAI.'
              : 'Last updated: July 2025 | This privacy policy applies to the university project TryOnAI.'}
          </p>
        </div>
      </div>
    </div>
  );
}
