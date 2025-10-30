import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Review, ReviewFilters, ReviewStats } from '../../types/product';

interface ReviewsState {
  items: Review[];
  stats: Record<number, ReviewStats>; // Stats by productId
  filters: ReviewFilters;
  loading: boolean;
  error: string | null;
}

// Load reviews from localStorage
const loadReviewsFromStorage = (): Review[] => {
  try {
    const serializedState = localStorage.getItem('reviews');
    if (serializedState === null) {
      return [];
    }
    const parsed = JSON.parse(serializedState);
    return parsed.items || [];
  } catch (err) {
    return [];
  }
};

const initialState: ReviewsState = {
  items: loadReviewsFromStorage(),
  stats: {},
  filters: {
    sortBy: 'recent',
  },
  loading: false,
  error: null,
};

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    // Add a new review
    addReview: (state, action: PayloadAction<Omit<Review, 'id' | 'helpfulCount' | 'helpfulBy' | 'createdAt'>>) => {
      const newReview: Review = {
        ...action.payload,
        id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        helpfulCount: 0,
        helpfulBy: [],
        createdAt: new Date().toISOString(),
      };
      state.items.unshift(newReview);
      state.error = null;
    },

    // Update an existing review
    updateReview: (state, action: PayloadAction<{ id: string; updates: Partial<Review> }>) => {
      const index = state.items.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },

    // Delete a review
    deleteReview: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(r => r.id !== action.payload);
    },

    // Toggle helpful vote
    toggleHelpful: (state, action: PayloadAction<{ reviewId: string; userId: string }>) => {
      const review = state.items.find(r => r.id === action.payload.reviewId);
      if (review) {
        const hasVoted = review.helpfulBy.includes(action.payload.userId);
        if (hasVoted) {
          review.helpfulBy = review.helpfulBy.filter(id => id !== action.payload.userId);
          review.helpfulCount = Math.max(0, review.helpfulCount - 1);
        } else {
          review.helpfulBy.push(action.payload.userId);
          review.helpfulCount += 1;
        }
      }
    },

    // Set reviews for a product (bulk)
    setReviews: (state, action: PayloadAction<Review[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Update stats for a product
    updateStats: (state, action: PayloadAction<{ productId: number; stats: ReviewStats }>) => {
      state.stats[action.payload.productId] = action.payload.stats;
    },

    // Set filters
    setFilters: (state, action: PayloadAction<ReviewFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Clear filters
    clearFilters: (state) => {
      state.filters = { sortBy: 'recent' };
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Clear all reviews
    clearReviews: (state) => {
      state.items = [];
      state.stats = {};
      state.error = null;
    },
  },
});

export const {
  addReview,
  updateReview,
  deleteReview,
  toggleHelpful,
  setReviews,
  updateStats,
  setFilters,
  clearFilters,
  setLoading,
  setError,
  clearReviews,
} = reviewsSlice.actions;

// Selectors
export const selectAllReviews = (state: { reviews: ReviewsState }) => state.reviews.items;

export const selectReviewsByProduct = (productId: number) => (state: { reviews: ReviewsState }) =>
  state.reviews.items.filter(r => r.productId === productId);

export const selectProductStats = (productId: number) => (state: { reviews: ReviewsState }) => {
  const reviews = state.reviews.items.filter(r => r.productId === productId);
  
  if (reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }

  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = totalRating / reviews.length;
  
  const ratingDistribution = reviews.reduce((dist, r) => {
    dist[r.rating] = (dist[r.rating] || 0) + 1;
    return dist;
  }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews: reviews.length,
    ratingDistribution,
  };
};

export const selectFilteredReviews = (productId: number) => (state: { reviews: ReviewsState }) => {
  const { filters } = state.reviews;
  let reviews = state.reviews.items.filter(r => r.productId === productId);

  // Filter by rating
  if (filters.rating) {
    reviews = reviews.filter(r => r.rating === filters.rating);
  }

  // Filter verified only
  if (filters.verifiedOnly) {
    reviews = reviews.filter(r => r.verifiedPurchase);
  }

  // Sort
  switch (filters.sortBy) {
    case 'recent':
      reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'helpful':
      reviews.sort((a, b) => b.helpfulCount - a.helpfulCount);
      break;
    case 'highest':
      reviews.sort((a, b) => b.rating - a.rating);
      break;
    case 'lowest':
      reviews.sort((a, b) => a.rating - b.rating);
      break;
    default:
      break;
  }

  return reviews;
};

export const selectReviewFilters = (state: { reviews: ReviewsState }) => state.reviews.filters;
export const selectReviewsLoading = (state: { reviews: ReviewsState }) => state.reviews.loading;
export const selectReviewsError = (state: { reviews: ReviewsState }) => state.reviews.error;

export default reviewsSlice.reducer;
