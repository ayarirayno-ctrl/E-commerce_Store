import { Product } from './product';

export interface RecommendationConfig {
  maxRecommendations: number;
  similarityThreshold: number;
  trendingDays: number;
}

export interface UserBrowsingHistory {
  productId: number;
  viewedAt: Date;
  category: string;
  price: number;
}

export interface RecommendationScore {
  product: Product;
  score: number;
  reason: 'similar' | 'trending' | 'category' | 'price-range' | 'frequently-bought';
}

export const DEFAULT_RECOMMENDATION_CONFIG: RecommendationConfig = {
  maxRecommendations: 6,
  similarityThreshold: 0.3,
  trendingDays: 7,
};
