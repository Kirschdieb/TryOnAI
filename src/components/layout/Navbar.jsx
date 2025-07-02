import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import MobileDrawer from './MobileDrawer';

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();

  // Funktion um zu prüfen ob der Link aktiv ist
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="sticky top-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="font-bold text-xl text-purple-600 flex-shrink-0">
            TryOnAI
          </Link>

          {/* Desktop Navigation - Zentriert */}
          <div className="hidden md:flex items-center justify-center space-x-2 flex-1">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/') 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t('nav.home')}
            </Link>
            <Link 
              to="/try-on" 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/try-on') 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t('nav.tryOn')}
            </Link>
            <Link 
              to="/closet" 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/closet') 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t('nav.closet')}
            </Link>
            <Link 
              to="/profile" 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/profile') 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t('nav.profile')}
            </Link>
            <Link 
              to="/about" 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/about') 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t('nav.about')}
            </Link>
          </div>
          
          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 text-sm border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white rounded-lg transition-all duration-200 font-medium"
            >
              {language === 'de' ? 'EN' : 'DE'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
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
