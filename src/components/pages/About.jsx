import { useLanguage } from '../../contexts/LanguageContext';
import Card from '../ui/Card';

export default function About() {
  const { t } = useLanguage();
  
  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-center mb-12">{t('about.title')}</h1>

      <div className="space-y-8">
        <Card>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            TryOnAI aims to revolutionize online shopping by providing a seamless virtual try-on experience. 
            Our platform combines cutting-edge AI technology with an intuitive interface to help you visualize 
            how clothes will look on you before making a purchase.
          </p>
        </Card>

        <Card>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-lavender rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Upload Your Photo</h3>
                <p className="text-gray-600">Start by uploading a full-body photo of yourself in a neutral pose.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-lavender rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Select Clothing</h3>
                <p className="text-gray-600">Choose clothing items by uploading an image or pasting a Zalando product URL.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-lavender rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Generate Preview</h3>
                <p className="text-gray-600">Our AI technology will create a realistic preview of how the clothing looks on you.</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-semibold mb-4">Technology</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            TryOnAI is built using modern web technologies and AI:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>React and Vite for a responsive frontend</li>
            <li>Tailwind CSS for beautiful, custom styling</li>
            <li>State management with Zustand</li>
            <li>AI-powered image processing for realistic try-on results</li>
          </ul>
        </Card>

        <Card>
          <h2 className="text-2xl font-semibold mb-4">Privacy & Security</h2>
          <p className="text-gray-600 leading-relaxed">
            We take your privacy seriously. All uploaded photos are processed securely and are not stored 
            permanently on our servers. The virtual try-on results are saved only in your local browser 
            storage for your convenience.
          </p>
        </Card>
      </div>
    </div>
  );
}
