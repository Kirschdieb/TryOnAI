// zalando-test.js
// Testskript für den Abruf verschiedener Produktseiten
const fetch = require('node-fetch');

const TEST_URLS = [
  'https://www.zalando.de/indicode-jeans-hemd-surf-ij022d03r-k14.html',
  'https://www.aboutyou.de/p/only/jeanshemd-onlsky-2-0-6228572',
  'https://www.hm.com/de/product/12345678', // Beispiel H&M-Link (ggf. anpassen)
  'https://www.amazon.de/dp/B07PGL2ZSL', // Beispiel Amazon-Link (ggf. anpassen)
];

(async () => {
  for (const url of TEST_URLS) {
    try {
      console.log('\nTeste Abruf von:', url);
      const resp = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml",
        },
      });
      console.log('Status:', resp.status);
      console.log('Headers:', Object.fromEntries(resp.headers.entries()));
      const html = await resp.text();
      console.log('HTML-Ausschnitt (erste 500 Zeichen):');
      console.log(html.slice(0, 500));
    } catch (err) {
      console.error('Fehler beim Abruf:', err);
    }
  }
})();
