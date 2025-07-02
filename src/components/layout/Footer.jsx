import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Produkt */}
          <div>
            <h3 className="font-semibold mb-4">TryOnAI</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/about" className="hover:text-white transition-colors">Über uns</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Kontakt</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/try-on" className="hover:text-white transition-colors">Try-On Studio</Link></li>
              <li><Link to="/closet" className="hover:text-white transition-colors">Kleiderschrank</Link></li>
              <li><Link to="/browse" className="hover:text-white transition-colors">Kleidung durchstöbern</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/faq" className="hover:text-white transition-colors">Hilfe & FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Kontakt</Link></li>
              <li><a href="mailto:info@tryonai.de" className="hover:text-white transition-colors">info@tryonai.de</a></li>
            </ul>
          </div>

          {/* Rechtliches */}
          <div>
            <h3 className="font-semibold mb-4">Rechtliches</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/impressum" className="hover:text-white transition-colors">Impressum</Link></li>
              <li><Link to="/datenschutz" className="hover:text-white transition-colors">Datenschutz</Link></li>
              <li><Link to="/agb" className="hover:text-white transition-colors">AGB</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} TryOnAI. Alle Rechte vorbehalten.</p>
          <p className="mt-2">
            Ein Universitätsprojekt - Digitale Produktentwicklung & Innovation
          </p>
        </div>
      </div>
    </footer>
  );
}
