import { useLanguage } from '../../contexts/LanguageContext';
import Card from '../ui/Card';

export default function About() {
  const { t } = useLanguage();
  
  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-center mb-12">{t('about.title')}</h1>

      <div className="space-y-8">
        <Card>
          <h2 className="text-2xl font-semibold mb-4">{t('about.mission')}</h2>
          <p className="text-gray-600 leading-relaxed">
            {t('about.missionText')}
          </p>
        </Card>

        <Card>
          <h2 className="text-2xl font-semibold mb-4">{t('about.howItWorks')}</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-lavender rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">{t('about.step1Title')}</h3>
                <p className="text-gray-600">{t('about.step1Text')}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-lavender rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">{t('about.step2Title')}</h3>
                <p className="text-gray-600">{t('about.step2Text')}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-lavender rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">{t('about.step3Title')}</h3>
                <p className="text-gray-600">{t('about.step3Text')}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-semibold mb-4">{t('about.technology')}</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            {t('about.technologyText')}
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>{t('about.tech1')}</li>
            <li>{t('about.tech2')}</li>
            <li>{t('about.tech3')}</li>
            <li>{t('about.tech4')}</li>
          </ul>
        </Card>

        <Card>
          <h2 className="text-2xl font-semibold mb-4">{t('about.privacy')}</h2>
          <p className="text-gray-600 leading-relaxed">
            {t('about.privacyText')}
          </p>
        </Card>
      </div>
    </div>
  );
}
