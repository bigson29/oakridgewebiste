# Assets Guide

This folder should contain all media files for your website.

## Directory Structure

```
assets/
├── logo.png              # Server logo (40x40px, square)
├── banner.png            # Hero banner image (1200x300px)
├── favicon.ico           # Website favicon
├── images/
│   ├── feature1.png
│   ├── feature2.png
│   └── ...
├── videos/
│   └── intro.mp4         # Optional intro video
└── downloads/
    ├── launcher.exe      # Client launcher (if applicable)
    └── ...
```

## Image Specifications

### Logo (assets/logo.png)
- **Size:** 40x40 pixels
- **Format:** PNG with transparency
- **Best for:** Square, centered design
- **Usage:** Navbar brand logo

### Banner (assets/banner.png)
- **Size:** 1200x300 pixels (4:1 ratio)
- **Format:** PNG or JPG
- **Best for:** High-quality gameplay screenshot or artwork
- **Usage:** Hero section background

### Favicon (assets/favicon.ico)
- **Size:** 32x32 or 64x64 pixels
- **Format:** ICO or PNG
- **Usage:** Browser tab icon
- **Add to HTML:**
  ```html
  <link rel="icon" type="image/png" href="assets/favicon.ico">
  ```

## Recommended Tools

### Image Compression
- **TinyPNG:** https://tinypng.com (Recommended)
- **ImageOptim:** https://imageoptim.com (Mac)
- **PNGCrush:** Online PNG compressor
- **JPEGMini:** https://www.jpegmini.com

### Image Creation
- **Canva:** https://canva.com (Easy templates)
- **Photoshop/GIMP:** Professional editing
- **Figma:** https://figma.com (Design tool)
- **Pixlr:** https://pixlr.com (Online editor)

### Video Optimization
- **HandBrake:** https://handbrake.fr (Video converter)
- **FFmpeg:** https://ffmpeg.org (Advanced)

## Image Quality Tips

1. **Compression:** Always compress images before uploading
2. **Format:**
   - PNG for logo and transparent images
   - JPG for photos and banners
   - WebP for modern browsers (fallback to JPG)
3. **Size:** Aim for files under 100KB each
4. **Resolution:** Use 2x resolution for retina displays

## Creating Assets from Scratch

### Logo
1. Open Canva or Figma
2. Create 40x40px square
3. Add your server initial or icon
4. Export as PNG with transparency
5. Save as `assets/logo.png`

### Banner
1. Take a screenshot from GTA5 with FiveM
2. Crop to 1200x300 pixels
3. Add text overlay with your server name (optional)
4. Compress with TinyPNG
5. Save as `assets/banner.png`

## Using SVG for Logo (Advanced)

For a crisp logo at any size, use SVG:

```html
<!-- In index.html -->
<svg class="logo" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="19" fill="none" stroke="#00d4ff" stroke-width="2"/>
    <text x="20" y="27" text-anchor="middle" fill="#00d4ff" font-size="20" font-weight="bold">
        OR
    </text>
</svg>
```

## Free Stock Images

- **Unsplash:** https://unsplash.com
- **Pexels:** https://pexels.com
- **Pixabay:** https://pixabay.com
- **Free Game Assets:** https://kenney.nl

## Adding New Assets

1. Create new folder if needed: `assets/images/`
2. Compress image with TinyPNG
3. Add to HTML with relative path: `src="assets/images/my-image.png"`
4. Test in browser
5. Commit to git

## Troubleshooting Images

**Image not showing:**
- Check file path is correct
- Verify file exists in assets folder
- Check file permissions
- Clear browser cache
- Try different format (PNG instead of JPG)

**Image quality poor:**
- Re-export at higher resolution
- Use original uncompressed file
- Check image compression settings

**File size too large:**
- Compress with TinyPNG or similar
- Reduce resolution
- Convert JPG to WebP format
- Remove unnecessary metadata

## Version Control

Large files can slow down git. Consider:
- Using Git LFS (Large File Storage)
- Keeping high-res originals in separate folder
- Only committing compressed versions

```bash
# Install Git LFS
git lfs install

# Track large files
git lfs track "*.psd"
git lfs track "*.mov"
```

---

**Ready to add your assets? Start with the logo and banner!** 🎨
