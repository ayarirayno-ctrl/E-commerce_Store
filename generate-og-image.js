import sharp from 'sharp';
// import { createCanvas } from 'canvas'; // Not used in current implementation

async function generateOGImage() {
  const width = 1200;
  const height = 630;

  // Create SVG for the OG image
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#bgGradient)"/>
      
      <!-- Decorative circles -->
      <circle cx="100" cy="100" r="150" fill="rgba(255,255,255,0.05)"/>
      <circle cx="${width - 100}" cy="${height - 100}" r="200" fill="rgba(255,255,255,0.05)"/>
      
      <!-- Main content -->
      <g transform="translate(${width / 2}, ${height / 2 - 80})">
        <!-- Shopping cart icon -->
        <g transform="translate(-40, -60)">
          <path d="M 10 10 L 20 10 L 30 60 L 70 60" 
                stroke="white" 
                stroke-width="6" 
                fill="none" 
                stroke-linecap="round" 
                stroke-linejoin="round"/>
          <circle cx="35" cy="75" r="6" fill="white"/>
          <circle cx="65" cy="75" r="6" fill="white"/>
          <path d="M 30 30 L 75 30 L 70 60 L 30 60 Z" 
                fill="rgba(255,255,255,0.3)" 
                stroke="white" 
                stroke-width="3"/>
        </g>
      </g>
      
      <!-- Text -->
      <text x="${width / 2}" 
            y="${height / 2 + 60}" 
            font-family="Arial, sans-serif" 
            font-size="72" 
            font-weight="bold" 
            fill="white" 
            text-anchor="middle">
        E-Commerce Store
      </text>
      
      <text x="${width / 2}" 
            y="${height / 2 + 120}" 
            font-family="Arial, sans-serif" 
            font-size="36" 
            fill="rgba(255,255,255,0.9)" 
            text-anchor="middle">
        Votre Boutique en Ligne de Confiance
      </text>
      
      <!-- Features badges -->
      <g transform="translate(200, ${height - 100})">
        <rect x="0" y="0" width="240" height="60" rx="30" fill="rgba(255,255,255,0.2)"/>
        <text x="120" y="40" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle">⚡ Livraison 24-48h</text>
      </g>
      
      <g transform="translate(480, ${height - 100})">
        <rect x="0" y="0" width="220" height="60" rx="30" fill="rgba(255,255,255,0.2)"/>
        <text x="110" y="40" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle">🔒 100% Sécurisé</text>
      </g>
      
      <g transform="translate(740, ${height - 100})">
        <rect x="0" y="0" width="260" height="60" rx="30" fill="rgba(255,255,255,0.2)"/>
        <text x="130" y="40" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle">📦 +1000 Produits</text>
      </g>
    </svg>
  `;

  try {
    // Generate the OG image
    await sharp(Buffer.from(svg))
      .png()
      .toFile('public/og-image.png');

    console.log('✅ OG image generated successfully: public/og-image.png');

    // Generate a smaller version for Twitter
    await sharp(Buffer.from(svg))
      .resize(1200, 600)
      .png()
      .toFile('public/twitter-image.png');

    console.log('✅ Twitter image generated successfully: public/twitter-image.png');

  } catch (error) {
    console.error('❌ Error generating OG images:', error);
    throw error;
  }
}

generateOGImage().catch(console.error);
