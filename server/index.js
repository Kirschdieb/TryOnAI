require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI, toFile } = require('openai');
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const cheerio = require('cheerio');
const multer = require('multer');
// Node.js fetch Polyfill für serverseitige Nutzung
let fetch = global.fetch;
if (!fetch) {
  fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
}
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.urlencoded({ extended: true }));

const TEMP_DIR = path.join(__dirname, 'temp');
// TEMP_DIR will be created asynchronously before server listen

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TEMP_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${uuidv4()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
    fieldSize: 10 * 1024 * 1024, // 10MB field size limit (for base64 data)
    fields: 10, // Maximum number of non-file fields
    files: 5 // Maximum number of file fields
  }
});

// Check if API Key is loaded
if (!process.env.OPENAI_API_KEY) {
  console.error('ERROR: OPENAI_API_KEY not found. Make sure it is set in your .env file.');
  process.exit(1); // Exit if API key is not found
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// API Endpoint for image generation
app.post('/api/generate-tryon-image', express.json({ limit: '10mb' }), async (req, res) => {
  try {
    const { userPhotoUrl, clothPhotoUrl, customPrompt } = req.body;

    // --- Placeholder for OpenAI API call --- 
    // For now, let's log the received data and return a mock response.
    console.log('Received data for image generation:');
    console.log('User Photo URL:', userPhotoUrl);
    console.log('Cloth Photo URL:', clothPhotoUrl);
    console.log('Custom Prompt:', customPrompt);

    // TODO: Implement actual OpenAI API call using userPhotoUrl, clothPhotoUrl, and customPrompt.
    // This will likely involve fetching image data from URLs if they are remote,
    // or handling image data if sent directly.
    // The specific OpenAI API method (e.g., edits, generations v2) will depend on the exact desired outcome.

    // Mock response
    const mockGeneratedImageUrl = clothPhotoUrl || 'https://via.placeholder.com/512x768.png?text=Generated+Image+Placeholder';
    
    res.json({ 
      message: 'Image generation request received (mock response).',
      generatedImageUrl: mockGeneratedImageUrl 
    });

  } catch (error) {
    console.error('Error in /api/generate-tryon-image:', error.message);
    if (error.response) {
      console.error('OpenAI API Error Status:', error.response.status);
      console.error('OpenAI API Error Data:', error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: 'An unexpected error occurred on the server.', details: error.message });
    }
  }
});

// Helper function to download an image from a URL and save it temporarily
async function downloadImageAsTempFile(imageUrl, baseName) {
  // TEMP_DIR should be ensured at startup or before this call
  const uniqueFilename = `${baseName}-${uuidv4()}${path.extname(imageUrl.split('?')[0]) || '.jpg'}`;
  const tempFilePath = path.join(TEMP_DIR, uniqueFilename);
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    await fsp.writeFile(tempFilePath, response.data);
    return tempFilePath;
  } catch (error) {
    console.error(`Failed to download image from ${imageUrl}:`, error.message);
    throw new Error(`Failed to download image for ${baseName} from ${imageUrl}`);
  }
}

