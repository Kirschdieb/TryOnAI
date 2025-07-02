import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function Contact() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulation einer Formular-Übertragung
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '', type: 'general' });
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="text-center bg-green-50">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-200 rounded-full flex items-center justify-center">
            <span className="text-2xl">✓</span>
          </div>
          <h2 className="text-2xl font-semibold mb-4 text-green-800">
            {language === 'de' ? 'Nachricht gesendet!' : 'Message sent!'}
          </h2>
          <p className="text-green-700 mb-6">
            {language === 'de' 
              ? 'Vielen Dank für Ihre Nachricht! Wir werden uns schnellstmöglich bei Ihnen melden.'
              : 'Thank you for your message! We will get back to you as soon as possible.'}
          </p>
          <Button 
            onClick={() => setSubmitted(false)}
            variant="primary"
          >
            {language === 'de' ? 'Neue Nachricht senden' : 'Send new message'}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">
        {language === 'de' ? 'Kontakt' : 'Contact'}
      </h1>

      <div className="mb-8 text-center">
        <p className="text-lg text-gray-600">
          {language === 'de' 
            ? 'Haben Sie Fragen, Feedback oder Vorschläge? Wir freuen uns auf Ihre Nachricht!'
            : 'Do you have questions, feedback, or suggestions? We look forward to hearing from you!'}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Kontaktformular */}
        <Card>
          <h2 className="text-2xl font-semibold mb-6">
            {language === 'de' ? 'Nachricht senden' : 'Send Message'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === 'de' ? 'Name *' : 'Name *'}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={language === 'de' ? 'Ihr Name' : 'Your name'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === 'de' ? 'E-Mail *' : 'Email *'}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={language === 'de' ? 'ihre.email@beispiel.de' : 'your.email@example.com'}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'de' ? 'Kategorie' : 'Category'}
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="general">
                  {language === 'de' ? 'Allgemeine Anfrage' : 'General inquiry'}
                </option>
                <option value="feedback">
                  {language === 'de' ? 'Feedback & Verbesserungen' : 'Feedback & improvements'}
                </option>
                <option value="technical">
                  {language === 'de' ? 'Technisches Problem' : 'Technical issue'}
                </option>
                <option value="collaboration">
                  {language === 'de' ? 'Zusammenarbeit' : 'Collaboration'}
                </option>
                <option value="media">
                  {language === 'de' ? 'Presse & Medien' : 'Press & media'}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'de' ? 'Betreff *' : 'Subject *'}
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={language === 'de' ? 'Worum geht es?' : 'What is this about?'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'de' ? 'Nachricht *' : 'Message *'}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={language === 'de' 
                  ? 'Teilen Sie uns Ihre Gedanken, Fragen oder Feedback mit...'
                  : 'Share your thoughts, questions, or feedback with us...'}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting 
                ? (language === 'de' ? 'Wird gesendet...' : 'Sending...')
                : (language === 'de' ? 'Nachricht senden' : 'Send message')
              }
            </Button>
          </form>
        </Card>

        {/* Kontaktinformationen */}
        <div className="space-y-8">
          <Card>
            <h2 className="text-2xl font-semibold mb-6">
              {language === 'de' ? 'Kontaktinformationen' : 'Contact Information'}
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600">📧</span>
                </div>
                <div>
                  <h3 className="font-semibold">E-Mail</h3>
                  <p className="text-gray-600">info@tryonai.de</p>
                  <p className="text-sm text-gray-500">
                    {language === 'de' 
                      ? 'Wir antworten normalerweise innerhalb von 24 Stunden'
                      : 'We usually respond within 24 hours'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600">🎓</span>
                </div>
                <div>
                  <h3 className="font-semibold">
                    {language === 'de' ? 'Universitätsprojekt' : 'University Project'}
                  </h3>
                  <p className="text-gray-600">[Ihre Universität]</p>
                  <p className="text-sm text-gray-500">
                    Digital Product Development & Innovation
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600">💡</span>
                </div>
                <div>
                  <h3 className="font-semibold">
                    {language === 'de' ? 'Feedback erwünscht' : 'Feedback welcome'}
                  </h3>
                  <p className="text-gray-600">feedback@tryonai.de</p>
                  <p className="text-sm text-gray-500">
                    {language === 'de' 
                      ? 'Ihre Meinung hilft uns, TryOnAI zu verbessern'
                      : 'Your opinion helps us improve TryOnAI'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-2xl font-semibold mb-6">
              {language === 'de' ? 'Häufige Anfragen' : 'Common Inquiries'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-purple-600 mb-2">
                  {language === 'de' ? '🤖 Technische Fragen' : '🤖 Technical Questions'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'de' 
                    ? 'Probleme mit der KI, Bildupload oder Browser-Kompatibilität'
                    : 'Issues with AI, image upload, or browser compatibility'}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-blue-600 mb-2">
                  {language === 'de' ? '💭 Feedback & Verbesserungen' : '💭 Feedback & Improvements'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'de' 
                    ? 'Ihre Ideen für neue Features oder Verbesserungen'
                    : 'Your ideas for new features or improvements'}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-green-600 mb-2">
                  {language === 'de' ? '🤝 Zusammenarbeit' : '🤝 Collaboration'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'de' 
                    ? 'Interesse an Forschungskooperationen oder Partnerschaften'
                    : 'Interest in research collaborations or partnerships'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
            <h2 className="text-xl font-semibold mb-4">
              {language === 'de' ? '🚀 Projekt-Status' : '🚀 Project Status'}
            </h2>
            <p className="text-gray-700 text-sm">
              {language === 'de' 
                ? 'TryOnAI befindet sich aktiv in der Entwicklung als Teil unseres Universitätsprojekts. Wir schätzen Ihre Geduld und Ihr wertvolles Feedback während dieser Entwicklungsphase.'
                : 'TryOnAI is actively in development as part of our university project. We appreciate your patience and valuable feedback during this development phase.'}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
