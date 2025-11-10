import api from '../lib/api';
import { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Types
export interface ReviewData {
  rating: number;
  comment: string;
}

export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  product: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ReviewsResponse {
  success: boolean;
  reviews: Review[];
  stats?: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
  };
}

export interface ReviewResponse {
  success: boolean;
  review: Review;
  message?: string;
}

class ReviewService {
  // Get all reviews for a product
  async getProductReviews(productId: string): Promise<ReviewsResponse> {
    try {
      const response = await api.get<ReviewsResponse>(
        `${API_URL}/reviews/product/${productId}`
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      throw new Error(
        axiosError.response?.data?.message || 'Failed to fetch reviews'
      );
    }
  }

  // Create a new review
  async createReview(productId: string, reviewData: ReviewData): Promise<Review> {
    try {
      const response = await api.post<ReviewResponse>(
        `${API_URL}/reviews`,
        { product: productId, ...reviewData }
      );
      return response.data.review;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      throw new Error(
        axiosError.response?.data?.message || 'Failed to submit review'
      );
    }
  }

  // Update a review
  async updateReview(reviewId: string, reviewData: ReviewData): Promise<Review> {
    try {
      const response = await api.put<ReviewResponse>(
        `${API_URL}/reviews/${reviewId}`,
        reviewData
      );
      return response.data.review;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      throw new Error(
        axiosError.response?.data?.message || 'Failed to update review'
      );
    }
  }

  // Delete a review
  async deleteReview(reviewId: string): Promise<void> {
    try {
      await api.delete(`${API_URL}/reviews/${reviewId}`);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      throw new Error(
        axiosError.response?.data?.message || 'Failed to delete review'
      );
    }
  }
}

export const reviewService = new ReviewService();
export default reviewService;
