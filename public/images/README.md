# Images Directory Structure

This directory contains all source images and assets for the Yametee website.

## Directory Structure

```
images/
├── logos/          # Brand logos, favicons, and brand assets
├── hero/           # Hero section images, banners, and landing page visuals
├── icons/          # Icons, symbols, and small graphics
├── misc/           # Miscellaneous images (placeholders, temp images, etc.)
└── products/       # Product images (if storing locally instead of external URLs)
```

## Usage Guidelines

### Logos (`/images/logos/`)
- Store brand logos here (PNG, SVG preferred)
- Use transparent backgrounds when possible
- Include different sizes/variants (e.g., `logo-light.png`, `logo-dark.png`, `logo-icon.png`)

### Hero Images (`/images/hero/`)
- Landing page hero images
- Banner images
- Large promotional visuals
- Recommended formats: JPG (for photos), PNG (for graphics), WebP (for optimization)

### Icons (`/images/icons/`)
- Small icons and symbols
- SVG format preferred for scalability
- PNG fallbacks if needed

### Misc (`/images/misc/`)
- Placeholder images
- Temporary images
- Other assets that don't fit other categories

### Products (`/images/products/`)
- Product images if storing locally
- Note: Currently, product images are stored externally (via URLs in database)
- Use this folder if you want to migrate to local storage

## Best Practices

1. **File Naming**: Use descriptive, lowercase names with hyphens (e.g., `yametee-logo-dark.png`)
2. **Optimization**: Compress images before uploading to reduce load times
3. **Formats**: 
   - Logos: SVG or PNG (with transparency)
   - Photos: JPG or WebP
   - Icons: SVG preferred
4. **Sizes**: Create responsive versions when needed (e.g., `hero-desktop.jpg`, `hero-mobile.jpg`)

## Accessing Images in Code

In Next.js, reference images from the `public` folder like this:

```tsx
// Example: Using logo
<img src="/images/logos/yametee-logo.png" alt="Yametee Logo" />

// Example: Using hero image
<img src="/images/hero/landing-hero.jpg" alt="Hero" />
```

## Notes

- All paths are relative to the `public` folder
- The `public` folder is served at the root URL (`/`)
- Images in `public/images/` are accessible at `/images/...`
