/**
 * Script de génération d'icônes PWA
 * Crée les icônes 192x192 et 512x512 (standard + maskable)
 */

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const colors = {
  bg: '#3b82f6',      // Bleu brand (theme_color du manifest)
  text: '#ffffff',    // Blanc
  accent: '#1e40af'   // Bleu foncé
};

const sizes = [192, 512];

/**
 * Génère une icône standard PWA avec logo "EC"
 */
async function generateIcon(size) {
  const fontSize = size * 0.35;
  const strokeWidth = size * 0.02;
  
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <!-- Fond gradient -->
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.bg};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.accent};stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <rect width="${size}" height="${size}" fill="url(#bgGradient)" rx="${size * 0.1}"/>
      
      <!-- Texte "EC" -->
      <text 
        x="50%" 
        y="50%" 
        font-size="${fontSize}" 
        font-family="Arial, sans-serif" 
        font-weight="bold" 
        fill="${colors.text}" 
        text-anchor="middle" 
        dominant-baseline="middle"
        stroke="${colors.accent}"
        stroke-width="${strokeWidth}"
        paint-order="stroke"
      >EC</text>
      
      <!-- Petit badge shopping cart (optionnel) -->
      <circle cx="${size * 0.75}" cy="${size * 0.25}" r="${size * 0.12}" fill="${colors.text}"/>
      <text 
        x="${size * 0.75}" 
        y="${size * 0.27}" 
        font-size="${size * 0.12}" 
        fill="${colors.bg}" 
        text-anchor="middle" 
        dominant-baseline="middle"
      >🛒</text>
    </svg>
  `;
  
  const outputPath = join(__dirname, 'public', `pwa-icon-${size}.png`);
  
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(outputPath);
  
  console.log(`✅ Generated pwa-icon-${size}.png`);
}

/**
 * Génère une icône maskable (avec padding pour Android)
 */
async function generateMaskableIcon(size) {
  const padding = size * 0.15; // 15% padding (safe zone Android)
  const innerSize = size - (padding * 2);
  const fontSize = innerSize * 0.4;
  const strokeWidth = size * 0.015;
  
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <!-- Fond solid pour maskable -->
      <rect width="${size}" height="${size}" fill="${colors.bg}"/>
      
      <!-- Zone safe (80% du centre) -->
      <text 
        x="50%" 
        y="50%" 
        font-size="${fontSize}" 
        font-family="Arial, sans-serif" 
        font-weight="bold" 
        fill="${colors.text}" 
        text-anchor="middle" 
        dominant-baseline="middle"
        stroke="${colors.accent}"
        stroke-width="${strokeWidth}"
        paint-order="stroke"
      >EC</text>
    </svg>
  `;
  
  const outputPath = join(__dirname, 'public', `pwa-icon-maskable-${size}.png`);
  
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(outputPath);
  
  console.log(`✅ Generated pwa-icon-maskable-${size}.png`);
}

/**
 * Génère les screenshots pour le manifest
 */
