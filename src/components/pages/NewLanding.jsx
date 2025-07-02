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
  const demoRef = useRef(null);
  const [isDemoOnPurple, setIsDemoOnPurple] = useState(false);
  const ctaRef = useRef(null);
  const [isCtaOnPurple, setIsCtaOnPurple] = useState(false);

  // Scroll animation states
  const [visibleElements, setVisibleElements] = useState(new Set());

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
      if (demoRef.current) {
        const rect = demoRef.current.getBoundingClientRect();
        setIsDemoOnPurple(rect.top < window.innerHeight / 2);
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

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '-50px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleElements(prev => new Set(prev).add(entry.target.dataset.animateId));
        } else {
          // Remove from visible elements when out of view (for re-triggering animations)
          setVisibleElements(prev => {
            const newSet = new Set(prev);
            newSet.delete(entry.target.dataset.animateId);
            return newSet;
          });
        }
      });
    }, observerOptions);

    // Observe all elements with data-animate-id
    const animatedElements = document.querySelectorAll('[data-animate-id]');
    animatedElements.forEach(el => observer.observe(el));

    // Initial trigger for elements already in view
    setTimeout(() => {
      animatedElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setVisibleElements(prev => new Set(prev).add(el.dataset.animateId));
        }
      });
    }, 100);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Scroll Animation CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .animate-fade-up {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          
          .animate-fade-up.visible {
            opacity: 1;
            transform: translateY(0);
          }
          
          .animate-fade-left {
            opacity: 0;
            transform: translateX(-30px);
            transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          
          .animate-fade-left.visible {
            opacity: 1;
            transform: translateX(0);
          }
          
          .animate-fade-right {
            opacity: 0;
            transform: translateX(30px);
            transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          
          .animate-fade-right.visible {
            opacity: 1;
            transform: translateX(0);
          }
          
          .animate-scale-up {
            opacity: 0;
            transform: scale(0.9);
            transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          
          .animate-scale-up.visible {
            opacity: 1;
            transform: scale(1);
          }
          
          .animate-stagger-1 {
            transition-delay: 0.1s;
          }
          
          .animate-stagger-2 {
            transition-delay: 0.2s;
          }
          
          .animate-stagger-3 {
            transition-delay: 0.3s;
          }
          
          .animate-stagger-4 {
            transition-delay: 0.4s;
          }
          
          .animate-stagger-5 {
            transition-delay: 0.5s;
          }
        `
      }} />

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
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl" ref={heroRef}>
        <div className="pb-8 sm:pb-12 pt-24 sm:pt-32 md:pb-20 md:pt-40">
          <div className="text-center">
            <div 
              className={`mb-6 inline-flex rounded-full px-3 py-1 text-sm font-semibold shadow transition-colors duration-300 animate-fade-up ${visibleElements.has('hero-badge') ? 'visible' : ''} ${isHeroOnPurple ? 'bg-white/80 text-purple-700' : 'bg-purple-100 text-purple-700'}`}
              data-animate-id="hero-badge"
            >
              {t('landing.experience')}
            </div>
            <h1 
              className={`mb-6 sm:mb-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold drop-shadow-lg transition-colors duration-300 animate-fade-up animate-stagger-1 ${visibleElements.has('hero-title') ? 'visible' : ''} ${isHeroOnPurple ? 'text-white' : 'text-purple-700'}`}
              data-animate-id="hero-title"
            >
              {t('landing.title')}
            </h1>
            <p 
              className={`text-lg sm:text-xl mb-6 sm:mb-8 mx-auto max-w-4xl px-4 drop-shadow transition-colors duration-300 animate-fade-up animate-stagger-2 ${visibleElements.has('hero-subtitle') ? 'visible' : ''} ${isHeroOnPurple ? 'text-purple-100' : 'text-gray-700'}`}
              data-animate-id="hero-subtitle"
            >
              {t('landing.subtitle')}
            </p>
            <div 
              className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4 animate-fade-up animate-stagger-3 ${visibleElements.has('hero-buttons') ? 'visible' : ''}`}
              data-animate-id="hero-buttons"
            >
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
      </div>      {/* Animated chevron arrow pointing down */}
      <div className="flex justify-center py-1 -mt-12 -mb-9">
        <div className="relative">
          <div className="arrow-container">
            <span className="chevron chevron-1"></span>
            <span className="chevron chevron-2"></span>
            <span className="chevron chevron-3"></span>
          </div>
        </div>
        
        {/* CSS for animated chevron arrow */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .arrow-container {
              position: relative;
              cursor: pointer;
            }
            
            .chevron {
              display: block;
              width: 2rem;
              height: 2rem;
              border-bottom: 4px solid white;
              border-right: 4px solid white;
              transform: rotate(45deg);
              margin: -8px auto;
              animation: chevronAnimate 2s infinite;
            }
            
            .chevron-2 {
              animation-delay: -0.2s;
            }
            
            .chevron-3 {
              animation-delay: -0.4s;
            }
            
            @keyframes chevronAnimate {
              0% {
                opacity: 0;
                transform: rotate(45deg) translate(-20px, -20px);
              }
              50% {
                opacity: 1;
              }
              100% {
                opacity: 0;
                transform: rotate(45deg) translate(20px, 20px);
              }
            }
          `
        }} />
      </div>

      {/* Features Section */}
      <div className="px-4 py-16 sm:px-6 lg:px-8" ref={featuresRef}>
        <div className="relative py-12">
          <div className="relative px-4 sm:px-6 lg:px-8">
            <div className="py-12 md:py-20">
              <h2 
                className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 transition-colors duration-300 animate-fade-up ${visibleElements.has('features-title') ? 'visible' : ''} ${isFeaturesOnPurple ? 'text-white' : 'text-purple-700'}`}
                data-animate-id="features-title"
              >
                {t('landing.howItWorks')}
              </h2>
              <div 
                className={`mx-auto grid max-w-7xl items-start gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-16 animate-fade-up animate-stagger-1 ${visibleElements.has('features-grid') ? 'visible' : ''}`}
                data-animate-id="features-grid"
              >{/* Responsive Grid: 1 Spalte auf Mobile, 2 auf Tablet, 3 auf Desktop */}
                {/* 1. Upload Photo - Interactive Flip Card */}
                <div 
                  className={`relative h-56 sm:h-64 w-full [perspective:1000px] group animate-fade-left animate-stagger-1 ${visibleElements.has('feature-1') ? 'visible' : ''}`}
                  data-animate-id="feature-1"
                >
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
                <div 
                  className={`relative h-56 sm:h-64 w-full [perspective:1000px] group animate-fade-up animate-stagger-2 ${visibleElements.has('feature-2') ? 'visible' : ''}`}
                  data-animate-id="feature-2"
                >
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
                <div 
                  className={`relative h-56 sm:h-64 w-full [perspective:1000px] group animate-fade-right animate-stagger-3 ${visibleElements.has('feature-3') ? 'visible' : ''}`}
                  data-animate-id="feature-3"
                >
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
      <div className="px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16" ref={demoRef}>
        <div className="max-w-7xl mx-auto">
          {/* Überschrift */}
          <div className="text-center mb-8 sm:mb-12 px-4">
            <h2 
              className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 transition-colors duration-300 animate-fade-up ${visibleElements.has('demo-title') ? 'visible' : ''} ${isDemoOnPurple ? 'text-white' : 'text-purple-700'}`}
              data-animate-id="demo-title"
            >
              {t('landing.demoTitle') || 'Erlebe TryOnAI in Aktion'}
            </h2>
            <p 
              className={`text-base sm:text-lg max-w-3xl mx-auto transition-colors duration-300 animate-fade-up animate-stagger-1 ${visibleElements.has('demo-desc') ? 'visible' : ''} ${isDemoOnPurple ? 'text-purple-200' : 'text-gray-600'}`}
              data-animate-id="demo-desc"
            >
              {t('landing.demoDescription') || 'Sieh dir an, wie einfach es ist, Kleidung virtuell anzuprobieren. Von der Fotoauswahl bis zum fertigen Ergebnis - alles in wenigen Sekunden.'}
            </p>
          </div>
          
          {/* Demo Video Container */}
          <div 
            className={`relative rounded-xl sm:rounded-2xl overflow-hidden border-2 border-purple-500 bg-white p-2 sm:p-4 shadow-lg animate-scale-up animate-stagger-2 ${visibleElements.has('demo-video') ? 'visible' : ''}`}
            data-animate-id="demo-video"
          >
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900">
              <img 
                src="/src/assets/Präsentation1.gif" 
                alt="TryOnAI Demo - Experience our AI technology in action" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative border animation effect */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl">
              <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-2xl opacity-20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="px-4 pb-12 sm:pb-16 sm:px-6 lg:px-8" ref={ctaRef}>
        <div 
          className={`relative rounded-xl sm:rounded-2xl px-6 sm:px-8 py-8 sm:py-10 md:py-16 md:px-12 transition-all duration-300 max-w-7xl mx-auto animate-scale-up ${visibleElements.has('cta-section') ? 'visible' : ''} ${!isCtaOnPurple ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 'bg-white border-2 border-purple-500'}`}
          data-animate-id="cta-section"
        >
          <div className="relative flex flex-col items-center text-center">
            <h2 
              className={`h2 mb-3 sm:mb-4 text-2xl sm:text-3xl lg:text-4xl font-bold transition-colors duration-300 animate-fade-up ${visibleElements.has('cta-title') ? 'visible' : ''} ${!isCtaOnPurple ? 'text-white' : 'text-purple-700'}`}
              data-animate-id="cta-title"
            >
              {t('landing.readyTransform')}
            </h2>
            <p 
              className={`mb-5 sm:mb-6 text-center text-base sm:text-lg max-w-2xl transition-colors duration-300 animate-fade-up animate-stagger-1 ${visibleElements.has('cta-desc') ? 'visible' : ''} ${!isCtaOnPurple ? 'text-purple-200' : 'text-purple-600'}`}
              data-animate-id="cta-desc"
            >
              {t('landing.joinThousands')}
            </p>
            <div 
              className={`animate-fade-up animate-stagger-2 ${visibleElements.has('cta-button') ? 'visible' : ''}`}
              data-animate-id="cta-button"
            >
              <Link to="/try-on">
                <Button variant="secondary" className={`w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-2.5 sm:py-3 transition-colors duration-300 ${!isCtaOnPurple ? 'bg-white text-purple-600 hover:bg-gray-100' : 'bg-purple-600 text-white hover:bg-purple-700'}`}>
                  {t('landing.getStarted')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div ref={faqRef} className="px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 
            className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 transition-colors duration-300 animate-fade-up ${visibleElements.has('faq-title') ? 'visible' : ''} ${isFaqOnPurple ? 'text-white' : 'text-purple-700'}`}
            data-animate-id="faq-title"
          >
            {t('landing.faq.title')}
          </h2>
          <div 
            className={`space-y-3 sm:space-y-4 animate-fade-up animate-stagger-1 ${visibleElements.has('faq-items') ? 'visible' : ''}`}
            data-animate-id="faq-items"
          >
            {[
              { qKey: 'landing.faq.q1', aKey: 'landing.faq.a1' },
              { qKey: 'landing.faq.q2', aKey: 'landing.faq.a2' },
              { qKey: 'landing.faq.q3', aKey: 'landing.faq.a3' },
            ].map((item, index) => (
              <div key={index} className="bg-white shadow rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex justify-between items-center py-3 sm:py-4 px-4 sm:px-6 text-left hover:bg-gray-100 focus:outline-none focus:ring transition-colors duration-200"
                >
                  <span className="text-base sm:text-lg font-semibold pr-2">{t(item.qKey)}</span>
                  <span className="text-xl sm:text-2xl flex-shrink-0">{openFaq === index ? '−' : '+'}</span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-40' : 'max-h-0'}`}> 
                  <div className="px-4 sm:px-6 pb-3 sm:pb-4 text-sm sm:text-base text-gray-700">
                    {t(item.aKey)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div ref={testimonialsRef} className="px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 
            className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 transition-colors duration-300 animate-fade-up ${visibleElements.has('testimonials-title') ? 'visible' : ''} ${isTestimonialsOnPurple ? 'text-white' : 'text-purple-700'}`}
            data-animate-id="testimonials-title"
          >
            {t('landing.testimonials.title')}
          </h2>
          <div 
            className={`grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 animate-fade-up animate-stagger-1 ${visibleElements.has('testimonials-grid') ? 'visible' : ''}`}
            data-animate-id="testimonials-grid"
          >
          {[ 
            { img: 'https://randomuser.me/api/portraits/men/5.jpg', nameKey: 'landing.testimonials.u1.name', quoteKey: 'landing.testimonials.u1.quote' },
            { img: 'https://i.pravatar.cc/150?img=10', nameKey: 'landing.testimonials.u2.name', quoteKey: 'landing.testimonials.u2.quote' },
            { img: 'https://i.pravatar.cc/150?img=15', nameKey: 'landing.testimonials.u3.name', quoteKey: 'landing.testimonials.u3.quote' },
          ].map((item, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col items-center bg-white p-4 sm:p-6 rounded-lg shadow animate-fade-up animate-stagger-${idx + 2} ${visibleElements.has(`testimonial-${idx}`) ? 'visible' : ''}`}
              data-animate-id={`testimonial-${idx}`}
            >
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
