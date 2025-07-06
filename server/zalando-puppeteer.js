const puppeteer = require('puppeteer');

async function extractProductImage(productUrl) {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36');
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7',
    });

    await page.goto(productUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('img', { timeout: 10000 });

    const ogImage = await page.evaluate(() => {
      const og = document.querySelector('meta[property="og:image"], meta[name="og:image"]');
      return og ? og.content : null;
    });

    if (ogImage) {
      return ogImage;
    }

    // Fallback: Suche nach erstem großen Produktbild
    const mainImage = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
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

    return mainImage;
  } catch (err) {
    console.error('Fehler beim Laden/Extrahieren:', err);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = { extractProductImage };
