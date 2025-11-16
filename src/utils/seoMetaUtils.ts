/**
 * SEO Meta Description Generator
 * Génère des meta descriptions optimisées pour le SEO
 */

import { Product } from '../types';

/**
 * Génère une meta description pour un produit
 * Format: [Produit] - [Prix] | [Marque] | [Caractéristiques] | Livraison gratuite | E-commerce Family's
 */
export const generateProductMetaDescription = (product: Product): string => {
  const parts: string[] = [];
  
  // Ajouter le titre du produit
  parts.push(product.title);
  
  // Ajouter le prix
  const price = product.discountPercentage > 0
    ? `à partir de ${(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}€`
    : `${product.price}€`;
  parts.push(price);
  
  // Ajouter la marque
  if (product.brand) {
    parts.push(`Marque ${product.brand}`);
  }
  
  // Ajouter les variantes si disponibles
  if (product.availableColors && product.availableColors.length > 0) {
    parts.push(`${product.availableColors.length} couleurs`);
  }
  if (product.availableSizes && product.availableSizes.length > 0) {
    parts.push(`${product.availableSizes.length} tailles`);
  }
  
  // Ajouter la note
  if (product.rating >= 4) {
    parts.push(`⭐ ${product.rating}/5`);
  }
  
  // Ajouter la disponibilité
  if (product.stock > 0) {
    parts.push('En stock');
  }
  
  // Construire la description (max 160 caractères recommandé)
  let description = parts.join(' | ');
  
  // Ajouter le call-to-action
  description += ' | Livraison rapide | Paiement sécurisé | E-commerce Family\'s';
  
  // Limiter à 160 caractères pour l'affichage optimal dans Google
  if (description.length > 160) {
    description = description.substring(0, 157) + '...';
  }
  
  return description;
};

/**
 * Génère une meta description pour une catégorie
 */
export const generateCategoryMetaDescription = (
  category: string,
  productCount: number,
  brands?: string[]
): string => {
  const parts: string[] = [];
  
  // Catégorie
  parts.push(`Découvrez notre sélection de ${category}`);
  
  // Nombre de produits
  parts.push(`${productCount} produits`);
  
  // Marques
  if (brands && brands.length > 0) {
    const topBrands = brands.slice(0, 3).join(', ');
    parts.push(`Marques: ${topBrands}`);
  }
  
  // Avantages
  parts.push('Prix compétitifs | Livraison gratuite | Garantie qualité');
  
  return parts.join(' | ');
};

/**
 * Génère une meta description pour la page d'accueil
 */
export const generateHomeMetaDescription = (): string => {
  return 'E-commerce Family\'s - Votre boutique en ligne de confiance. ' +
    'Smartphones, laptops, électronique, mode et plus encore. ' +
    'Livraison rapide, paiement sécurisé, garantie satisfait ou remboursé.';
};

/**
 * Génère des keywords SEO pour un produit
 */
export const generateProductKeywords = (product: Product): string => {
  const keywords: string[] = [];
  
  // Titre et catégorie
  keywords.push(product.title.toLowerCase());
  keywords.push(product.category);
  
  // Marque
  if (product.brand) {
    keywords.push(product.brand.toLowerCase());
  }
  
  // Variantes
  if (product.availableColors) {
    keywords.push(...product.availableColors.map(c => c.toLowerCase()));
  }
  
  // Mots-clés génériques
  keywords.push('acheter en ligne', 'livraison gratuite', 'pas cher', 'qualité');
  
  return keywords.join(', ');
};

/**
 * Génère un titre SEO optimisé pour un produit
 * Format: [Produit] | [Marque] - [Catégorie] | E-commerce Family's
 */
export const generateProductTitle = (product: Product): string => {
  const parts: string[] = [product.title];
  
  if (product.brand) {
    parts.push(product.brand);
  }
  
  parts.push(product.category);
  parts.push('E-commerce Family\'s');
  
  return parts.join(' | ');
};

/**
 * Génère des alt tags optimisés pour les images de produits
 */
export const generateImageAlt = (product: Product, index: number = 0): string => {
  const parts: string[] = [product.title];
  
  if (product.brand) {
    parts.push(product.brand);
  }
  
  if (index > 0) {
    parts.push(`- Image ${index + 1}`);
  }
  
  return parts.join(' ');
};

/**
 * Génère une description riche pour les réseaux sociaux
 */
export const generateSocialDescription = (product: Product): string => {
  const price = product.discountPercentage > 0
    ? `${(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}€`
    : `${product.price}€`;
  
  const parts: string[] = [];
  
  parts.push(`🛍️ ${product.title}`);
  parts.push(`💰 ${price}`);
  
  if (product.rating >= 4) {
    parts.push(`⭐ ${product.rating}/5 (${product.stock} avis)`);
  }
  
  if (product.stock > 0 && product.stock < 10) {
    parts.push('⚡ Stock limité !');
  }
  
  parts.push('🚚 Livraison gratuite');
  
  return parts.join(' | ');
};
