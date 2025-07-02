import { useLanguage } from '../../contexts/LanguageContext';

export default function Impressum() {
  const { t, language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">
        {language === 'de' ? 'Impressum' : 'Legal Notice'}
      </h1>

      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {language === 'de' ? 'Angaben gemäß § 5 TMG' : 'Information according to § 5 TMG'}
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="mb-2"><strong>Verantwortlich für den Inhalt:</strong></p>
            <p>Max Mustermann</p>
            <p>Musterstraße 123</p>
            <p>12345 Musterstadt</p>
            <p>Deutschland</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {language === 'de' ? 'Kontakt' : 'Contact'}
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p><strong>E-Mail:</strong> info@tryonai.de</p>
            <p><strong>Telefon:</strong> +49 (0) 123 456789</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {language === 'de' ? 'Universitätsprojekt' : 'University Project'}
          </h2>
          <div className="bg-blue-50 p-6 rounded-lg">
            <p className="mb-2">
              <strong>
                {language === 'de' 
                  ? 'Dieses Projekt wurde im Rahmen des Studiums entwickelt:' 
                  : 'This project was developed as part of university studies:'}
              </strong>
            </p>
            <p>Hochschule/Universität: Friedrich-Schiller Universität</p>
            <p>Studiengang: Digital Product Innovation</p>
            <p>Semester: Wintersemester 2024/25</p>
            <p>Betreuender Professor: Prof. Dr. Wessel</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {language === 'de' ? 'Haftungsausschluss' : 'Disclaimer'}
          </h2>
          <div className="text-sm text-gray-600">
            <h3 className="font-semibold mb-2">
              {language === 'de' ? 'Haftung für Inhalte' : 'Liability for content'}
            </h3>
            <p className="mb-4">
              {language === 'de' 
                ? 'Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.'
                : 'As a service provider, we are responsible for our own content on these pages in accordance with § 7 para.1 TMG under general law. According to §§ 8 to 10 TMG, however, we as service providers are not under the obligation to monitor transmitted or stored third-party information or to research circumstances that indicate illegal activity.'}
            </p>

            <h3 className="font-semibold mb-2">
              {language === 'de' ? 'Akademischer Zweck' : 'Academic Purpose'}
            </h3>
            <p>
              {language === 'de' 
                ? 'Diese Anwendung wurde ausschließlich zu Bildungs- und Demonstrationszwecken im Rahmen eines Universitätsprojekts entwickelt. Sie ist nicht für den kommerziellen Einsatz bestimmt.'
                : 'This application was developed exclusively for educational and demonstration purposes as part of a university project. It is not intended for commercial use.'}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
