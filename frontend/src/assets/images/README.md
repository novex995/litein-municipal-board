# Logo Images

## Instructions to Add the Official Logos

The application is configured to use the official Kenya and Kericho County logos.

### Steps:

1. **Save the logo image** showing both:
   - Republic of Kenya Coat of Arms (left - with lions, shield, and "HARAMBEE")
   - Kericho County Coat of Arms (right - with cow, camel, tea leaf, and "PROSPERITY" & "ULUM")

2. **Save it to this folder** with the filename:
   ```
   kenya-kericho-logos.png
   ```

3. **Full path should be**:
   ```
   c:\Users\HP\Documents\Litein municipal\litein-municipality\frontend\src\assets\images\kenya-kericho-logos.png
   ```

4. The layout is already configured to use this image automatically.

### Image Requirements:
- **Filename**: `kenya-kericho-logos.png` (exactly as shown)
- **Format**: PNG with transparent or white background
- **Recommended height**: 150-200px (will be scaled automatically)
- **Content**: Both coat of arms side by side as shown in the official image

### Alternative: Use Separate Images

If you prefer to use separate images:

1. Save two files:
   - `kenya-coat-of-arms.png` (Republic of Kenya)
   - `kericho-county-logo.png` (Kericho County)

2. Update `PublicLayout.jsx` to use both images separately

---

**Note**: The placeholder SVG file (`logos-combined.svg`) can be deleted once you add the actual PNG logo.