app.post('/api/tryon', upload.single('userPhoto'), async (req, res) => { // 'userPhoto' is the field name from FormData
  console.log('--- /api/tryon request received ---');
  console.log('req.file (userPhoto):', req.file);
  console.log('req.body (customPrompt, clothImageUrl, imageQuality):', req.body);
  const { customPrompt, clothImageUrl, imageQuality } = req.body; // clothImageUrl is a string (URL)
  let userPhotoUploadedPath = null;
  let clothPhotoDownloadedPath = null;

  if (!req.file) {
    return res.status(400).json({ message: 'userPhoto file is required.' });
  }
  userPhotoUploadedPath = req.file.path; // Path to the uploaded user photo by multer

  if (!clothImageUrl || typeof clothImageUrl !== 'string' || 
      (!clothImageUrl.startsWith('http') && !clothImageUrl.startsWith('data:'))) {
     // Accept both HTTP/S URLs and base64 data URLs
    if (userPhotoUploadedPath) await fsp.unlink(userPhotoUploadedPath).catch(err => console.error('Failed to delete temp user photo on cloth error:', err));
    return res.status(400).json({ message: 'clothImageUrl must be a valid HTTP/S URL string or base64 data URL.' });
  }

  try {
    // Handle cloth image: either download from URL or save base64 data
    if (clothImageUrl.startsWith('data:')) {
      // Handle base64 data URL
      const base64Data = clothImageUrl.split(',')[1];
      const mimeType = clothImageUrl.split(';')[0].split(':')[1];
      const extension = mimeType === 'image/jpeg' ? '.jpg' : 
                       mimeType === 'image/png' ? '.png' : 
                       mimeType === 'image/webp' ? '.webp' : '.jpg';
      
      const uniqueFilename = `cloth-image-${uuidv4()}${extension}`;
      clothPhotoDownloadedPath = path.join(TEMP_DIR, uniqueFilename);
      
      const buffer = Buffer.from(base64Data, 'base64');
      await fsp.writeFile(clothPhotoDownloadedPath, buffer);
    } else {
      // Handle HTTP/HTTPS URL - download it
      clothPhotoDownloadedPath = await downloadImageAsTempFile(clothImageUrl, 'cloth-image');
    }

    const promptText = `Put the clothing item from the reference image onto the person in the main image. Make it photorealistic, keep pose and background unchanged. ${customPrompt || ''}`;

    const userPhotoFile = await toFile(fs.createReadStream(userPhotoUploadedPath), path.basename(userPhotoUploadedPath), { type: req.file.mimetype });
    const clothFileExtension = path.extname(clothPhotoDownloadedPath).toLowerCase();
    let clothMimeType = 'application/octet-stream'; // Default
    if (clothFileExtension === '.jpg' || clothFileExtension === '.jpeg') {
      clothMimeType = 'image/jpeg';
    } else if (clothFileExtension === '.png') {
      clothMimeType = 'image/png';
    } else if (clothFileExtension === '.webp') {
      clothMimeType = 'image/webp';
    }
    const clothPhotoFile = await toFile(fs.createReadStream(clothPhotoDownloadedPath), path.basename(clothPhotoDownloadedPath), { type: clothMimeType });

    const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    // Convert the imageQuality value to match the expected API parameter values
    // Valid values for quality are 'low', 'medium', 'high', or 'hd' (equivalent to 'high')
    const apiQuality = imageQuality || 'medium';
    console.log(`Using image quality: ${apiQuality}`);
    
    const response = await openaiClient.images.edit({
      model: 'gpt-image-1', // As per user, this model works
      image: [userPhotoFile, clothPhotoFile], // As per user, this structure works
      prompt: promptText,
      quality: apiQuality, // Add the quality parameter
    });

    let imageUrlToClient;
    // Log metadata or a snippet, not the full b64_json if present
    if (response.data && response.data[0]) {
      const firstItem = response.data[0];
      console.log('OpenAI API Response (first item):', {
        url: firstItem.url ? firstItem.url.substring(0, 100) + '...' : undefined,
        b64_json_present: !!firstItem.b64_json,
        revised_prompt: firstItem.revised_prompt
      });

      if (firstItem.url) {
        imageUrlToClient = firstItem.url;
      } else if (firstItem.b64_json) {
        // Assuming PNG, as DALL·E 2 edits often return PNG.
        // If a different format is possible, this might need adjustment or detection.
        imageUrlToClient = `data:image/png;base64,${firstItem.b64_json}`;
      } else {
        console.error('OpenAI response did not contain url or b64_json for the first item.');
        return res.status(500).json({ message: 'Failed to get image data from OpenAI response.' });
      }
    } else {
      console.error('OpenAI response data is missing or empty.');
      return res.status(500).json({ message: 'Invalid response structure from OpenAI.' });
    }
    res.json({ imageUrl: imageUrlToClient });

  } catch (error) {
    console.error('Error in /api/tryon:', error.message);
    if (error.response && error.response.data) {
      console.error('OpenAI API Error Status:', error.response.status);
      console.error('OpenAI API Error Data:', error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else if (error.response) {
        console.error('OpenAI API Error Status:', error.response.status);
        res.status(error.response.status).json({ message: 'OpenAI API error without data.'});
    }else {
      res.status(500).json({ message: 'An unexpected error occurred on the server.', details: error.message });
    }
  } finally {
    // Clean up temporary files
    if (userPhotoUploadedPath) {
      await fsp.unlink(userPhotoUploadedPath).catch(err => console.error('Failed to delete uploaded user photo:', err));
    }
    if (clothPhotoDownloadedPath) {
      await fsp.unlink(clothPhotoDownloadedPath).catch(err => console.error('Failed to delete downloaded cloth photo:', err));
    }
  }
});

// Add Zalando image extraction endpoint
app.get('/api/extract', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).json({ error: "Parameter ?url fehlt" });
  }

  let responded = false;
  const respondOnce = (data, status = 200) => {
    if (!responded) {
      responded = true;
      if (status === 200) res.json(data);
      else res.status(status).json(data);
    }
  };

  // --- Methode 1: Schnelle Extraktion mit fetch/cheerio ---
  const fastExtract = async () => {
    try {
      console.log(`[extract] Starte fetch/cheerio für: ${targetUrl}`);
      const shopResp = await fetch(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml",
        },
      });
      console.log(`[extract] fetch Status: ${shopResp.status} für ${targetUrl}`);
      if (!shopResp.ok) {
        console.warn(`[extract] fetch fehlgeschlagen (${shopResp.status}) für ${targetUrl}`);
        // NICHT direkt antworten, damit Puppeteer übernehmen kann
        return;
      }
      const html = await shopResp.text();
      const $ = cheerio.load(html);
      const ogImg = $('meta[property="og:image"], meta[name="og:image"]').attr("content");
      if (ogImg) {
        const cleanImageUrl = ogImg.split('?')[0];
        console.log(`[extract] fetch/cheerio: og:image gefunden: ${cleanImageUrl}`);
        respondOnce({ imageUrl: cleanImageUrl });
        return;
      }
      const img = $("picture img").first().attr("src") || $("img").first().attr("src");
      if (img) {
        const cleanImageUrl = img.split('?')[0];
        console.log(`[extract] fetch/cheerio: <img> gefunden: ${cleanImageUrl}`);
        respondOnce({ imageUrl: cleanImageUrl });
        return;
      }
      console.warn(`[extract] fetch/cheerio: Kein Bild gefunden für ${targetUrl}`);
      // Kein Bild gefunden, aber nicht direkt antworten, falls Puppeteer noch läuft
    } catch (err) {
      console.error(`[extract] fetch/cheerio Fehler:`, err);
      // Fehler ignorieren, Puppeteer übernimmt ggf.
    }
  };

  // --- Methode 2: Puppeteer als Fallback ---
  const puppeteerExtract = async () => {
    try {
      console.log(`[extract] Starte Puppeteer für: ${targetUrl}`);
      const puppeteer = require('puppeteer');
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true,
      });
      const page = await browser.newPage();
      await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36");
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      // Warte auf irgendein Bild im DOM (max. 10s)
      try {
        await page.waitForSelector('img[src]', { timeout: 10000 });
      } catch (e) {
        console.warn('[extract] Kein <img> mit src nach 10s gefunden.');
      }
      // Nimm das größte Bild auf der Seite
      const biggestImg = await page.$$eval('img[src]', imgs => {
        let maxArea = 0, best = null;
        for (const img of imgs) {
          const area = (img.naturalWidth || img.width || 0) * (img.naturalHeight || img.height || 0);
          if (img.src && area > maxArea) {
            maxArea = area;
            best = img.src;
          }
        }
        return best;
      });
      await browser.close();
      if (biggestImg) {
        console.log(`[extract] Puppeteer: Größtes Bild gefunden: ${biggestImg.split('?')[0]}`);
        respondOnce({ imageUrl: biggestImg.split('?')[0] });
        return;
      }
      console.warn(`[extract] Puppeteer: Kein Bild gefunden für ${targetUrl}`);
      respondOnce({ error: "Kein Bild gefunden (Puppeteer)" }, 404);
    } catch (err) {
      console.error(`[extract] Puppeteer Fehler:`, err);
      respondOnce({ error: err.message || "Unbekannter Fehler (Puppeteer)" }, 500);
    }
  };

  // --- Ablaufsteuerung: Fast-First, dann Fallback ---
  let fastDone = false;
  const fastPromise = fastExtract().then(() => { fastDone = true; });
  // Starte Puppeteer nach 2s, falls fastExtract nicht erfolgreich war
  const puppeteerTimeout = setTimeout(() => {
    if (!responded) puppeteerExtract();
  }, 2000);

  // Harte Timeout-Grenze (z.B. 15s)
  setTimeout(() => {
    if (!responded) respondOnce({ error: "Timeout bei der Bildextraktion" }, 504);
  }, 15000);
});

