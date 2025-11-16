/**
 * Script de génération du sitemap.xml
 * À exécuter avant chaque build pour mettre à jour le sitemap
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import des produits
const productsPath = path.join(__dirname, '../src/data/products.json');
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
const products = productsData.products; // Extraction du tableau products

const baseUrl = 'https://e-commerce-store-38qrmehtb-rayens-projects-6420fa79.vercel.app';
const today = new Date().toISOString().split('T')[0];

// Fonction pour créer une entrée URL
const createUrlEntry = (url) => {
  const { loc, lastmod, changefreq, priority } = url;
  
  return `  <url>
    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}${
    changefreq ? `\n    <changefreq>${changefreq}</changefreq>` : ''
  }${priority !== undefined ? `\n    <priority>${priority}</priority>` : ''}
  </url>`;
};

// Génération des URLs
const urls = [];

// Page d'accueil
urls.push({
  loc: baseUrl,
  lastmod: today,
  changefreq: 'daily',
  priority: 1.0,
});

// Pages principales
const mainPages = [
  { path: '/products', priority: 0.9 },
  { path: '/categories', priority: 0.8 },
  { path: '/about', priority: 0.5 },
  { path: '/contact', priority: 0.5 },
  { path: '/login', priority: 0.4 },
  { path: '/register', priority: 0.4 },
];

mainPages.forEach(page => {
  urls.push({
    loc: `${baseUrl}${page.path}`,
    lastmod: today,
    changefreq: 'weekly',
    priority: page.priority,
  });
});

// Pages de produits
products.forEach(product => {
  urls.push({
    loc: `${baseUrl}/products/${product.id}`,
    lastmod: today,
    changefreq: 'weekly',
    priority: 0.7,
  });
});

// Pages de catégories (uniques)
const categories = [...new Set(products.map(p => p.category))];
categories.forEach(category => {
  urls.push({
    loc: `${baseUrl}/products?category=${encodeURIComponent(category)}`,
    lastmod: today,
    changefreq: 'weekly',
    priority: 0.6,
  });
});

// Génération du XML
const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
const urlsetClose = '</urlset>';

const urlEntries = urls.map(createUrlEntry).join('\n');
const sitemap = `${xmlHeader}\n${urlsetOpen}\n${urlEntries}\n${urlsetClose}`;

// Sauvegarde du fichier
const outputPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outputPath, sitemap, 'utf-8');

console.log('✅ Sitemap généré avec succès !');
console.log(`📄 ${urls.length} URLs ajoutées`);
console.log(`📍 Emplacement: ${outputPath}`);
console.log(`🔗 URL: ${baseUrl}/sitemap.xml`);
