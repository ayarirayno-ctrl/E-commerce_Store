/**
 * SEO Utilities
 * Helper functions for generating SEO metadata
 */

interface MetaTag {
  name?: string;
  property?: string;
  content: string;
}

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  published?: string;
  modified?: string;
}

/**
 * Generate Open Graph meta tags for social media sharing
 */
export const generateOGTags = (config: SEOConfig): MetaTag[] => {
  const baseUrl = import.meta.env.VITE_APP_URL || 'https://ecommerce-family.com';
  const defaultImage = `${baseUrl}/og-image.jpg`;

  return [
    { property: 'og:type', content: config.type || 'website' },
    { property: 'og:title', content: config.title },
    { property: 'og:description', content: config.description },
    { property: 'og:image', content: config.image || defaultImage },
    { property: 'og:url', content: config.url || baseUrl },
    { property: 'og:site_name', content: 'E-commerce Family\'s' },
    { property: 'og:locale', content: 'fr_FR' },
  ];
};

/**
 * Generate Twitter Card meta tags
 */
export const generateTwitterTags = (config: SEOConfig): MetaTag[] => {
  const baseUrl = import.meta.env.VITE_APP_URL || 'https://ecommerce-family.com';
  const defaultImage = `${baseUrl}/twitter-card.jpg`;

  return [
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: config.title },
    { name: 'twitter:description', content: config.description },
    { name: 'twitter:image', content: config.image || defaultImage },
    { name: 'twitter:site', content: '@ecommercefamily' },
    { name: 'twitter:creator', content: '@ecommercefamily' },
  ];
};

/**
 * Generate product structured data (Schema.org)
 */
export const generateProductSchema = (product: {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  brand?: string;
  rating?: number;
  ratingCount?: number;
  availability?: string;
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.image,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'E-commerce Family\'s',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'EUR',
      availability: product.availability || 'https://schema.org/InStock',
      url: `${import.meta.env.VITE_APP_URL}/products/${product.id}`,
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.ratingCount || 0,
      },
    }),
  };
};

/**
 * Generate breadcrumb structured data
 */
export const generateBreadcrumbSchema = (breadcrumbs: { name: string; url: string }[]) => {
  const baseUrl = import.meta.env.VITE_APP_URL || 'https://ecommerce-family.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${baseUrl}${crumb.url}`,
    })),
  };
};

/**
 * Generate organization structured data
 */
export const generateOrganizationSchema = () => {
  const baseUrl = import.meta.env.VITE_APP_URL || 'https://ecommerce-family.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'E-commerce Family\'s',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'Your all-in-one online shopping destination for quality products',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+216-XX-XXX-XXX',
      contactType: 'Customer Service',
      email: 'support@ecommerce-family.com',
      availableLanguage: ['French', 'English'],
    },
    sameAs: [
      'https://facebook.com/ecommercefamily',
      'https://twitter.com/ecommercefamily',
      'https://instagram.com/ecommercefamily',
    ],
  };
};

/**
 * Generate WebSite structured data with search action
 */
export const generateWebSiteSchema = () => {
  const baseUrl = import.meta.env.VITE_APP_URL || 'https://ecommerce-family.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'E-commerce Family\'s',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/products?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
};

/**
 * Generate review structured data
 */
export const generateReviewSchema = (review: {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
  productName: string;
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: review.author,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
    },
    reviewBody: review.reviewBody,
    datePublished: review.datePublished,
    itemReviewed: {
      '@type': 'Product',
      name: review.productName,
    },
  };
};

/**
 * Generate FAQ structured data
 */
export const generateFAQSchema = (faqs: { question: string; answer: string }[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
};

/**
 * Sanitize and truncate text for meta descriptions
 */
export const sanitizeMetaDescription = (text: string, maxLength = 160): string => {
  const sanitized = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  return sanitized.length > maxLength
    ? `${sanitized.substring(0, maxLength - 3)}...`
    : sanitized;
};

/**
 * Generate keywords from text
 */
export const generateKeywords = (text: string, maxKeywords = 10): string => {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 3);

  const frequency: Record<string, number> = {};
  words.forEach((word) => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word)
    .join(', ');
};
