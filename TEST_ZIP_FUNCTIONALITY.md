# 🧪 ZIP Export/Import Testing Guide

## Quick Test Checklist

### Prerequisites
- [ ] App is running (`npm run dev`)
- [ ] JSZip and file-saver are installed
- [ ] Profile page loads without errors

### Test 1: Basic Export
1. [ ] Go to Profile page
2. [ ] Create or login to a profile
3. [ ] Click "📦 Export as ZIP"
4. [ ] Verify ZIP file downloads
5. [ ] Open ZIP file and check it contains:
   - [ ] `profile.json` file
   - [ ] `images/` folder (even if empty)

### Test 2: Export with Generated Images
1. [ ] Go to TryOn Studio
2. [ ] Upload user photo and clothing item
3. [ ] Generate try-on images
4. [ ] Save generated images to albums
5. [ ] Return to Profile page
6. [ ] Click "📦 Export as ZIP"
7. [ ] Verify ZIP contains images in `images/` folder

### Test 3: Import Functionality
1. [ ] Clear browser data OR use incognito/different browser
2. [ ] Go to TryOnAI app (should show login modal)
3. [ ] Click "📦 Import from ZIP Backup"
4. [ ] Select the ZIP file from Test 2
5. [ ] Verify success message appears
6. [ ] Check that profile information is restored
7. [ ] Check that all albums are restored
8. [ ] Check that all images are restored and viewable

### Test 4: Cross-Device/Browser
1. [ ] Export ZIP on Chrome
2. [ ] Import ZIP on Firefox/Edge/Safari
3. [ ] Verify everything works identically

### Test 5: Error Handling
1. [ ] Try importing a non-ZIP file
2. [ ] Try importing a corrupted ZIP
3. [ ] Verify appropriate error messages appear

## Expected Results

✅ **Success Indicators:**
- ZIP files download with meaningful names
- All profile data is preserved
- All images are preserved and viewable
- Cross-browser compatibility works
- Clear success/error messages

❌ **Failure Indicators:**
- ZIP files don't download
- Images missing after import
- Console errors during export/import
- Profile data not restored correctly

## Troubleshooting

### Common Issues:
1. **"JSZip is not defined"** → Check that dependencies are installed
2. **"Images not showing after import"** → Check browser console for base64 errors
3. **"Large ZIP files fail"** → Check browser memory limits for large image collections

### Debug Tips:
- Open browser console (F12) during export/import
- Check localStorage contents before/after import
- Verify sessionStorage contains restored images
- Check network tab for any failed downloads

---

## Quick Manual Test (5 minutes)

1. **Setup**: Create profile, add 1-2 test images
2. **Export**: Click ZIP export, verify download
3. **Reset**: Clear browser data  
4. **Import**: Import the ZIP file
5. **Verify**: Check that everything is restored

If all steps work, the implementation is successful! 🎉
