import { useLanguage } from '../../contexts/LanguageContext';

export default function AGB() {
  const { t, language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">
        {language === 'de' ? 'Allgemeine Geschäftsbedingungen (AGB)' : 'Terms and Conditions'}
      </h1>

      <div className="prose max-w-none">
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <p className="text-sm">
            <strong>
              {language === 'de' 
                ? 'Wichtiger Hinweis: Dies ist ein Universitätsprojekt zu Bildungszwecken. Die Nutzung erfolgt auf eigene Verantwortung.'
                : 'Important note: This is a university project for educational purposes. Use at your own risk.'}
            </strong>
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {language === 'de' ? '1. Geltungsbereich' : '1. Scope of Application'}
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="mb-4">
              {language === 'de' 
                ? 'Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der TryOnAI-Anwendung, einem Universitätsprojekt im Bereich Digitale Produktentwicklung & Innovation.'
                : 'These Terms and Conditions apply to the use of the TryOnAI application, a university project in the field of Digital Product Development & Innovation.'}
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                {language === 'de' 
                  ? 'Anbieter: Studierende der [Ihre Universität]'
                  : 'Provider: Students of [Your University]'}
              </li>
              <li>
                {language === 'de' 
                  ? 'Zweck: Bildung und Demonstration von KI-Technologie'
                  : 'Purpose: Education and demonstration of AI technology'}
              </li>
              <li>
                {language === 'de' 
                  ? 'Status: Nicht-kommerzielles Projekt'
                  : 'Status: Non-commercial project'}
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {language === 'de' ? '2. Nutzungsbedingungen' : '2. Terms of Use'}
          </h2>
          
          <div className="bg-yellow-50 p-6 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">
              {language === 'de' ? 'Erlaubte Nutzung' : 'Permitted Use'}
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li>
                {language === 'de' 
                  ? 'Kostenlose Nutzung zu Testzwecken'
                  : 'Free use for testing purposes'}
              </li>
              <li>
                {language === 'de' 
                  ? 'Upload eigener Fotos für Try-On-Simulation'
                  : 'Upload of own photos for try-on simulation'}
              </li>
              <li>
                {language === 'de' 
                  ? 'Nutzung der generierten Bilder für private Zwecke'
                  : 'Use of generated images for private purposes'}
              </li>
              <li>
                {language === 'de' 
                  ? 'Feedback und Verbesserungsvorschläge'
                  : 'Feedback and improvement suggestions'}
              </li>
            </ul>
          </div>

          <div className="bg-red-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-2">
              {language === 'de' ? 'Verbotene Nutzung' : 'Prohibited Use'}
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li>
                {language === 'de' 
                  ? 'Upload fremder Fotos ohne Einverständnis'
                  : 'Upload of third-party photos without consent'}
              </li>
              <li>
                {language === 'de' 
                  ? 'Kommerzielle Nutzung der generierten Inhalte'
                  : 'Commercial use of generated content'}
              </li>
              <li>
                {language === 'de' 
                  ? 'Missbrauch für unangemessene oder illegale Zwecke'
                  : 'Misuse for inappropriate or illegal purposes'}
              </li>
              <li>
                {language === 'de' 
                  ? 'Reverse Engineering oder Kopieren der Anwendung'
                  : 'Reverse engineering or copying the application'}
              </li>
              <li>
                {language === 'de' 
                  ? 'Überlastung der Server durch automatisierte Anfragen'
                  : 'Server overload through automated requests'}
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {language === 'de' ? '3. Bildrechte und KI-Generierung' : '3. Image Rights and AI Generation'}
          </h2>
          
          <div className="bg-purple-50 p-6 rounded-lg">
            <p className="mb-4">
              {language === 'de' 
                ? 'Durch die Nutzung unserer Try-On-AI erklären Sie sich mit folgenden Bedingungen einverstanden:'
                : 'By using our Try-On-AI, you agree to the following terms:'}
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                {language === 'de' 
                  ? 'Sie besitzen die Rechte an allen hochgeladenen Bildern'
                  : 'You own the rights to all uploaded images'}
              </li>
              <li>
                {language === 'de' 
                  ? 'Generierte Bilder sind ausschließlich für private Nutzung bestimmt'
                  : 'Generated images are for private use only'}
              </li>
              <li>
                {language === 'de' 
                  ? 'Die KI-Verarbeitung erfolgt automatisiert und kann Fehler enthalten'
                  : 'AI processing is automated and may contain errors'}
              </li>
              <li>
                {language === 'de' 
                  ? 'Keine Garantie für Realitätstreue der generierten Bilder'
                  : 'No guarantee for realism of generated images'}
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {language === 'de' ? '4. Haftungsausschluss' : '4. Liability Disclaimer'}
          </h2>
          
          <div className="bg-orange-50 p-6 rounded-lg">
            <p className="mb-4">
              {language === 'de' 
                ? 'Da es sich um ein Universitätsprojekt handelt, gelten folgende Haftungsausschlüsse:'
                : 'As this is a university project, the following disclaimers apply:'}
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                {language === 'de' 
                  ? 'Keine Gewährleistung für Verfügbarkeit oder Funktionalität'
                  : 'No warranty for availability or functionality'}
              </li>
              <li>
                {language === 'de' 
                  ? 'Keine Haftung für Datenverlust oder technische Probleme'
                  : 'No liability for data loss or technical problems'}
              </li>
              <li>
                {language === 'de' 
                  ? 'Bildungszweck steht im Vordergrund'
                  : 'Educational purpose is paramount'}
              </li>
              <li>
                {language === 'de' 
                  ? 'Nutzung erfolgt auf eigenes Risiko'
                  : 'Use at your own risk'}
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {language === 'de' ? '5. Datenschutz' : '5. Data Protection'}
          </h2>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <p className="mb-4">
              {language === 'de' 
                ? 'Ihre Privatsphäre ist uns wichtig:'
                : 'Your privacy is important to us:'}
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                {language === 'de' 
                  ? 'Bilder werden nur temporär für die Verarbeitung gespeichert'
                  : 'Images are only temporarily stored for processing'}
              </li>
              <li>
                {language === 'de' 
                  ? 'Keine permanente Speicherung auf unseren Servern'
                  : 'No permanent storage on our servers'}
              </li>
              <li>
                {language === 'de' 
                  ? 'Lokale Speicherung in Ihrem Browser möglich'
                  : 'Local storage in your browser possible'}
              </li>
              <li>
                {language === 'de' 
                  ? 'Detaillierte Informationen in unserer Datenschutzerklärung'
                  : 'Detailed information in our privacy policy'}
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {language === 'de' ? '6. Änderungen und Kontakt' : '6. Changes and Contact'}
          </h2>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="mb-4">
              {language === 'de' 
                ? 'Wir behalten uns vor, diese AGB jederzeit zu ändern. Bei Fragen kontaktieren Sie uns:'
                : 'We reserve the right to change these terms at any time. For questions, contact us:'}
            </p>
            <p><strong>E-Mail:</strong> info@tryonai.de</p>
            <p><strong>Projekt-Repository:</strong> [GitHub Link falls verfügbar]</p>
          </div>
        </section>

        <div className="text-sm text-gray-500 mt-8 p-4 bg-gray-100 rounded-lg">
          <p>
            {language === 'de' 
              ? 'Stand: Januar 2025 | Diese AGB gelten für das Universitätsprojekt TryOnAI im Rahmen des Studiengangs Digitale Produktentwicklung & Innovation.'
              : 'Status: January 2025 | These terms apply to the university project TryOnAI as part of the Digital Product Development & Innovation program.'}
          </p>
        </div>
      </div>
    </div>
  );
}