// Function to scrape Zalando products using Puppeteer (fallback method)
async function scrapeZalandoWithPuppeteer(category = 'all') {
  const categoryUrls = {
    'Alle': 'https://www.zalando.de/herrenbekleidung/',
    'Hemden': 'https://www.zalando.de/herrenbekleidung-hemden/',
    'Hosen': 'https://www.zalando.de/herrenbekleidung-hosen/',
    'Shirts': 'https://www.zalando.de/herrenbekleidung-shirts/',
    'Jacken': 'https://www.zalando.de/herrenbekleidung-jacken/'
  };
  const url = categoryUrls[category.toLowerCase()] || categoryUrls['alle'];
  let browser = null;

  try {
    console.log(`[puppeteerScrape] Launching browser for: ${url}`);
    
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // Set realistic headers and viewport
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Set extra headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    });

    // Navigate to the page
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // Wait for products to load - updated selectors based on real Zalando page
    await page.waitForSelector('a[href*=".html"], [data-testid*="product"]', { timeout: 15000 });    // Extract product data
    const products = await page.evaluate(() => {
      // Look for product links that end with .html (Zalando product pages)
      const productLinks = Array.from(document.querySelectorAll('a[href*=".html"]'))
        .map(link => link.href)
        .filter(href => href.includes('.html') && href.includes('zalando.de'));
      
      // Remove duplicates by using a Set
      const uniqueLinks = [...new Set(productLinks.map(url => url.split('?')[0].split('#')[0]))];
      const limitedLinks = uniqueLinks.slice(0, 20); // Limit to 20 unique products

      const results = [];

      limitedLinks.forEach((productUrl, index) => {
        const linkElement = document.querySelector(`a[href="${productUrl}"]`);
        if (!linkElement) return;

        // Find the product container
        const container = linkElement.closest('div, article') || linkElement;

        // Extract image
        const imgElement = container.querySelector('img') || linkElement.querySelector('img');
        let image = '';
        if (imgElement) {
          image = imgElement.src || imgElement.getAttribute('data-src') || imgElement.getAttribute('data-original') || '';
          if (image && !image.startsWith('http')) {
            image = `https:${image}`;
          }
        }

        // Improved product name extraction
        let name = '';
        
        // First try to get name from URL - this is more reliable for Zalando
        if (productUrl) {
          const urlParts = productUrl.split('/').pop().replace(/\.html.*/, '').split('-');
          // Entferne von hinten ALLE Teile, die wie Produktcodes aussehen (enthalten Ziffern oder sind sehr kurz)
          let nameParts = [...urlParts];
          while (
            nameParts.length > 2 && (
              /\d/.test(nameParts[nameParts.length - 1]) ||
              nameParts[nameParts.length - 1].length <= 3
            )
          ) {
            nameParts.pop();
          }
          name = nameParts
            .join(' ')
            .replace(/[^a-zA-ZäöüÄÖÜß\s]/g, '') // Keep German characters
            .trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
        }

        // If URL extraction failed, try surrounding text (but be more selective)
        if (!name || name.length < 3) {
          const textElements = container.querySelectorAll('*');
          for (let elem of textElements) {
            const text = elem.textContent?.trim();
            // Look for meaningful product names (avoid UI elements)
            if (text && 
                text.length > 3 && 
                text.length < 80 && 
                !text.includes('€') && 
                !text.includes('heart_outlined') && 
                !text.includes('favorite') &&
                !text.includes('Sponsored') &&
                !text.includes('Skip') &&
                !text.match(/^[0-9\s\.\,\%\-]+$/) && // Avoid pure numbers/percentages
                text.split(' ').length >= 2) { // At least 2 words for a product name
              name = text;
              break;
            }
          }
        }

        // Last resort: create a generic name based on current URL
        if (!name || name.length < 3) {
          const currentUrl = window.location.href;
          const categoryName = currentUrl.includes('hemden') ? 'Hemd' :
                              currentUrl.includes('hosen') ? 'Hose' :
                              currentUrl.includes('shirts') ? 'Shirt' :
                              currentUrl.includes('jacken') ? 'Jacke' : 'Artikel';
          name = `${categoryName} ${index + 1}`;
        }        // Look for price (usually contains €) - improved extraction
        let price = '';
        const textElements = container.querySelectorAll('*');
        for (let elem of textElements) {
          const text = elem.textContent?.trim();
          if (text && text.includes('€')) {            // Match various price formats: €29.99, €29,99, 29.99 €, 29,99 €
            const priceMatch = text.match(/(?:€\s*)?(\d{1,4})[,\.]\d{2}\s*€?/);
            if (priceMatch) {
              let foundPrice = priceMatch[0];
              // Extract just the numeric part with decimal separator
              const numericMatch = foundPrice.match(/(\d{1,4})[,\.]\d{2}/);
              if (numericMatch) {
                const numericPrice = numericMatch[0].replace('.', ','); // Ensure comma separator
                price = `€${numericPrice}`;
                break;
              }
            }
          }
        }
        
        // Generate realistic random price if no price found
        if (!price) {
          const currentUrl = window.location.href;
          const categoryPriceRanges = {
            'hemden': [29, 89],
            'hosen': [39, 129],
            'shirts': [19, 69],
            'jacken': [59, 299]
          };
          let range = [25, 99]; // default
          if (currentUrl.includes('hemden')) range = categoryPriceRanges.hemden;
          else if (currentUrl.includes('hosen')) range = categoryPriceRanges.hosen;
          else if (currentUrl.includes('shirts')) range = categoryPriceRanges.shirts;
          else if (currentUrl.includes('jacken')) range = categoryPriceRanges.jacken;
          
          const randomPrice = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
          price = `€${randomPrice},99`;
        }

        if (name && image && productUrl) {
          results.push({
            id: index + 1,
            name: name,
            price: price,
            image: image,
            url: productUrl
          });
        }
      });

      return results;
    });

    // Add category information for men's clothing
    const productsWithCategory = products.map(product => {
      let productCategory = 'Other';
      if (url.includes('hemden') || product.name.toLowerCase().includes('hemd') || product.name.toLowerCase().includes('shirt')) {
        productCategory = 'Hemden';
      } else if (url.includes('hosen') || product.name.toLowerCase().includes('hose') || product.name.toLowerCase().includes('jean') || product.name.toLowerCase().includes('trouser')) {
        productCategory = 'Hosen';
      } else if (url.includes('shirts') || product.name.toLowerCase().includes('t-shirt') || product.name.toLowerCase().includes('top')) {
        productCategory = 'Shirts';
      } else if (url.includes('jacken') || product.name.toLowerCase().includes('jacke') || product.name.toLowerCase().includes('mantel') || product.name.toLowerCase().includes('jacket') || product.name.toLowerCase().includes('coat')) {
        productCategory = 'Jacken';
      }

      return {
        ...product,
        category: productCategory
      };
    });

    console.log(`[puppeteerScrape] Found ${productsWithCategory.length} products`);
    return productsWithCategory;

  } catch (error) {
    console.error('[puppeteerScrape] Error:', error.message);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Function to scrape Zalando products
async function scrapeZalandoProducts(category = 'alle') {
  const categoryUrls = {
    'alle': 'https://www.zalando.de/herrenbekleidung/',
    'hemden': 'https://www.zalando.de/herrenbekleidung-hemden/',
    'hosen': 'https://www.zalando.de/herrenbekleidung-hosen/',
    'shirts': 'https://www.zalando.de/herrenbekleidung-shirts/',
    'jacken': 'https://www.zalando.de/herrenbekleidung-jacken/'
  };
  const url = categoryUrls[category.toLowerCase()] || categoryUrls['alle'];
  
  try {
    console.log(`[scrapeZalando] Fetching from: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0'
      },
      timeout: 10000
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const products = [];    // Updated selectors based on actual Zalando HTML structure
    const productLinks = [];
    const seenUrls = new Set(); // Track unique URLs to avoid duplicates
    $('a[href*=".html"]').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.includes('.html') && href.includes('zalando.de') && productLinks.length < 20) {
        // Normalize URL by removing query parameters and fragments
        const cleanUrl = href.split('?')[0].split('#')[0];
        if (!seenUrls.has(cleanUrl)) {
          seenUrls.add(cleanUrl);
          productLinks.push(cleanUrl);
        }
      }
    });

    productLinks.forEach((productUrl, index) => {
      if (products.length >= 20) return;

      const linkElement = $(`a[href="${productUrl}"]`).first();
      const container = linkElement.closest('div') || linkElement;

      // Extract image
      const imgElement = container.find('img').first();
      let image = imgElement.attr('src') || imgElement.attr('data-src') || imgElement.attr('data-original') || '';
      
      if (image && !image.startsWith('http')) {
        image = `https:${image}`;
      }

      // Improved product name extraction from URL
      let name = '';
      
      // First try to get name from URL - this is more reliable for Zalando
      if (productUrl) {
        const urlParts = productUrl.split('/').pop().replace(/\.html.*/, '').split('-');
        // Entferne von hinten ALLE Teile, die wie Produktcodes aussehen (enthalten Ziffern oder sind sehr kurz)
        let nameParts = [...urlParts];
        while (
          nameParts.length > 2 && (
            /\d/.test(nameParts[nameParts.length - 1]) ||
            nameParts[nameParts.length - 1].length <= 3
          )
        ) {
          nameParts.pop();
        }
        name = nameParts
          .join(' ')
          .replace(/[^a-zA-ZäöüÄÖÜß\s]/g, '') // Keep German characters
          .trim()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      }

      // If URL extraction failed, try surrounding text (but be more selective)
      if (!name || name.length < 3) {
        container.find('*').each((i, elem) => {
          const text = $(elem).text().trim();
          // Look for meaningful product names (avoid UI elements)
          if (text && 
              text.length > 3 && 
              text.length < 80 && 
              !text.includes('€') && 
              !text.includes('heart_outlined') && 
              !text.includes('favorite') &&
              !text.includes('Sponsored') &&
              !text.includes('Skip') &&
              !text.match(/^[0-9\s\.\,\%\-]+$/) && // Avoid pure numbers/percentages
              text.split(' ').length >= 2) { // At least 2 words for a product name
            name = text;
            return false; // break
          }
        });
      }

      // Last resort: create a generic name based on category
      if (!name || name.length < 3) {
        const categoryName = category === 'alle' ? 'Artikel' : 
                            category === 'hemden' ? 'Hemd' :
                            category === 'hosen' ? 'Hose' :
                            category === 'shirts' ? 'Shirt' :
                            category === 'jacken' ? 'Jacke' : 'Artikel';
        name = `${categoryName} ${index + 1}`;
      }      // Look for price - improved extraction
      let price = '';
      
      // Try multiple price extraction methods
      // Method 1: Look for common price patterns
      container.find('*').each((i, elem) => {
        const text = $(elem).text().trim();
        if (text && text.includes('€')) {          // Match various price formats: €29.99, €29,99, 29.99 €, 29,99 €
          const priceMatch = text.match(/(?:€\s*)?(\d{1,4})[,\.]\d{2}\s*€?/);
          if (priceMatch && !price) {
            // Extract just the numeric part with decimal separator
            const numericMatch = priceMatch[0].match(/(\d{1,4})[,\.]\d{2}/);
            if (numericMatch) {
              const numericPrice = numericMatch[0].replace('.', ','); // Ensure comma separator
              price = `€${numericPrice}`;
              return false; // break
            }
          }
        }
      });
      
      // Method 2: Look for specific price-related selectors if Method 1 fails
      if (!price) {
        const priceSelectors = [
          '[data-testid*="price"]',
          '.price',
          '[class*="price"]',
          '[class*="Price"]',
          'span[class*="price"]',
          'div[class*="price"]'
        ];
        
        for (const selector of priceSelectors) {
          const priceElement = container.find(selector).first();
          if (priceElement.length > 0) {
            const text = priceElement.text().trim();            const priceMatch = text.match(/(?:€\s*)?(\d{1,4})[,\.]\d{2}\s*€?/);
            if (priceMatch) {
              // Extract just the numeric part with decimal separator
              const numericMatch = priceMatch[0].match(/(\d{1,4})[,\.]\d{2}/);
              if (numericMatch) {
                const numericPrice = numericMatch[0].replace('.', ','); // Ensure comma separator
                price = `€${numericPrice}`;
                break;
              }
            }
          }
        }
      }
      
      // Method 3: Generate realistic random price if no price found
      if (!price) {
        const categoryPriceRanges = {
          'hemden': [29, 89],
          'hosen': [39, 129],
          'shirts': [19, 69],
          'jacken': [59, 299]
        };
        const range = categoryPriceRanges[category] || [25, 99];
        const randomPrice = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
        price = `€${randomPrice},99`;
      }

      // Determine category for men's clothing
      let productCategory = 'Other';
      if (url.includes('hemden') || name.toLowerCase().includes('hemd') || name.toLowerCase().includes('shirt')) {
        productCategory = 'Hemden';
      } else if (url.includes('hosen') || name.toLowerCase().includes('hose') || name.toLowerCase().includes('jean') || name.toLowerCase().includes('trouser')) {
        productCategory = 'Hosen';
      } else if (url.includes('shirts') || name.toLowerCase().includes('t-shirt') || name.toLowerCase().includes('top')) {
        productCategory = 'Shirts';
      } else if (url.includes('jacken') || name.toLowerCase().includes('jacke') || name.toLowerCase().includes('mantel') || name.toLowerCase().includes('jacket') || name.toLowerCase().includes('coat')) {
        productCategory = 'Jacken';
      }

      if (name && image && productUrl) {
        products.push({
          id: index + 1,
          name: name,
          price: price,
          image: image,
          category: productCategory,
          url: productUrl
        });
      }
    });

    console.log(`[scrapeZalando] Found ${products.length} products`);
    return products;

  } catch (error) {
    console.error('[scrapeZalando] Error:', error.message);
    return null;
  }
}

// Add Zalando products endpoint for browse page
app.get('/api/products', async (req, res) => {
  console.log('[/api/products] Starting product fetch...');
  
  try {
    const category = req.query.category || 'alle';
    console.log(`[/api/products] Fetching category: ${category}`);

    // Try to scrape real Zalando products first with regular fetch
    let products = await scrapeZalandoProducts(category);

    // If regular scraping fails, try with Puppeteer
    if (!products || products.length === 0) {
      console.log('[/api/products] Regular scraping failed, trying Puppeteer...');
      products = await scrapeZalandoWithPuppeteer(category);
    }

    // If both methods fail, use fallback products
    if (!products || products.length === 0) {
      console.log('[/api/products] All scraping methods failed, using fallback products');      const fallbackProducts = [
        {
          id: 1,
          name: "Klassisches Weißes Hemd",
          price: "€49,99",
          image: "https://via.placeholder.com/300x400/6C63FF/FFFFFF?text=Hemd",
          category: "Hemden",
          url: "https://www.zalando.de/herrenbekleidung-hemden/"
        },
        {
          id: 2,
          name: "Blaue Jeans",
          price: "€79,95",
          image: "https://via.placeholder.com/300x400/6C63FF/FFFFFF?text=Jeans",
          category: "Hosen",
          url: "https://www.zalando.de/herrenbekleidung-hosen/"
        },
        {
          id: 3,
          name: "Schwarzes T-Shirt",
          price: "€29,99",
          image: "https://via.placeholder.com/300x400/6C63FF/FFFFFF?text=T-Shirt",
          category: "Shirts",
          url: "https://www.zalando.de/herrenbekleidung-shirts/"
        },
        {
          id: 4,
          name: "Casual Hoodie",
          price: "€59,99",
          image: "https://via.placeholder.com/300x400/6C63FF/FFFFFF?text=Hoodie",
          category: "Shirts",
          url: "https://www.zalando.de/herrenbekleidung-shirts/"
        },
        {
          id: 5,
          name: "Business Blazer",
          price: "€149,95",
          image: "https://via.placeholder.com/300x400/6C63FF/FFFFFF?text=Blazer",
          category: "Jacken",
          url: "https://www.zalando.de/herrenbekleidung-jacken/"
        },
        {
          id: 6,
          name: "Chino Hose",
          price: "€69,99",
          image: "https://via.placeholder.com/300x400/6C63FF/FFFFFF?text=Chino",
          category: "Hosen",
          url: "https://www.zalando.de/herrenbekleidung-hosen/"
        },
        {
          id: 7,
          name: "Winter Jacke",
          price: "€199,95",
          image: "https://via.placeholder.com/300x400/6C63FF/FFFFFF?text=Jacke",
          category: "Jacken",
          url: "https://www.zalando.de/herrenbekleidung-jacken/"
        },
        {
          id: 8,
          name: "Poloshirt",
          price: "€39,99",
          image: "https://via.placeholder.com/300x400/6C63FF/FFFFFF?text=Polo",
          category: "Shirts",
          url: "https://www.zalando.de/herrenbekleidung-shirts/"
        },
        {
          id: 9,
          name: "Anzug Hose",
          price: "€89,95",
          image: "https://via.placeholder.com/300x400/6C63FF/FFFFFF?text=Anzug",
          category: "Hosen",
          url: "https://www.zalando.de/herrenbekleidung-hosen/"
        },
        {
          id: 10,
          name: "Leinen Hemd",
          price: "€54,99",
          image: "https://via.placeholder.com/300x400/6C63FF/FFFFFF?text=Leinen",
          category: "Hemden",
          url: "https://www.zalando.de/herrenbekleidung-hemden/"
        },
        {
          id: 11,
          name: "Denim Jacke",
          price: "€79,95",
          image: "https://via.placeholder.com/300x400/6C63FF/FFFFFF?text=Denim",
          category: "Jacken",
          url: "https://www.zalando.de/herrenbekleidung-jacken/"
        },
        {
          id: 12,
          name: "Kariertes Hemd",
          price: "€44,99",
          image: "https://via.placeholder.com/300x400/6C63FF/FFFFFF?text=Kariert",
          category: "Hemden",
          url: "https://www.zalando.de/herrenbekleidung-hemden/"
        }
      ];

      // Filter fallback products by category if specified
      if (category !== 'alle') {
        products = fallbackProducts.filter(product => 
          product.category.toLowerCase() === category.toLowerCase()
        );
      } else {
        products = fallbackProducts;
      }

      console.log(`[/api/products] Returning ${products.length} fallback products`);
      res.json({ products, source: 'fallback' });
    } else {
      console.log(`[/api/products] Returning ${products.length} real Zalando products`);
      res.json({ products, source: 'zalando' });
    }

  } catch (error) {
    console.error('[/api/products] Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Test endpoint to check if scraping works
app.get('/api/test-scrape', async (req, res) => {
  console.log('[/api/test-scrape] Testing Zalando scraping...');
  
  try {
    const url = 'https://www.zalando.de/herrenbekleidung/';
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    });
    
    console.log(`[/api/test-scrape] Response status: ${response.status}`);
    
    if (response.ok) {
      const html = await response.text();
      const productCount = (html.match(/\.html/g) || []).length;
      console.log(`[/api/test-scrape] Found ${productCount} .html links in page`);
      
      res.json({ 
        success: true, 
        status: response.status,
        productLinksFound: productCount,
        message: 'Successfully fetched Zalando men\'s page'
      });
    } else {
      res.json({ 
        success: false, 
        status: response.status,
        message: 'Failed to fetch Zalando men\'s page'
      });
    }
  } catch (error) {
    console.error('[/api/test-scrape] Error:', error.message);
    res.json({ 
      success: false, 
      error: error.message,
      message: 'Error occurred during scraping test'
    });
  }
});

(async () => {
  try {
    await fsp.mkdir(TEMP_DIR, { recursive: true }); // Ensure temp directory exists
    console.log(`TEMP_DIR created/ensured at ${TEMP_DIR}`);
    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    }); // Closes app.listen callback
  } catch (err) {
    console.error('Failed to create TEMP_DIR or start server:', err);
    process.exit(1);
  }
})(); // Calls the async IIFE
