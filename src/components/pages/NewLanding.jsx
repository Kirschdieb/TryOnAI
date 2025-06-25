import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import Button from '../ui/Button';

export default function Landing() {
  const { t } = useLanguage();
  return (
    <div className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute left-1/2 top-0 -translate-x-1/2">
          <div className="h-[848px] w-[848px] rounded-full border border-slate-200 opacity-50 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
        </div>
      </div>

      {/* Hero Section */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-12 pt-32 md:pb-20 md:pt-40">
          <div className="text-center">
            <div className="mb-6 inline-flex rounded-full bg-cream-100 px-3 py-1 text-sm text-gray-700">
              {t('landing.experience')}
            </div>
            <h1 className="mb-8 text-5xl md:text-6xl font-bold bg-gradient-to-r from-lavender to-purple-600 bg-clip-text text-transparent">
              {t('landing.title')}
            </h1>
            <p className="text-xl text-gray-600 mb-8 mx-auto max-w-3xl">
              {t('landing.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/try-on">
                <Button variant="primary" className="w-full sm:w-auto text-lg px-8 py-3 group">
                  {t('landing.tryNow')}
                  <span className="tracking-normal ml-2 transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </Button>
              </Link>
              <Link to="/closet">
                <Button variant="outline" className="w-full sm:w-auto text-lg px-8 py-3">
                  {t('landing.viewCloset')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="relative py-12">
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <div className="py-12 md:py-20">
              <h2 className="text-3xl font-bold text-center mb-12">{t('landing.howItWorks')}</h2>
              <div className="mx-auto grid max-w-sm items-start gap-8 md:max-w-none md:grid-cols-3 lg:gap-16">                {/* Upload Photo */}
                <Link to="/profile" className="relative flex flex-col items-center group hover:transform hover:scale-105 transition-transform">
                  <div className="mb-4 h-16 w-16 bg-lavender rounded-full flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t('landing.uploadPhoto')}</h3>
                  <p className="text-gray-600 text-center">
                    {t('landing.uploadPhotoDesc')}
                  </p>
                </Link>                {/* Choose Clothing */}
                <Link to="/browse" className="relative flex flex-col items-center group hover:transform hover:scale-105 transition-transform">
                  <div className="mb-4 h-16 w-16 bg-lavender rounded-full flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t('landing.chooseClothing')}</h3>
                  <p className="text-gray-600 text-center">
                    {t('landing.chooseClothingDesc')}
                  </p>
                </Link>{/* About Us */}
                <Link to="/about" className="relative flex flex-col items-center group hover:transform hover:scale-105 transition-transform">
                  <div className="mb-4 h-16 w-16 bg-lavender rounded-full flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t('landing.aboutUs')}</h3>
                  <p className="text-gray-600 text-center">
                    {t('landing.aboutUsDesc')}
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Animation Section */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">        <div className="relative aspect-video rounded-2xl bg-gray-900 px-5 py-3 shadow-xl">
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
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <div className="relative bg-gradient-to-r from-lavender to-purple-600 rounded-2xl px-8 py-10 md:py-16 md:px-12">
          <div className="relative flex flex-col items-center">
            <h2 className="h2 mb-4 text-center text-3xl font-bold text-white">{t('landing.readyTransform')}</h2>
            <p className="mb-6 text-center text-lg text-purple-200">
              {t('landing.joinThousands')}
            </p>
            <Link to="/try-on">
              <Button variant="secondary" className="w-full sm:w-auto text-lg px-8 py-3 bg-white text-purple-600 hover:bg-gray-100">
                {t('landing.getStarted')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
