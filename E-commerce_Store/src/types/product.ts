/**
 * Product type definitions
 * Based on DummyJSON API structure
 */

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  search?: string;
}

export interface ProductState {
  items: Product[];
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
  categories: string[];
  brands: string[];
}

export interface ProductApiResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// Review types
export interface Review {
  id: string;
  productId: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title?: string;
  comment: string;
  images?: string[];
  verifiedPurchase: boolean;
  helpfulCount: number;
  helpfulBy: string[]; // User IDs who marked as helpful
  createdAt: string;
  updatedAt?: string;
}

export interface ReviewSubmission {
  productId: number;
  rating: 1 | 2 | 3 | 4 | 5;
  title?: string;
  comment: string;
  images?: File[];
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface ReviewFilters {
  rating?: 1 | 2 | 3 | 4 | 5;
  verifiedOnly?: boolean;
  sortBy?: 'recent' | 'helpful' | 'highest' | 'lowest';
}
