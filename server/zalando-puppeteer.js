// zalando-puppeteer.js
// Extrahiert das Produktbild einer Zalando-Seite mit Puppeteer
const puppeteer = require('puppeteer');

const PRODUCT_URL = 'https://www.zalando.de/seasalt-cornwall-mainland-jerseykleid-multi-stacked-buoys-mid-teal-sez21c0c7-t11.html'; // Beispiel-URL

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36');
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7',
  });
  try {
    console.log('Lade Zalando-Seite:', PRODUCT_URL);
    await page.goto(PRODUCT_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    // Warte, bis ein Bild geladen ist
    await page.waitForSelector('img', { timeout: 10000 });
    // Suche nach dem Hauptproduktbild (og:image oder großes Bild im Bildbereich)
    const ogImage = await page.evaluate(() => {
      const og = document.querySelector('meta[property="og:image"], meta[name="og:image"]');
      return og ? og.content : null;
    });
    let mainImage = ogImage;
    if (!mainImage) {
      // Fallback: Suche nach erstem großen Produktbild
      mainImage = await page.evaluate(() => {
        // Zalando verwendet oft <img> mit bestimmten src-Attributen
        const imgs = Array.from(document.querySelectorAll('img'));
        // Suche nach dem größten Bild
        let maxImg = null;
        let maxArea = 0;
        imgs.forEach(img => {
          const area = (img.naturalWidth || 0) * (img.naturalHeight || 0);
          if (area > maxArea && img.src && img.src.startsWith('http')) {
            maxArea = area;
            maxImg = img.src;
          }
        });
        return maxImg;
      });
    }
    if (mainImage) {
      console.log('Produktbild gefunden:', mainImage);
    } else {
      console.log('Kein Produktbild gefunden!');
    }
  } catch (err) {
    console.error('Fehler beim Laden/Extrahieren:', err);
  } finally {
    await browser.close();
  }
})();
