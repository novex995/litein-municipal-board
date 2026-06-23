# How to Add Slider Images

## Option 1: Use Free Stock Photos

### Recommended Free Stock Photo Sites:

1. **Unsplash** (https://unsplash.com)
   - Search terms: "municipality", "government building", "city services", "digital services"
   - Download in Large or Full size
   - License: Free to use

2. **Pexels** (https://pexels.com)
   - Search terms: "town hall", "city administration", "business investment", "community"
   - Download in Original size
   - License: Free to use

3. **Pixabay** (https://pixabay.com)
   - Search terms: "government", "urban development", "citizen services", "community engagement"
   - Download in 1920x1080 resolution
   - License: Free to use

### Suggested Images:

**Slide 1 - Welcome**
- Search: "modern city hall" or "government building"
- Example: Buildings with flags, municipal architecture
- Download as: slide1.jpg

**Slide 2 - Digital Services**
- Search: "digital services" or "person using tablet"
- Example: People using technology, service counters
- Download as: slide2.jpg

**Slide 3 - Investment**
- Search: "business meeting" or "urban development"
- Example: Handshakes, modern buildings, construction
- Download as: slide3.jpg

**Slide 4 - Community**
- Search: "community meeting" or "customer service"
- Example: People interacting, help desk, community gathering
- Download as: slide4.jpg

## Option 2: Use Your Own Photos

Take high-quality photos of:
1. Litein Municipal Building
2. Citizens receiving services
3. Local businesses or development projects
4. Community engagement activities

## Steps to Add Images:

1. Download or take photos
2. Resize to 1920x1080px (use free tools like:
   - https://www.iloveimg.com/resize-image
   - https://www.resizepixel.com
   - Or Windows Photos app)
3. Optimize file size to under 500KB (use:
   - https://tinypng.com
   - https://compressor.io)
4. Rename files as: slide1.jpg, slide2.jpg, slide3.jpg, slide4.jpg
5. Copy files to this folder:
   `C:\Users\HP\Documents\Litein municipal\litein-municipality\frontend\public\slider\`

## Quick Copy Command (after downloading):

Open Command Prompt in your Downloads folder and run:
```cmd
copy slide1.jpg "C:\Users\HP\Documents\Litein municipal\litein-municipality\frontend\public\slider\"
copy slide2.jpg "C:\Users\HP\Documents\Litein municipal\litein-municipality\frontend\public\slider\"
copy slide3.jpg "C:\Users\HP\Documents\Litein municipal\litein-municipality\frontend\public\slider\"
copy slide4.jpg "C:\Users\HP\Documents\Litein municipal\litein-municipality\frontend\public\slider\"
```

## Current Status

The slider currently uses `/hero-image.png` with different colored gradient overlays:
- ✅ Slide 1: Green gradient
- ✅ Slide 2: Blue gradient  
- ✅ Slide 3: Orange gradient
- ✅ Slide 4: Purple gradient

This provides visual variety until you add the specific images!

## After Adding Images

Update the HeroSlider.jsx file to use the new images by changing:
```javascript
image: '/hero-image.png'
```
to:
```javascript
image: '/slider/slide1.jpg'  // (or slide2.jpg, slide3.jpg, slide4.jpg)
```

The slider will automatically use your new images!
