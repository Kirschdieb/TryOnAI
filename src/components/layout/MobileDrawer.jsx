import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';

export default function MobileDrawer({ isOpen, onClose }) {
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();

  // Funktion um zu prüfen ob der Link aktiv ist
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Animation für die einzelnen Links
  const linkVariants = {
    hidden: { 
      opacity: 0,
      x: -20
    },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3
      }
    })
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.4, type: "spring", damping: 25 }}
            className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 md:hidden"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-xl text-purple-600">TryOnAI</span>
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  whileTap={{ scale: 0.9 }}
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              </div>

              <div className="flex flex-col space-y-2">
                {/* Home Link */}
                <motion.div
                  variants={linkVariants}
                  initial="hidden"
                  animate="visible"
                  custom={0}
                >
                  <Link
                    to="/"
                    onClick={onClose}
                    className={`block p-3 rounded-lg font-medium relative ${
                      isActive('/') 
                        ? 'bg-purple-600 text-white shadow-md' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {t('nav.home')}
                  </Link>
                </motion.div>

                {/* Try On Link */}
                <motion.div
                  variants={linkVariants}
                  initial="hidden"
                  animate="visible"
                  custom={1}
                >
                  <Link
                    to="/try-on"
                    onClick={onClose}
                    className={`block p-3 rounded-lg font-medium relative ${
                      isActive('/try-on') 
                        ? 'bg-purple-600 text-white shadow-md' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {t('nav.tryOn')}
                  </Link>
                </motion.div>

                {/* Closet Link */}
                <motion.div
                  variants={linkVariants}
                  initial="hidden"
                  animate="visible"
                  custom={2}
                >
                  <Link
                    to="/closet"
                    onClick={onClose}
                    className={`block p-3 rounded-lg font-medium relative ${
                      isActive('/closet') 
                        ? 'bg-purple-600 text-white shadow-md' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {t('nav.closet')}
                  </Link>
                </motion.div>

                {/* Profile Link */}
                <motion.div
                  variants={linkVariants}
                  initial="hidden"
                  animate="visible"
                  custom={3}
                >
                  <Link
                    to="/profile"
                    onClick={onClose}
                    className={`block p-3 rounded-lg font-medium relative ${
                      isActive('/profile') 
                        ? 'bg-purple-600 text-white shadow-md' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {t('nav.profile')}
                  </Link>
                </motion.div>

                {/* About Link */}
                <motion.div
                  variants={linkVariants}
                  initial="hidden"
                  animate="visible"
                  custom={4}
                >
                  <Link
                    to="/about"
                    onClick={onClose}
                    className={`block p-3 rounded-lg font-medium relative ${
                      isActive('/about') 
                        ? 'bg-purple-600 text-white shadow-md' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {t('nav.about')}
                  </Link>
                </motion.div>
                
                {/* Language Switcher for Mobile */}
                <motion.div
                  variants={linkVariants}
                  initial="hidden"
                  animate="visible"
                  custom={5}
                  className="mt-4"
                >
                  <button
                    onClick={() => {
                      toggleLanguage();
                      onClose();
                    }}
                    className="w-full p-3 text-left border border-purple-600 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors duration-200 font-medium"
                  >
                    {language === 'de' ? t('nav.switchToEnglish') : t('nav.switchToGerman')}
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
