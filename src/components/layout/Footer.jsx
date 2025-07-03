import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Footer() {
  const { language } = useLanguage();
  
  return (
    <footer className="bg-white shadow-md text-gray-800 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto max-w-4xl">
          
          {/* Produkt */}
          <div className="text-center">
            <h3 className="font-semibold mb-4 text-purple-600">TryOnAI</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/about" className="hover:text-purple-600 transition-colors">
                {language === 'de' ? 'Über uns' : 'About us'}
              </Link></li>
              <li><Link to="/faq" className="hover:text-purple-600 transition-colors">
                {language === 'de' ? 'Hilfe & FAQ' : 'Help & FAQ'}
              </Link></li>
              <li><Link to="/contact" className="hover:text-purple-600 transition-colors">
                {language === 'de' ? 'Kontakt' : 'Contact'}
              </Link></li>
            </ul>
          </div>

          {/* Features */}
          <div className="text-center">
            <h3 className="font-semibold mb-4 text-purple-600">Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/try-on" className="hover:text-purple-600 transition-colors">
                {language === 'de' ? 'Try-On Studio' : 'Try-On Studio'}
              </Link></li>
              <li><Link to="/closet" className="hover:text-purple-600 transition-colors">
                {language === 'de' ? 'Kleiderschrank' : 'Wardrobe'}
              </Link></li>
              <li><Link to="/browse" className="hover:text-purple-600 transition-colors">
                {language === 'de' ? 'Kleidung durchstöbern' : 'Browse clothing'}
              </Link></li>
            </ul>
          </div>

          {/* Rechtliches */}
          <div className="text-center">
            <h3 className="font-semibold mb-4 text-purple-600">
              {language === 'de' ? 'Rechtliches' : 'Legal'}
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/impressum" className="hover:text-purple-600 transition-colors">
                {language === 'de' ? 'Impressum' : 'Imprint'}
              </Link></li>
              <li><Link to="/datenschutz" className="hover:text-purple-600 transition-colors">
                {language === 'de' ? 'Datenschutz' : 'Privacy'}
              </Link></li>
              <li><Link to="/agb" className="hover:text-purple-600 transition-colors">
                {language === 'de' ? 'AGB' : 'Terms'}
              </Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} TryOnAI. {language === 'de' ? 'Alle Rechte vorbehalten.' : 'All rights reserved.'}</p>
          <p className="mt-2">
            {language === 'de' 
              ? 'Ein Universitätsprojekt - Digital Product Innovation'
              : 'A University Project - Digital Product Innovation'}
          </p>
        </div>
      </div>
    </footer>
  );
}
