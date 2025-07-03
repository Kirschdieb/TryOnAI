import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
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

  // Navbar Link Component mit Animation
  const NavLink = ({ to, children }) => {
    const active = isActive(to);
    
    return (
      <motion.div>
        <Link 
          to={to} 
          className={`px-4 py-3 rounded-lg font-medium relative ${
            active
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {children}
          {active && (
            <motion.div
              className="absolute bottom-0 left-0 w-full h-0.5 bg-white"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          )}
        </Link>
      </motion.div>
    );
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
          <div className="hidden md:flex items-center justify-center space-x-4 flex-1">
            <NavLink to="/">{t('nav.home')}</NavLink>
            <NavLink to="/try-on">{t('nav.tryOn')}</NavLink>
            <NavLink to="/closet">{t('nav.closet')}</NavLink>
            <NavLink to="/profile">{t('nav.profile')}</NavLink>
            <NavLink to="/faq">{t('nav.faq')}</NavLink>
            <NavLink to="/about">{t('nav.about')}</NavLink>
          </div>
          
          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            {/* Language Switcher - ohne Animationen */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 text-sm border border-purple-600 text-purple-600 hover:bg-purple-100 rounded-lg font-medium transition-colors duration-200"
            >
              {language === 'de' ? 'EN' : 'DE'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsDrawerOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            whileTap={{ scale: 0.9 }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </nav>
  );
}
