import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  price?: string;
  currency?: string;
  availability?: 'in stock' | 'out of stock' | 'preorder';
  category?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export const SEOHead = ({
  title = 'Modern E-Commerce Store - Boutique en Ligne',
  description = 'Découvrez notre boutique en ligne moderne avec les derniers produits, livraison rapide et paiement sécurisé. Profitez d\'une expérience d\'achat exceptionnelle.',
  keywords = 'e-commerce, boutique en ligne, shopping, produits, livraison rapide, paiement sécurisé',
  image = '/og-image.png',
  url = typeof window !== 'undefined' ? window.location.href : 'https://yoursite.com',
  type = 'website',
  price,
  currency = 'EUR',
  availability,
  category,
  author = 'Modern E-Commerce Store',
  publishedTime,
  modifiedTime
}: SEOHeadProps) => {
  const siteName = 'Modern E-Commerce Store';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="fr_FR" />

      {/* Product specific OG tags */}
      {type === 'product' && price && (
        <>
          <meta property="og:price:amount" content={price} />
          <meta property="og:price:currency" content={currency} />
          {availability && <meta property="og:availability" content={availability} />}
        </>
      )}

      {/* Article specific OG tags */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@ecommerce" />
      <meta name="twitter:site" content="@ecommerce" />

      {/* Additional SEO tags */}
      <meta name="language" content="French" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      {category && <meta name="category" content={category} />}

      {/* Structured Data will be added via separate component */}
    </Helmet>
  );
};
