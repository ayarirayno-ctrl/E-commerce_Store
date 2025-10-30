import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  addReview,
  updateReview,
  deleteReview,
  toggleHelpful,
  setFilters,
  clearFilters,
  selectReviewsByProduct,
  selectProductStats,
  selectFilteredReviews,
  selectReviewFilters,
  selectReviewsLoading,
  selectReviewsError,
} from '../store/slices/reviewsSlice';
import type { Review, ReviewFilters } from '../types/product';

export const useReviews = (productId?: number) => {
  const dispatch = useAppDispatch();
  
  // Selectors - always call hooks unconditionally
  const filters = useAppSelector(selectReviewFilters);
  const loading = useAppSelector(selectReviewsLoading);
  const error = useAppSelector(selectReviewsError);
  
  // Product-specific selectors with default empty state
  const allReviews = useAppSelector(state => 
    productId ? selectReviewsByProduct(productId)(state) : []
  );
  const filteredReviews = useAppSelector(state =>
    productId ? selectFilteredReviews(productId)(state) : []
  );
  const stats = useAppSelector(state =>
    productId ? selectProductStats(productId)(state) : null
  );

  // Actions
  const submitReview = useCallback((reviewData: Omit<Review, 'id' | 'helpfulCount' | 'helpfulBy' | 'createdAt'>) => {
    dispatch(addReview(reviewData));
  }, [dispatch]);

  const editReview = useCallback((id: string, updates: Partial<Review>) => {
    dispatch(updateReview({ id, updates }));
  }, [dispatch]);

  const removeReview = useCallback((id: string) => {
    dispatch(deleteReview(id));
  }, [dispatch]);

  const markHelpful = useCallback((reviewId: string, userId: string) => {
    dispatch(toggleHelpful({ reviewId, userId }));
  }, [dispatch]);

  const updateFilters = useCallback((newFilters: ReviewFilters) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const isHelpful = useCallback((review: Review, userId: string) => {
    return review.helpfulBy.includes(userId);
  }, []);

  return {
    // Data
    reviews: filteredReviews,
    allReviews,
    stats,
    filters,
    loading,
    error,
    
    // Actions
    submitReview,
    editReview,
    removeReview,
    markHelpful,
    updateFilters,
    resetFilters,
    isHelpful,
  };
};
