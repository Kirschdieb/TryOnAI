import { useLanguage } from '../../contexts/LanguageContext';
import Card from '../ui/Card';

export default function About() {
  const { t, language } = useLanguage();
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">
        {language === 'de' ? 'Über TryOnAI' : 'About TryOnAI'}
      </h1>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-8 mb-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          {language === 'de' 
            ? 'Künstliche Intelligenz trifft auf Mode' 
            : 'Artificial Intelligence meets Fashion'}
        </h2>
        <p className="text-lg text-gray-700">
          {language === 'de' 
            ? 'Ein innovatives Universitätsprojekt, das die Zukunft des Online-Shoppings erforscht'
            : 'An innovative university project exploring the future of online shopping'}
        </p>
      </div>

      {/* Projekt Info */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-8">
          {language === 'de' ? 'Das Projekt' : 'The Project'}
        </h2>
        <div className="grid md:grid-cols-2 gap-10">
          <Card>
            <h3 className="text-xl font-semibold mb-4 text-purple-600">
              {language === 'de' ? 'Was ist TryOnAI?' : 'What is TryOnAI?'}
            </h3>
            <p className="text-gray-700 mb-4">
              {language === 'de' 
                ? 'TryOnAI ist eine innovative Web-Anwendung, die Künstliche Intelligenz nutzt, um virtuelle Anproben von Kleidungsstücken zu ermöglichen. Nutzer können Fotos von sich hochladen und verschiedene Kleidungsstücke digital "anprobieren".'
                : 'TryOnAI is an innovative web application that uses artificial intelligence to enable virtual try-ons of clothing items. Users can upload photos of themselves and digitally "try on" various clothing pieces.'}
            </p>
            <ul className="text-gray-600 space-y-2">
              <li>✨ {language === 'de' ? 'KI-gestützte Bildverarbeitung' : 'AI-powered image processing'}</li>
              <li>👕 {language === 'de' ? 'Virtuelle Anprobe-Technologie' : 'Virtual try-on technology'}</li>
              <li>🖼️ {language === 'de' ? 'Persönlicher Kleiderschrank' : 'Personal wardrobe'}</li>
              <li>🛍️ {language === 'de' ? 'Integration mit Online-Shopping' : 'Integration with online shopping'}</li>
            </ul>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold mb-4 text-blue-600">
              {language === 'de' ? 'Universitätskontext' : 'University Context'}
            </h3>
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">
                  {language === 'de' ? 'Studiengang:' : 'Program:'}
                </span>
                <span>Digital Product Innovation</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">
                  {language === 'de' ? 'Semester:' : 'Semester:'}
                </span>
                <span>Wintersemester 2024/25</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">
                  {language === 'de' ? 'Hochschule:' : 'University:'}
                </span>
                <span>Friedrich Schiller Universität Jena</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">
                  {language === 'de' ? 'Betreuung:' : 'Supervision:'}
                </span>
                <span>Prof. Dr. Wessel</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Wie es funktioniert */}
      <Card className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">{t('about.howItWorks')}</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-lavender rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold">1</span>
            </div>
            <div>
              <h3 className="font-semibold mb-1">{t('about.step1Title')}</h3>
              <p className="text-gray-600">{t('about.step1Text')}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-lavender rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold">2</span>
            </div>
            <div>
              <h3 className="font-semibold mb-1">{t('about.step2Title')}</h3>
              <p className="text-gray-600">{t('about.step2Text')}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-lavender rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold">3</span>
            </div>
            <div>
              <h3 className="font-semibold mb-1">{t('about.step3Title')}</h3>
              <p className="text-gray-600">{t('about.step3Text')}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Team Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-8 text-center">
          {language === 'de' ? 'Unser Team' : 'Our Team'}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-purple-200 rounded-full flex items-center justify-center">
              <span className="text-2xl">👨‍💻</span>
            </div>
            <h3 className="font-semibold text-lg mb-3">Max Franke</h3>
            <p className="text-gray-600 mb-3">
              {language === 'de' ? 'Platzhalter' : 'Placeholder'}
            </p>
            <p className="text-sm text-gray-500">
              {language === 'de' 
                ? 'Platzhalter' : 'Placeholder'}
            </p>
          </Card>

          <Card className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-blue-200 rounded-full flex items-center justify-center">
              <span className="text-2xl">�‍💻</span>
            </div>
            <h3 className="font-semibold text-lg mb-3">Felix Heuchert</h3>
            <p className="text-gray-600 mb-3">
              {language === 'de' ? 'Platzhalter' : 'Placeholder'}
            </p>
            <p className="text-sm text-gray-500">
              {language === 'de' 
                ? 'Platzhalter' : 'Placeholder'}
            </p>
          </Card>

          <Card className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-green-200 rounded-full flex items-center justify-center">
              <span className="text-2xl">👨‍💻</span>
            </div>
            <h3 className="font-semibold text-lg mb-3">Jonas Oppermann</h3>
            <p className="text-gray-600 mb-3">
              {language === 'de' ? 'Platzhalter' : 'Placeholder'}
            </p>
            <p className="text-sm text-gray-500">
              {language === 'de' 
                ? 'Platzhalter' : 'Placeholder'}
            </p>
          </Card>

          <Card className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-orange-200 rounded-full flex items-center justify-center">
              <span className="text-2xl">👨‍💻</span>
            </div>
            <h3 className="font-semibold text-lg mb-3">Nils Kriz</h3>
            <p className="text-gray-600 mb-3">
              {language === 'de' ? 'Platzhalter' : 'Placeholder'}
            </p>
            <p className="text-sm text-gray-500">
              {language === 'de' 
                ? 'Platzhalter' : 'Placeholder'}
            </p>
          </Card>
        </div>
      </section>

        {/* Technologie */}
        <Card className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">{t('about.technology')}</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            {t('about.technologyText')}
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>{t('about.tech1')}</li>
            <li>{t('about.tech2')}</li>
            <li>{t('about.tech3')}</li>
            <li>{t('about.tech4')}</li>
          </ul>
        </Card>

        {/* Datenschutz & Sicherheit */}
        <Card className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">{t('about.privacy')}</h2>
          <p className="text-gray-600 leading-relaxed">
            {t('about.privacyText')}
          </p>
        </Card>

      {/* Technologie Stack */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-6">
          {language === 'de' ? 'Technologie Stack' : 'Technology Stack'}
        </h2>
        <div className="grid md:grid-cols-2 gap-10">
          <Card>
            <h3 className="text-xl font-semibold mb-4 text-purple-600">
              {language === 'de' ? 'Frontend' : 'Frontend'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <span className="bg-gray-100 px-3 py-2 rounded text-sm">React.js</span>
              <span className="bg-gray-100 px-3 py-2 rounded text-sm">Tailwind CSS</span>
              <span className="bg-gray-100 px-3 py-2 rounded text-sm">Vite</span>
              <span className="bg-gray-100 px-3 py-2 rounded text-sm">React Router</span>
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold mb-4 text-blue-600">
              {language === 'de' ? 'Backend & KI' : 'Backend & AI'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <span className="bg-gray-100 px-3 py-2 rounded text-sm">Node.js</span>
              <span className="bg-gray-100 px-3 py-2 rounded text-sm">Express.js</span>
              <span className="bg-gray-100 px-3 py-2 rounded text-sm">Python</span>
              <span className="bg-gray-100 px-3 py-2 rounded text-sm">Machine Learning</span>
            </div>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <Card className="text-center">
        <h2 className="text-2xl font-semibold mb-4">
          {language === 'de' ? 'Möchten Sie TryOnAI ausprobieren?' : 'Want to try TryOnAI?'}
        </h2>
        <p className="text-gray-600 mb-6">
          {language === 'de' 
            ? 'Entdecken Sie die Zukunft der virtuellen Anprobe und geben Sie uns Ihr Feedback!'
            : 'Discover the future of virtual try-on and give us your feedback!'}
        </p>
        <div className="flex justify-center gap-4">
          <a 
            href="/try-on" 
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            {language === 'de' ? 'Jetzt ausprobieren' : 'Try it now'}
          </a>
          <a 
            href="/contact" 
            className="border border-purple-600 text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors"
          >
            {language === 'de' ? 'Kontakt aufnehmen' : 'Get in touch'}
          </a>
        </div>
      </Card>
    </div>
  );
}
