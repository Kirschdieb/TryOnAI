import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Card from '../ui/Card';

const FAQItem = ({ question, answer, isOpen, onToggle }) => (
  <Card className="mb-4">
    <button
      className="w-full text-left flex justify-between items-center p-0"
      onClick={onToggle}
    >
      <h3 className="text-lg font-semibold text-gray-900">{question}</h3>
      <span className="text-2xl text-gray-400">{isOpen ? '−' : '+'}</span>
    </button>
    {isOpen && (
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-gray-600 space-y-2">
          {Array.isArray(answer) ? (
            answer.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))
          ) : (
            <p>{answer}</p>
          )}
        </div>
      </div>
    )}
  </Card>
);

export default function FAQ() {
  const { language } = useLanguage();
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqData = {
    de: [
      {
        question: "Wie funktioniert TryOnAI?",
        answer: "Lade einfach ein Foto hoch, wähle Kleidung aus und erlebe die Vorschau in Echtzeit. Unsere KI analysiert Ihr Foto und das gewählte Kleidungsstück und generiert ein realistisches Bild."
      },
      {
        question: "Was ist TryOnAI?",
        answer: [
          "TryOnAI ist eine innovative Web-Anwendung, die Künstliche Intelligenz nutzt, um virtuelle Anproben von Kleidungsstücken zu ermöglichen.",
          "Sie können Fotos von sich hochladen und verschiedene Kleidungsstücke digital 'anprobieren', ohne sie physisch besitzen zu müssen."
        ]
      },
      {
        question: "Wie funktioniert die Try-On-Technologie?",
        answer: [
          "Unsere KI analysiert Ihr hochgeladenes Foto und das gewählte Kleidungsstück.",
          "Dann generiert sie ein realistisches Bild, das zeigt, wie das Kleidungsstück an Ihnen aussehen würde.",
          "Der Prozess nutzt moderne Machine Learning-Algorithmen für Bildsegmentierung und -synthese."
        ]
      },
      {
        question: "Welche Dateiformate werden unterstützt?",
        answer: "Wir unterstützen JPG, PNG und WebP. Die maximale Dateigröße beträgt 10MB und die empfohlene Auflösung ist mindestens 512x512 Pixel."
      },
      {
        question: "Welche Arten von Bildern kann ich hochladen?",
        answer: [
          "Am besten funktionieren Fotos von vorne, mit guter Beleuchtung und deutlich sichtbarer Kleidung.",
          "Unterstützte Formate: JPG, PNG, WebP",
          "Maximale Dateigröße: 10MB",
          "Empfohlene Auflösung: mindestens 512x512 Pixel"
        ]
      },
      {
        question: "Ist meine Privatsphäre sicher?",
        answer: "Ja, alle Bilder werden verschlüsselt und nur temporär verarbeitet. Es gibt keine permanente Speicherung auf unseren Servern."
      },
      {
        question: "Was passiert mit meinen hochgeladenen Fotos?",
        answer: [
          "Ihre Privatsphäre ist uns wichtig:",
          "• Fotos werden nur temporär für die KI-Verarbeitung gespeichert",
          "• Keine permanente Speicherung auf unseren Servern",
          "• Automatische Löschung nach der Verarbeitung",
          "• Lokale Speicherung in Ihrem Browser (Kleiderschrank-Feature)",
          "Weitere Details finden Sie in unserer Datenschutzerklärung."
        ]
      },
      {
        question: "Ist TryOnAI kostenlos?",
        answer: [
          "Ja, TryOnAI ist ein kostenloses Universitätsprojekt zu Bildungszwecken.",
          "Es gibt keine versteckten Kosten oder Premium-Features.",
          "Die Nutzung erfolgt im Rahmen des akademischen Projekts."
        ]
      },
      {
        question: "Was passiert mit meinen hochgeladenen Fotos?",
        answer: [
          "Ihre Privatsphäre ist uns wichtig:",
          "• Fotos werden nur temporär für die KI-Verarbeitung gespeichert",
          "• Keine permanente Speicherung auf unseren Servern",
          "• Automatische Löschung nach der Verarbeitung",
          "• Lokale Speicherung in Ihrem Browser (Kleiderschrank-Feature)",
          "Weitere Details finden Sie in unserer Datenschutzerklärung."
        ]
      },
      {
        question: "Wie genau sind die generierten Bilder?",
        answer: [
          "Die Genauigkeit hängt von verschiedenen Faktoren ab:",
          "• Qualität des Originalfotos",
          "• Beleuchtung und Pose",
          "• Art des Kleidungsstücks",
          "Da es sich um ein Universitätsprojekt handelt, befinden sich die Algorithmen noch in der Entwicklung und Verbesserung."
        ]
      },
      {
        question: "Welche Browser werden unterstützt?",
        answer: [
          "TryOnAI funktioniert in allen modernen Browsern:",
          "• Chrome (empfohlen)",
          "• Firefox",
          "• Safari",
          "• Edge",
          "Für die beste Erfahrung empfehlen wir die neueste Version Ihres Browsers."
        ]
      },
      {
        question: "Kann ich die generierten Bilder kommerziell nutzen?",
        answer: [
          "Nein, die generierten Bilder sind nur für private, nicht-kommerzielle Zwecke bestimmt.",
          "Dies ist ein Universitätsprojekt zu Bildungszwecken.",
          "Für kommerzielle Nutzung wenden Sie sich bitte an unser Team."
        ]
      },
      {
        question: "Was ist mit dem Kleiderschrank-Feature?",
        answer: [
          "Der virtuelle Kleiderschrank ermöglicht es Ihnen:",
          "• Generierte Try-On-Bilder zu speichern",
          "• Alben zu erstellen und zu organisieren",
          "• Ihre Lieblingsoutfits zu sammeln",
          "Die Daten werden lokal in Ihrem Browser gespeichert."
        ]
      },
      {
        question: "Gibt es eine mobile App?",
        answer: [
          "Aktuell ist TryOnAI als Web-Anwendung verfügbar.",
          "Sie können sie aber auf jedem Smartphone oder Tablet über den Browser nutzen.",
          "Eine native App ist für die Zukunft geplant, aber noch nicht verfügbar."
        ]
      },
      {
        question: "Wie kann ich Feedback geben?",
        answer: [
          "Ihr Feedback ist sehr wertvoll für unser Universitätsprojekt!",
          "• Nutzen Sie unser Kontaktformular",
          "• Senden Sie eine E-Mail an feedback@tryonai.de",
          "• Teilen Sie Ihre Erfahrungen und Verbesserungsvorschläge mit uns"
        ]
      },
      {
        question: "Wer hat TryOnAI entwickelt?",
        answer: [
          "TryOnAI wurde von Studierenden im Rahmen des Studiengangs 'Digitale Produktentwicklung & Innovation' entwickelt.",
          "Es ist ein akademisches Projekt unter der Betreuung von Universitätsprofessoren.",
          "Mehr Informationen finden Sie auf unserer 'Über uns'-Seite."
        ]
      }
    ],
    en: [
      {
        question: "How does TryOnAI work?",
        answer: "Simply upload a photo, choose clothing, and see a real-time preview. Our AI analyzes your photo and the selected clothing item to generate a realistic image."
      },
      {
        question: "What is TryOnAI?",
        answer: [
          "TryOnAI is an innovative web application that uses artificial intelligence to enable virtual try-ons of clothing items.",
          "You can upload photos of yourself and digitally 'try on' various clothing pieces without physically owning them."
        ]
      },
      {
        question: "How does the Try-On technology work?",
        answer: [
          "Our AI analyzes your uploaded photo and the selected clothing item.",
          "It then generates a realistic image showing how the clothing would look on you.",
          "The process uses modern machine learning algorithms for image segmentation and synthesis."
        ]
      },
      {
        question: "Which file formats are supported?",
        answer: "We support JPG, PNG, and WebP. The maximum file size is 10MB and the recommended resolution is at least 512x512 pixels."
      },
      {
        question: "What types of images can I upload?",
        answer: [
          "Front-facing photos work best, with good lighting and clearly visible clothing.",
          "Supported formats: JPG, PNG, WebP",
          "Maximum file size: 10MB",
          "Recommended resolution: at least 512x512 pixels"
        ]
      },
      {
        question: "Is my privacy protected?",
        answer: "Yes, all images are encrypted and processed temporarily only. There is no permanent storage on our servers."
      },
      {
        question: "What happens to my uploaded photos?",
        answer: [
          "Your privacy is important to us:",
          "• Photos are only temporarily stored for AI processing",
          "• No permanent storage on our servers",
          "• Automatic deletion after processing",
          "• Local storage in your browser (wardrobe feature)",
          "More details can be found in our privacy policy."
        ]
      },
      {
        question: "Is TryOnAI free?",
        answer: [
          "Yes, TryOnAI is a free university project for educational purposes.",
          "There are no hidden costs or premium features.",
          "Usage is within the scope of the academic project."
        ]
      },
      {
        question: "What happens to my uploaded photos?",
        answer: [
          "Your privacy is important to us:",
          "• Photos are only temporarily stored for AI processing",
          "• No permanent storage on our servers",
          "• Automatic deletion after processing",
          "• Local storage in your browser (wardrobe feature)",
          "More details can be found in our privacy policy."
        ]
      },
      {
        question: "Is TryOnAI free?",
        answer: [
          "Yes, TryOnAI is a free university project for educational purposes.",
          "There are no hidden costs or premium features.",
          "Usage is within the scope of the academic project."
        ]
      },
      {
        question: "How accurate are the generated images?",
        answer: [
          "Accuracy depends on various factors:",
          "• Quality of the original photo",
          "• Lighting and pose",
          "• Type of clothing item",
          "As this is a university project, the algorithms are still in development and improvement."
        ]
      },
      {
        question: "Which browsers are supported?",
        answer: [
          "TryOnAI works in all modern browsers:",
          "• Chrome (recommended)",
          "• Firefox",
          "• Safari",
          "• Edge",
          "For the best experience, we recommend using the latest version of your browser."
        ]
      },
      {
        question: "Can I use the generated images commercially?",
        answer: [
          "No, the generated images are intended for private, non-commercial use only.",
          "This is a university project for educational purposes.",
          "For commercial use, please contact our team."
        ]
      },
      {
        question: "What about the wardrobe feature?",
        answer: [
          "The virtual wardrobe allows you to:",
          "• Save generated try-on images",
          "• Create and organize albums",
          "• Collect your favorite outfits",
          "Data is stored locally in your browser."
        ]
      },
      {
        question: "Is there a mobile app?",
        answer: [
          "Currently, TryOnAI is available as a web application.",
          "However, you can use it on any smartphone or tablet through your browser.",
          "A native app is planned for the future but not yet available."
        ]
      },
      {
        question: "How can I provide feedback?",
        answer: [
          "Your feedback is very valuable for our university project!",
          "• Use our contact form",
          "• Send an email to feedback@tryonai.de",
          "• Share your experiences and suggestions with us"
        ]
      },
      {
        question: "Who developed TryOnAI?",
        answer: [
          "TryOnAI was developed by students as part of the 'Digital Product Development & Innovation' program.",
          "It is an academic project supervised by university professors.",
          "More information can be found on our 'About' page."
        ]
      }
    ]
  };

  const currentFAQ = faqData[language] || faqData.de;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">
        {language === 'de' ? 'Häufig gestellte Fragen (FAQ)' : 'Frequently Asked Questions (FAQ)'}
      </h1>

      <div className="mb-8 text-center">
        <p className="text-lg text-gray-600">
          {language === 'de' 
            ? 'Hier finden Sie Antworten auf die häufigsten Fragen zu TryOnAI. Falls Sie weitere Fragen haben, kontaktieren Sie uns gerne!'
            : 'Here you can find answers to the most common questions about TryOnAI. If you have additional questions, feel free to contact us!'}
        </p>
      </div>

      <div className="space-y-4">
        {currentFAQ.map((item, index) => (
          <FAQItem
            key={index}
            question={item.question}
            answer={item.answer}
            isOpen={openItems[index]}
            onToggle={() => toggleItem(index)}
          />
        ))}
      </div>

      {/* Kontakt CTA */}
      <Card className="mt-12 text-center bg-gradient-to-r from-purple-50 to-blue-50">
        <h2 className="text-2xl font-semibold mb-4">
          {language === 'de' ? 'Weitere Fragen?' : 'More Questions?'}
        </h2>
        <p className="text-gray-600 mb-6">
          {language === 'de' 
            ? 'Konnten wir Ihre Frage nicht beantworten? Kontaktieren Sie uns direkt!'
            : "Couldn't we answer your question? Contact us directly!"}
        </p>
        <div className="flex justify-center gap-4">
          <a 
            href="/contact" 
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            {language === 'de' ? 'Kontakt aufnehmen' : 'Get in touch'}
          </a>
          <a 
            href="mailto:info@tryonai.de" 
            className="border border-purple-600 text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors"
          >
            {language === 'de' ? 'E-Mail senden' : 'Send email'}
          </a>
        </div>
      </Card>
    </div>
  );
}
