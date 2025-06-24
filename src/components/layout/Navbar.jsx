import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import MobileDrawer from './MobileDrawer';

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <nav className="sticky top-0 bg-cream-100 shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="font-bold text-xl text-lavender">
            TryOnAI
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/try-on" className="text-gray-600 hover:text-lavender">
              {t('nav.tryOn')}
            </Link>
            <Link to="/closet" className="text-gray-600 hover:text-lavender">
              {t('nav.closet')}
            </Link>
            <Link to="/profile" className="text-gray-600 hover:text-lavender">
              {t('nav.profile')}
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-lavender">
              {t('nav.about')}
            </Link>
            
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 text-sm border border-lavender text-lavender hover:bg-lavender hover:text-white rounded-md transition-colors duration-200"
            >
              {language === 'de' ? 'EN' : 'DE'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-cream-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </nav>
  );
}
