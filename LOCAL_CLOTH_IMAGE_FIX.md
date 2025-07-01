# Local Cloth Image Upload Fix

## Problem
Local cloth image uploads were failing with error:
- Client: `400 Bad Request` 
- Server: `clothImageUrl must be a valid HTTP/S URL string`

## Root Cause
The server validation was only accepting HTTP/HTTPS URLs but rejecting base64 data URLs that are generated when users upload local cloth images.

## Solution Applied

### Server Changes (server/index.js)

**Updated Validation Logic:**
```javascript
// OLD - only HTTP/S URLs accepted
if (!clothImageUrl || typeof clothImageUrl !== 'string' || !clothImageUrl.startsWith('http')) {
  return res.status(400).json({ message: 'clothImageUrl must be a valid HTTP/S URL string.' });
}

// NEW - both HTTP/S URLs and base64 data URLs accepted
if (!clothImageUrl || typeof clothImageUrl !== 'string' || 
    (!clothImageUrl.startsWith('http') && !clothImageUrl.startsWith('data:'))) {
  return res.status(400).json({ message: 'clothImageUrl must be a valid HTTP/S URL string or base64 data URL.' });
}
```

**Added Base64 Handling:**
```javascript
if (clothImageUrl.startsWith('data:')) {
  // Handle base64 data URL
  console.log('[/api/tryon] Processing base64 cloth image');
  const base64Data = clothImageUrl.split(',')[1];
  const mimeType = clothImageUrl.split(';')[0].split(':')[1];
  const extension = mimeType === 'image/jpeg' ? '.jpg' : 
                   mimeType === 'image/png' ? '.png' : 
                   mimeType === 'image/webp' ? '.webp' : '.jpg';
  
  const uniqueFilename = `cloth-image-${uuidv4()}${extension}`;
  clothPhotoDownloadedPath = path.join(TEMP_DIR, uniqueFilename);
  
  const buffer = Buffer.from(base64Data, 'base64');
  await fsp.writeFile(clothPhotoDownloadedPath, buffer);
  console.log(`[/api/tryon] Base64 cloth image saved to: ${clothPhotoDownloadedPath}`);
} else {
  // Handle HTTP/HTTPS URL - download it
  console.log('[/api/tryon] Downloading cloth image from URL');
  clothPhotoDownloadedPath = await downloadImageAsTempFile(clothImageUrl, 'cloth-image');
}
```

### Client Changes (TryOnStudio.jsx)

**Added Debug Logging:**
```javascript
console.log('[TryOnStudio] clothPhoto:', typeof clothPhoto, clothPhoto?.substring(0, 50) + '...');
console.log('[TryOnStudio] extractedClothImage:', typeof extractedClothImage, extractedClothImage?.substring(0, 50) + '...');
console.log('[TryOnStudio] clothImageSource:', typeof clothImageSource, clothImageSource?.substring(0, 50) + '...');
```

## Data Flow for Local Cloth Images

1. **HomeUpload.jsx**: User selects local image file
2. **File conversion**: `convertFileToBase64()` converts File to base64 data URL
3. **State storage**: Base64 stored in `localClothPhotoUrl` and passed to store
4. **TryOnStudio.jsx**: Receives base64 cloth photo
5. **extractClothImage()**: Since it's not a Zalando URL, sets `extractedClothImage = clothPhoto` (base64)
6. **generateTryOn()**: Sends base64 as `clothImageUrl` in FormData
7. **Server**: Now accepts and processes base64 data URLs

## Expected Behavior

- **Extracted images (Zalando URLs)**: Continue to work as before (download from URL)
- **Local uploads**: Base64 data URLs are now properly handled (saved as temporary files)
- **Both types**: Should work seamlessly for try-on generation

## Testing

1. Upload local cloth image in HomeUpload
2. Navigate to TryOnStudio
3. Click "Generate Try-On"
4. Should process without 400 error

The server should now log:
```
[/api/tryon] Processing base64 cloth image
[/api/tryon] Base64 cloth image saved to: /path/to/temp/cloth-image-uuid.jpg
```
