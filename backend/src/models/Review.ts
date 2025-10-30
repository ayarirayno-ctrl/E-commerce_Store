import mongoose from 'mongoose';

export interface IReview {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  reportCount: number;
  isApproved: boolean;
  adminResponse?: {
    text: string;
    respondedBy: mongoose.Types.ObjectId;
    respondedAt: Date;
  };
}

const reviewSchema = new mongoose.Schema<IReview>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user']
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Review must belong to a product']
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: [true, 'Please provide a review title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Please provide a review comment'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  images: [{
    type: String
  }],
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  helpfulCount: {
    type: Number,
    default: 0,
    min: 0
  },
  reportCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  adminResponse: {
    text: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    respondedAt: Date
  }
}, {
  timestamps: true
});

// Prevent duplicate reviews from same user for same product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Index for better query performance
reviewSchema.index({ product: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ isApproved: 1 });

export const Review = mongoose.model<IReview>('Review', reviewSchema);