async function generateScreenshots() {
  // Screenshot mobile (540x720)
  const mobileSvg = `
    <svg width="540" height="720" xmlns="http://www.w3.org/2000/svg">
      <rect width="540" height="720" fill="#f3f4f6"/>
      <text x="270" y="100" font-size="32" font-family="Arial" font-weight="bold" fill="#1f2937" text-anchor="middle">E-Commerce Store</text>
      <text x="270" y="150" font-size="18" fill="#6b7280" text-anchor="middle">Modern Shopping Experience</text>
      
      <!-- Simuler des produits -->
      <rect x="20" y="200" width="500" height="140" fill="#ffffff" rx="8"/>
      <rect x="40" y="220" width="100" height="100" fill="${colors.bg}" rx="4"/>
      <text x="160" y="250" font-size="20" font-weight="bold" fill="#1f2937">Product Name</text>
      <text x="160" y="280" font-size="16" fill="#6b7280">$99.99</text>
      
      <rect x="20" y="360" width="500" height="140" fill="#ffffff" rx="8"/>
      <rect x="40" y="380" width="100" height="100" fill="${colors.bg}" rx="4"/>
      <text x="160" y="410" font-size="20" font-weight="bold" fill="#1f2937">Product Name</text>
      <text x="160" y="440" font-size="16" fill="#6b7280">$79.99</text>
      
      <text x="270" y="650" font-size="14" fill="#9ca3af" text-anchor="middle">Mobile View Screenshot</text>
    </svg>
  `;
  
  await sharp(Buffer.from(mobileSvg))
    .resize(540, 720)
    .png({ quality: 90 })
    .toFile(join(__dirname, 'public', 'screenshot-mobile.png'));
  
  console.log('✅ Generated screenshot-mobile.png');
  
  // Screenshot desktop (1280x720)
  const desktopSvg = `
    <svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
      <rect width="1280" height="720" fill="#f3f4f6"/>
      
      <!-- Header -->
      <rect width="1280" height="80" fill="${colors.bg}"/>
      <text x="40" y="50" font-size="28" font-family="Arial" font-weight="bold" fill="#ffffff">E-Commerce Store</text>
      
      <!-- Content area -->
      <text x="640" y="150" font-size="36" font-family="Arial" font-weight="bold" fill="#1f2937" text-anchor="middle">Featured Products</text>
      
      <!-- Product grid (3 columns) -->
      <rect x="60" y="220" width="340" height="380" fill="#ffffff" rx="8"/>
      <rect x="470" y="220" width="340" height="380" fill="#ffffff" rx="8"/>
      <rect x="880" y="220" width="340" height="380" fill="#ffffff" rx="8"/>
      
      <rect x="90" y="250" width="280" height="200" fill="${colors.bg}" rx="4"/>
      <rect x="500" y="250" width="280" height="200" fill="${colors.bg}" rx="4"/>
      <rect x="910" y="250" width="280" height="200" fill="${colors.bg}" rx="4"/>
      
      <text x="230" y="490" font-size="22" font-weight="bold" fill="#1f2937" text-anchor="middle">Product 1</text>
      <text x="640" y="490" font-size="22" font-weight="bold" fill="#1f2937" text-anchor="middle">Product 2</text>
      <text x="1050" y="490" font-size="22" font-weight="bold" fill="#1f2937" text-anchor="middle">Product 3</text>
      
      <text x="230" y="530" font-size="20" fill="${colors.bg}" text-anchor="middle">$99.99</text>
      <text x="640" y="530" font-size="20" fill="${colors.bg}" text-anchor="middle">$79.99</text>
      <text x="1050" y="530" font-size="20" fill="${colors.bg}" text-anchor="middle">$89.99</text>
      
      <text x="640" y="680" font-size="14" fill="#9ca3af" text-anchor="middle">Desktop View Screenshot</text>
    </svg>
  `;
  
  await sharp(Buffer.from(desktopSvg))
    .resize(1280, 720)
    .png({ quality: 90 })
    .toFile(join(__dirname, 'public', 'screenshot-desktop.png'));
  
  console.log('✅ Generated screenshot-desktop.png');
}

/**
 * Main function
 */
async function generateAll() {
  console.log('\n🎨 Generating PWA icons and screenshots...\n');
  
  try {
    // Generate standard icons
    for (const size of sizes) {
      await generateIcon(size);
    }
    
    console.log('');
    
    // Generate maskable icons
    for (const size of sizes) {
      await generateMaskableIcon(size);
    }
    
    console.log('');
    
    // Generate screenshots
    await generateScreenshots();
    
    console.log('\n✅ All PWA assets generated successfully!');
    console.log('\n📱 Your app is now ready for installation!');
    console.log('\nNext steps:');
    console.log('1. Start dev server: npm run dev');
    console.log('2. Open http://localhost:3004 in Chrome');
    console.log('3. DevTools → Application → Manifest (verify)');
    console.log('4. DevTools → Application → Service Workers (should be activated)');
    console.log('5. Click install icon in address bar (⊕)');
    console.log('\n');
  } catch (error) {
    console.error('❌ Error generating assets:', error);
    process.exit(1);
  }
}

generateAll();
