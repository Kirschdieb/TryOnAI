import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import Button from '../ui/Button';
import { useEffect, useRef, useState } from 'react';


export default function Landing() {
  const { t } = useLanguage();
  const heroRef = useRef(null);
  const [isHeroOnPurple, setIsHeroOnPurple] = useState(true);
  const featuresRef = useRef(null);
  const [isFeaturesOnPurple, setIsFeaturesOnPurple] = useState(false);
  const [openFaq, setOpenFaq] = useState(null); // State to manage open FAQ item
  const faqRef = useRef(null);
  const [isFaqOnPurple, setIsFaqOnPurple] = useState(false);
  const testimonialsRef = useRef(null);
  const [isTestimonialsOnPurple, setIsTestimonialsOnPurple] = useState(false);
  const ctaRef = useRef(null);
  const [isCtaOnPurple, setIsCtaOnPurple] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setIsHeroOnPurple(rect.bottom > 120);
      }
      if (featuresRef.current) {
        const rect = featuresRef.current.getBoundingClientRect();
        setIsFeaturesOnPurple(rect.top < 400);
      }
      if (faqRef.current) {
        const rect = faqRef.current.getBoundingClientRect();
        // Wenn Section-Überschrift über die Mitte des Bildschirms scrollt
        setIsFaqOnPurple(rect.top < window.innerHeight / 2);
      }
      if (testimonialsRef.current) {
        const rect = testimonialsRef.current.getBoundingClientRect();
        setIsTestimonialsOnPurple(rect.top < window.innerHeight / 2);
      }
      if (ctaRef.current) {
        const rect = ctaRef.current.getBoundingClientRect();
        setIsCtaOnPurple(rect.top < window.innerHeight / 2);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Custom Purple Gradient Background - now full width */}
      <div
        className="fixed -top-24 left-1/2 -translate-x-1/2 w-screen h-[70vh] -z-20 rotate-[-6deg] rounded-bl-[120px]"
        style={{
          background: 'linear-gradient(100deg, #7f3ffb 0%, #e14eca 100%)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          minWidth: '100vw',
        }}
        aria-hidden="true"
      />
      {/* Optional: Soft shadow for depth */}
      <div className="fixed -top-24 left-1/2 -translate-x-1/2 w-screen h-[80vh] -z-30 rotate-[-6deg] rounded-bl-[120px] opacity-30 blur-2xl" style={{background: 'linear-gradient(100deg, #7f3ffb 0%, #e14eca 100%)', minWidth: '100vw'}} />

      {/* Hero Section - dynamic text color */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8" ref={heroRef}>
        <div className="pb-12 pt-32 md:pb-20 md:pt-40">
          <div className="text-center">
            <div className={`mb-6 inline-flex rounded-full px-3 py-1 text-sm font-semibold shadow transition-colors duration-300 ${isHeroOnPurple ? 'bg-white/80 text-purple-700' : 'bg-purple-100 text-purple-700'}`}>
              {t('landing.experience')}
            </div>
            <h1 className={`mb-8 text-5xl md:text-6xl font-bold drop-shadow-lg transition-colors duration-300 ${isHeroOnPurple ? 'text-white' : 'text-purple-700'}`}>
              {t('landing.title')}
            </h1>
            <p className={`text-xl mb-8 mx-auto max-w-4xl drop-shadow transition-colors duration-300 ${isHeroOnPurple ? 'text-purple-100' : 'text-gray-700'}`}>
              {t('landing.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/try-on">
                <Button 
                  variant="primary"
                  className={`w-full sm:w-auto text-lg px-8 py-3 h-[52px] group border-2 border-white bg-white !text-purple-700 hover:bg-purple-100`}
                >
                  {t('landing.tryNow')}
                  <span className="tracking-normal ml-2 transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </Button>
              </Link>
              <Link to="/closet">
                <Button variant="outline" className={`w-full sm:w-auto text-lg px-8 py-3 h-[52px] border-white transition-colors duration-300 ${isHeroOnPurple ? 'text-white hover:bg-white/10' : 'text-purple-700 border-purple-700 hover:bg-purple-100'}`}>
                  {t('landing.viewCloset')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 py-16 sm:px-6 lg:px-8" ref={featuresRef}>
        <div className="relative py-12">
          <div className="relative px-4 sm:px-6 lg:px-8">
            <div className="py-12 md:py-20">
              <h2 className={`text-3xl font-bold text-center mb-12 transition-colors duration-300 ${isFeaturesOnPurple ? 'text-white' : 'text-purple-700'}`}>{t('landing.howItWorks')}</h2>
              <div className="mx-auto grid max-w-7xl items-start gap-8 md:grid-cols-3 lg:gap-16">{/* Vergrößert von max-w-sm zu max-w-7xl */}
                {/* 1. Upload Photo - Interactive Flip Card */}
                <div className="relative h-64 w-full [perspective:1000px] group">
                  <div className="relative h-full w-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                    {/* Front Side */}
                    <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center p-6 border-2 ${!isFeaturesOnPurple ? 'bg-gradient-to-r from-purple-500 to-purple-600 border-purple-600' : 'bg-white border-purple-500'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors duration-300 ${!isFeaturesOnPurple ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-600'}`}>
                        <span className="text-lg font-bold">1</span>
                      </div>
                      <h3 className={`text-xl font-semibold transition-colors duration-300 ${!isFeaturesOnPurple ? 'text-white' : 'text-purple-700'}`}>{t('landing.uploadPhoto')}</h3>
                    </div>
                    {/* Back Side */}
                    <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl shadow-md flex flex-col items-center justify-center p-6 transition-all duration-300 border-2 ${!isFeaturesOnPurple ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-600' : 'bg-white text-purple-700 border-purple-500'}`}>
                      <div className="mb-4">
                        <svg className={`w-12 h-12 transition-colors duration-300 ${!isFeaturesOnPurple ? 'text-white opacity-80' : 'text-purple-500 opacity-70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold mb-2">{t('landing.uploadPhoto')}</h4>
                      <p className={`text-sm text-center mb-4 transition-colors duration-300 ${!isFeaturesOnPurple ? 'text-white/90 opacity-90' : 'text-purple-600 opacity-70'}`}>{t('landing.uploadPhotoDesc')}</p>
                      <Link to="/profile" className={`px-4 py-2 rounded-lg transition-colors duration-300 ${!isFeaturesOnPurple ? 'bg-white text-purple-600 hover:bg-gray-100' : 'bg-purple-600 text-white hover:bg-purple-700'}`}>
                        {t('landing.getStarted')} →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* 2. Choose Clothing - Interactive Flip Card */}
                <div className="relative h-64 w-full [perspective:1000px] group">
                  <div className="relative h-full w-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                    {/* Front Side */}
                    <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center p-6 border-2 ${!isFeaturesOnPurple ? 'bg-gradient-to-r from-purple-500 to-purple-600 border-purple-600' : 'bg-white border-purple-500'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors duration-300 ${!isFeaturesOnPurple ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-600'}`}>
                        <span className="text-lg font-bold">2</span>
                      </div>
                      <h3 className={`text-xl font-semibold transition-colors duration-300 ${!isFeaturesOnPurple ? 'text-white' : 'text-purple-700'}`}>{t('landing.chooseClothing')}</h3>
                    </div>
                    {/* Back Side */}
                    <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl shadow-md flex flex-col items-center justify-center p-6 transition-all duration-300 border-2 ${!isFeaturesOnPurple ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-600' : 'bg-white text-purple-700 border-purple-500'}`}>
                      <div className="mb-4">
                        <svg className={`w-12 h-12 transition-colors duration-300 ${!isFeaturesOnPurple ? 'text-white opacity-80' : 'text-purple-500 opacity-70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold mb-2">{t('landing.chooseClothing')}</h4>
                      <p className={`text-sm text-center mb-4 transition-colors duration-300 ${!isFeaturesOnPurple ? 'text-white/90 opacity-90' : 'text-purple-600 opacity-70'}`}>{t('landing.chooseClothingDesc')}</p>
                      <Link to="/browse" className={`px-4 py-2 rounded-lg transition-colors duration-300 ${!isFeaturesOnPurple ? 'bg-white text-purple-600 hover:bg-gray-100' : 'bg-purple-600 text-white hover:bg-purple-700'}`}>
                        {t('browse.tryNow')} →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* 3. AI Magic - Interactive Flip Card */}
                <div className="relative h-64 w-full [perspective:1000px] group">
                  <div className="relative h-full w-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                    {/* Front Side */}
                    <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center p-6 border-2 ${!isFeaturesOnPurple ? 'bg-gradient-to-r from-purple-500 to-purple-600 border-purple-600' : 'bg-white border-purple-500'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors duration-300 ${!isFeaturesOnPurple ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-600'}`}>
                        <span className="text-lg font-bold">3</span>
                      </div>
                      <h3 className={`text-xl font-semibold transition-colors duration-300 ${!isFeaturesOnPurple ? 'text-white' : 'text-purple-700'}`}>{t('landing.aiMagic')}</h3>
                    </div>
                    {/* Back Side */}
                    <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl shadow-md flex flex-col items-center justify-center p-6 transition-all duration-300 border-2 ${!isFeaturesOnPurple ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-600' : 'bg-white text-purple-700 border-purple-500'}`}>
                      <div className="mb-4">
                        <svg className={`w-12 h-12 transition-colors duration-300 ${!isFeaturesOnPurple ? 'text-white opacity-80' : 'text-purple-500 opacity-70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold mb-2">{t('landing.aiMagic')}</h4>
                      <p className={`text-sm text-center mb-4 transition-colors duration-300 ${!isFeaturesOnPurple ? 'text-white/90 opacity-90' : 'text-purple-600 opacity-70'}`}>{t('landing.aiMagicDesc')}</p>
                      <Link to="/try-on" className={`px-4 py-2 rounded-lg transition-colors duration-300 ${!isFeaturesOnPurple ? 'bg-white text-purple-600 hover:bg-gray-100' : 'bg-purple-600 text-white hover:bg-purple-700'}`}>
                        {t('landing.tryNow')} →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Animation Section */}
      <div className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="relative aspect-video rounded-2xl bg-gray-900 px-5 py-3 shadow-xl max-w-7xl mx-auto">
          <div className="flex h-full items-center justify-center rounded-xl overflow-hidden">
            <img 
              src="/src/assets/Präsentation1.gif" 
              alt="TryOnAI Demo - Experience our AI technology in action" 
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          {/* Border animation effect */}
          <div className="pointer-events-none absolute -inset-px">
            <div className="absolute inset-0 border-y border-transparent [background:linear-gradient(to_right,transparent,theme(colors.purple.300/.8),transparent)_1] animate-pulse"></div>
            <div className="absolute inset-0 border-x border-transparent [background:linear-gradient(to_bottom,transparent,theme(colors.purple.300/.8),transparent)_1] animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="px-4 pb-16 sm:px-6 lg:px-8" ref={ctaRef}>
        <div className={`relative rounded-2xl px-8 py-10 md:py-16 md:px-12 transition-all duration-300 max-w-7xl mx-auto ${!isCtaOnPurple ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 'bg-white border-2 border-purple-500'}`}>
          <div className="relative flex flex-col items-center">
            <h2 className={`h2 mb-4 text-center text-3xl font-bold transition-colors duration-300 ${!isCtaOnPurple ? 'text-white' : 'text-purple-700'}`}>{t('landing.readyTransform')}</h2>
            <p className={`mb-6 text-center text-lg transition-colors duration-300 ${!isCtaOnPurple ? 'text-purple-200' : 'text-purple-600'}`}>
              {t('landing.joinThousands')}
            </p>
            <Link to="/try-on">
              <Button variant="secondary" className={`w-full sm:w-auto text-lg px-8 py-3 transition-colors duration-300 ${!isCtaOnPurple ? 'bg-white text-purple-600 hover:bg-gray-100' : 'bg-purple-600 text-white hover:bg-purple-700'}`}>
                {t('landing.getStarted')}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div ref={faqRef} className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-3xl font-bold text-center mb-8 transition-colors duration-300 ${isFaqOnPurple ? 'text-white' : 'text-purple-700'}`}>{t('landing.faq.title')}</h2>
          <div className="space-y-4">
            {[
              { qKey: 'landing.faq.q1', aKey: 'landing.faq.a1' },
              { qKey: 'landing.faq.q2', aKey: 'landing.faq.a2' },
              { qKey: 'landing.faq.q3', aKey: 'landing.faq.a3' },
            ].map((item, index) => (
              <div key={index} className="bg-white shadow rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex justify-between items-center py-4 px-6 text-left hover:bg-gray-100 focus:outline-none focus:ring transition-colors duration-200"
                >
                  <span className="text-lg font-semibold">{t(item.qKey)}</span>
                  <span className="text-2xl">{openFaq === index ? '−' : '+'}</span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-40' : 'max-h-0'}`}> 
                  <div className="px-6 pb-4 text-gray-700">
                    {t(item.aKey)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div ref={testimonialsRef} className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-3xl font-bold text-center mb-8 transition-colors duration-300 ${isTestimonialsOnPurple ? 'text-white' : 'text-purple-700'}`}>{t('landing.testimonials.title')}</h2>
          <div className="grid gap-8 md:grid-cols-3">
          {[ 
            { img: 'https://randomuser.me/api/portraits/men/5.jpg', nameKey: 'landing.testimonials.u1.name', quoteKey: 'landing.testimonials.u1.quote' },
            { img: 'https://i.pravatar.cc/150?img=10', nameKey: 'landing.testimonials.u2.name', quoteKey: 'landing.testimonials.u2.quote' },
            { img: 'https://i.pravatar.cc/150?img=15', nameKey: 'landing.testimonials.u3.name', quoteKey: 'landing.testimonials.u3.quote' },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center bg-white p-6 rounded-lg shadow">
              <img src={item.img} alt={t(item.nameKey)} className="w-16 h-16 rounded-full mb-4 object-cover" />
              <h3 className="font-semibold mb-2">{t(item.nameKey)}</h3>
              <p className="text-gray-600 text-center">“{t(item.quoteKey)}”</p>
            </div>            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
