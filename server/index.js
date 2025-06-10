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
const upload = multer({ storage: storage });

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
  console.log('req.body (customPrompt, clothImageUrl):', req.body);
  const { customPrompt, clothImageUrl } = req.body; // clothImageUrl is a string (URL)
  let userPhotoUploadedPath = null;
  let clothPhotoDownloadedPath = null;

  if (!req.file) {
    return res.status(400).json({ message: 'userPhoto file is required.' });
  }
  userPhotoUploadedPath = req.file.path; // Path to the uploaded user photo by multer

  if (!clothImageUrl || typeof clothImageUrl !== 'string' || !clothImageUrl.startsWith('http')) {
     // For now, we expect clothImageUrl to be an HTTP/S URL from Zalando extraction or direct input
    if (userPhotoUploadedPath) await fsp.unlink(userPhotoUploadedPath).catch(err => console.error('Failed to delete temp user photo on cloth error:', err));
    return res.status(400).json({ message: 'clothImageUrl must be a valid HTTP/S URL string.' });
  }

  try {
    // clothImageUrl is a URL, so we need to download it.
    clothPhotoDownloadedPath = await downloadImageAsTempFile(clothImageUrl, 'cloth-image');

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
    const response = await openaiClient.images.edit({
      model: 'gpt-image-1', // As per user, this model works
      image: [userPhotoFile, clothPhotoFile], // As per user, this structure works
      prompt: promptText,
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
