import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

export default function MobileDrawer({ isOpen, onClose }) {
  const { language, toggleLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-cream-100 z-50 md:hidden
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-8">
            <span className="font-bold text-xl text-lavender">TryOnAI</span>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-cream-200"
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
            </button>
          </div>

          <div className="flex flex-col space-y-4">
            <Link
              to="/try-on"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-cream-200"
            >
              {t('nav.tryOn')}
            </Link>
            <Link
              to="/browse"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-cream-200"
            >
              {t('nav.browse')}
            </Link>
            <Link
              to="/closet"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-cream-200"
            >
              {t('nav.closet')}
            </Link>
            <Link
              to="/profile"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-cream-200"
            >
              {t('nav.profile')}
            </Link>
            <Link
              to="/about"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-cream-200"
            >
              {t('nav.about')}
            </Link>
            {user ? (
              <button
                onClick={() => { signOut(); onClose(); }}
                className="p-2 text-left w-full rounded-lg hover:bg-cream-200"
              >
                {t('profile.logout')}
              </button>
            ) : (
              <Link
                to="/login"
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-cream-200"
              >
                {t('profile.modal.login')}
              </Link>
            )}
            {!user && (
              <Link
                to="/register"
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-cream-200"
              >
                {t('profile.modal.register')}
              </Link>
            )}

            {/* Language Switcher for Mobile */}
            <button
              onClick={() => {
                toggleLanguage();
                onClose();
              }}
              className="p-2 text-left border border-lavender text-lavender hover:bg-lavender hover:text-white rounded-lg transition-colors duration-200"
            >
              {language === 'de' ? t('nav.switchToEnglish') : t('nav.switchToGerman')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
