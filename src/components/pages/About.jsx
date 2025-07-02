import { useLanguage } from '../../contexts/LanguageContext';
import Card from '../ui/Card';

export default function About() {
  const { t, language } = useLanguage();
  
  return (

    <div className="relative min-h-screen overflow-hidden">
      {/* Decorative curved elements - consistent with other pages */}
      
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
            {t('about.title')}
          </h1>
          <p className="text-xl text-purple-600 max-w-3xl mx-auto">
            {t('about.subtitle') || 'Erfahre mehr über unsere Vision und Technologie'}
          </p>
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Mission Card */}
          <Card className="p-8 col-span-1 lg:col-span-2">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">
              {t('about.mission')}
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg text-center max-w-4xl mx-auto">
              {t('about.missionText')}
            </p>
          </Card>

          {/* How It Works Card */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              {t('about.howItWorks')}
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-lg text-gray-800">{t('about.step1Title')}</h3>
                  <p className="text-gray-600">{t('about.step1Text')}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-lg text-gray-800">{t('about.step2Title')}</h3>
                  <p className="text-gray-600">{t('about.step2Text')}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-lg text-gray-800">{t('about.step3Title')}</h3>
                  <p className="text-gray-600">{t('about.step3Text')}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Technology Card */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              {t('about.technology')}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {t('about.technologyText')}
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                <span className="text-gray-600">{t('about.tech1')}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                <span className="text-gray-600">{t('about.tech2')}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                <span className="text-gray-600">{t('about.tech3')}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                <span className="text-gray-600">{t('about.tech4')}</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Privacy Card - Full Width */}
        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
            {t('about.privacy')}
          </h2>
          <p className="text-gray-600 leading-relaxed text-center max-w-4xl mx-auto">

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
