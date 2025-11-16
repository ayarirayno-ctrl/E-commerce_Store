import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  price?: number;
  currency?: string;
  availability?: 'in stock' | 'out of stock' | 'preorder';
  productId?: string;
}

/**
 * SEO Component
 * Manages meta tags, Open Graph, Twitter Cards, and structured data
 */
const SEO = ({
  title,
  description = 'ModernStore - Votre boutique en ligne pour les meilleurs produits électroniques',
  keywords = 'e-commerce, boutique en ligne, électronique, smartphones, ordinateurs',
  author = 'ModernStore',
  image = '/og-image.jpg',
  url = window.location.href,
  type = 'website',
  price,
  currency = 'EUR',
  availability = 'in stock',
  productId,
}: SEOProps) => {
  const appName = import.meta.env.VITE_APP_NAME || 'ModernStore';
  const fullTitle = title ? `${title} | ${appName}` : appName;
  const canonicalUrl = url.split('?')[0]; // Remove query params for canonical

  // Structured data for products
  const productSchema = productId && price ? {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: title,
    image: image,
    description: description,
    sku: productId,
    offers: {
      '@type': 'Offer',
      url: url,
      priceCurrency: currency,
      price: price,
      availability: `https://schema.org/${availability === 'in stock' ? 'InStock' : 'OutOfStock'}`,
    },
  } : null;

  // Structured data for organization
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: appName,
    url: window.location.origin,
    logo: `${window.location.origin}/logo.png`,
    sameAs: [
      // Add social media links here
    ],
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={appName} />
      <meta property="og:locale" content="fr_FR" />

      {/* Product specific OG tags */}
      {price && (
        <>
          <meta property="product:price:amount" content={price.toString()} />
          <meta property="product:price:currency" content={currency} />
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data - Product */}
      {productSchema && (
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      )}

      {/* Structured Data - Organization */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
};

export default SEO;
