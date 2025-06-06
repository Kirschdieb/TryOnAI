require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI, toFile } = require('openai');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

// Check if API Key is loaded
if (!process.env.OPENAI_API_KEY) {
  console.error('ERROR: OPENAI_API_KEY not found. Make sure it is set in your .env file.');
  process.exit(1); // Exit if API key is not found
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// API Endpoint for image generation
app.post('/api/generate-tryon-image', async (req, res) => {
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

app.post('/api/tryon', async (req, res) => {
  try {
    const userPhotoPath = path.join(__dirname, '../src/assets/userPhoto.jpg');
    const clothPhotoPath = path.join(__dirname, '../src/assets/clothPhoto.jpg');
    const { customPrompt } = req.body;

    const prompt = `Put the clothing item from the reference image onto the person in the main image. Make it photorealistic, keep pose and background unchanged. ${customPrompt || ''}`;

    // Bilder als File-Objekte für OpenAI vorbereiten
    const userPhotoFile = await toFile(fs.createReadStream(userPhotoPath), 'userPhoto.jpg', { type: 'image/jpeg' });
    const clothPhotoFile = await toFile(fs.createReadStream(clothPhotoPath), 'clothPhoto.jpg', { type: 'image/jpeg' });

    const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openaiClient.images.edit({
      model: 'gpt-image-1',
      image: [userPhotoFile, clothPhotoFile],
      prompt,
    });

    const image_base64 = response.data[0].b64_json;
    res.json({ resultImage: `data:image/png;base64,${image_base64}` });
  } catch (error) {
    console.error('Error in /api/tryon:', error.message);
    res.status(500).json({ message: 'An unexpected error occurred on the server.', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
