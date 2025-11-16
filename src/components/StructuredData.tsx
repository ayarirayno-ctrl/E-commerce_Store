import { Helmet } from 'react-helmet-async';

interface ProductStructuredDataProps {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  brand?: string;
  category?: string;
  rating?: {
    value: number;
    count: number;
  };
  sku?: string;
  url?: string;
}

export const ProductStructuredData = ({
  name,
  description,
  image,
  price,
  currency = 'EUR',
  availability = 'InStock',
  brand = 'Modern E-Commerce Store',
  category,
  rating,
  sku,
  url = typeof window !== 'undefined' ? window.location.href : ''
}: ProductStructuredDataProps) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    brand: {
      '@type': 'Brand',
      name: brand
    },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: currency,
      price: price.toFixed(2),
      availability: `https://schema.org/${availability}`,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    ...(sku && { sku }),
    ...(category && { category }),
    ...(rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating.value,
        reviewCount: rating.count
      }
    })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbStructuredDataProps {
  items: BreadcrumbItem[];
}

export const BreadcrumbStructuredData = ({ items }: BreadcrumbStructuredDataProps) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export const OrganizationStructuredData = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Modern E-Commerce Store',
    url: 'https://yoursite.com',
    logo: 'https://yoursite.com/logo.png',
    description: 'Boutique en ligne moderne offrant une large sélection de produits de qualité avec livraison rapide et paiement sécurisé',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+33-1-23-45-67-89',
      contactType: 'Customer Service',
      availableLanguage: ['French', 'English'],
      areaServed: 'FR'
    },
    sameAs: [
      'https://www.facebook.com/yourbusiness',
      'https://www.twitter.com/yourbusiness',
      'https://www.instagram.com/yourbusiness',
      'https://www.linkedin.com/company/yourbusiness'
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export const WebsiteStructuredData = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Modern E-Commerce Store',
    url: 'https://yoursite.com',
    description: 'Boutique en ligne moderne avec paiement sécurisé et livraison rapide',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://yoursite.com/products?search={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};
