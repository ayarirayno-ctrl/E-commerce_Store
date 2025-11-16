/**
 * Sitemap Generator
 * Génère dynamiquement un sitemap XML pour améliorer le SEO
 */

import { Product } from '../types';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * Génère une URL de sitemap
 */
const createUrlEntry = (url: SitemapUrl): string => {
  const { loc, lastmod, changefreq, priority } = url;
  
  return `  <url>
    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}${
    changefreq ? `\n    <changefreq>${changefreq}</changefreq>` : ''
  }${priority !== undefined ? `\n    <priority>${priority}</priority>` : ''}
  </url>`;
};

/**
 * Génère le sitemap XML complet
 */
export const generateSitemap = (products: Product[], baseUrl: string = 'https://e-commerce-store-38qrmehtb-rayens-projects-6420fa79.vercel.app'): string => {
  const urls: SitemapUrl[] = [];
  const today = new Date().toISOString().split('T')[0];

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

  return `${xmlHeader}\n${urlsetOpen}\n${urlEntries}\n${urlsetClose}`;
};

/**
 * Sauvegarde le sitemap dans le dossier public
 */
export const saveSitemap = (products: Product[]): string => {
  const sitemap = generateSitemap(products);
  return sitemap;
};

/**
 * Génère un sitemap index pour les gros sites (multi-sitemaps)
 */
export const generateSitemapIndex = (sitemapUrls: string[], baseUrl: string = 'https://e-commerce-store-38qrmehtb-rayens-projects-6420fa79.vercel.app'): string => {
  const today = new Date().toISOString().split('T')[0];
  
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const sitemapIndexOpen = '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const sitemapIndexClose = '</sitemapindex>';

  const sitemaps = sitemapUrls.map(url => `  <sitemap>
    <loc>${baseUrl}${url}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`).join('\n');

  return `${xmlHeader}\n${sitemapIndexOpen}\n${sitemaps}\n${sitemapIndexClose}`;
};

/**
 * Génère un sitemap pour les images
 */
export const generateImageSitemap = (products: Product[], baseUrl: string = 'https://e-commerce-store-38qrmehtb-rayens-projects-6420fa79.vercel.app'): string => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">';
  const urlsetClose = '</urlset>';

  const urls = products.map(product => {
    const images = product.images.map(img => `      <image:image>
        <image:loc>${img}</image:loc>
        <image:title>${product.title} - ${product.brand}</image:title>
        <image:caption>${product.description}</image:caption>
      </image:image>`).join('\n');

    return `  <url>
    <loc>${baseUrl}/products/${product.id}</loc>
${images}
  </url>`;
  }).join('\n');

  return `${xmlHeader}\n${urlsetOpen}\n${urls}\n${urlsetClose}`;
};
