import React from 'react';
import { Helmet } from 'react-helmet-async';
import { generateOGTags, generateTwitterTags } from '../../utils/seoUtils';

interface EnhancedSEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  published?: string;
  modified?: string;
  noindex?: boolean;
  nofollow?: boolean;
  canonical?: string;
  structuredData?: object | object[];
}

/**
 * Enhanced SEO Component
 * Provides comprehensive SEO meta tags including Open Graph and Twitter Cards
 */
const EnhancedSEO: React.FC<EnhancedSEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author,
  published,
  modified,
  noindex = false,
  nofollow = false,
  canonical,
  structuredData,
}) => {
  const siteName = 'E-commerce Family\'s';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const baseUrl = import.meta.env.VITE_APP_URL || 'https://ecommerce-family.com';
  const canonicalUrl = canonical || url || baseUrl;

  // Generate Open Graph and Twitter tags
  const ogTags = generateOGTags({ title: fullTitle, description, image, url: canonicalUrl, type });
  const twitterTags = generateTwitterTags({ title: fullTitle, description, image });

  // Robots meta tag
  const robotsContent = [];
  if (noindex) robotsContent.push('noindex');
  if (nofollow) robotsContent.push('nofollow');
  const robots = robotsContent.length > 0 ? robotsContent.join(', ') : 'index, follow';

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      
      {/* Robots */}
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph Tags */}
      {ogTags.map((tag, index) => (
        <meta key={`og-${index}`} property={tag.property} content={tag.content} />
      ))}
      
      {/* Twitter Card Tags */}
      {twitterTags.map((tag, index) => (
        <meta key={`twitter-${index}`} name={tag.name} content={tag.content} />
      ))}
      
      {/* Article Meta Tags */}
      {type === 'article' && (
        <>
          {published && <meta property="article:published_time" content={published} />}
          {modified && <meta property="article:modified_time" content={modified} />}
          {author && <meta property="article:author" content={author} />}
        </>
      )}
      
      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(
            Array.isArray(structuredData) 
              ? structuredData 
              : structuredData
          )}
        </script>
      )}
      
      {/* Additional SEO Tags */}
      <meta name="theme-color" content="#2563EB" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="format-detection" content="telephone=no" />
    </Helmet>
  );
};

export default EnhancedSEO;
