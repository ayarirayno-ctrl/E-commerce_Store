import { Request, Response } from 'express';
import { Review } from '../models/Review';
import Product, { IProduct } from '../models/Product';
import { Order } from '../models/Order';

export const reviewController = {
  // Create a review
  createReview: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const { productId, rating, title, comment, images } = req.body;

      // Check if product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Check if user already reviewed this product
      const existingReview = await Review.findOne({ user: userId, product: productId });
      if (existingReview) {
        return res.status(400).json({ error: 'You have already reviewed this product' });
      }

      // Check if user purchased this product (verified purchase)
      const hasPurchased = await Order.findOne({
        user: userId,
        'items.product': productId,
        orderStatus: 'delivered'
      });

      const review = await Review.create({
        user: userId,
        product: productId,
        rating,
        title,
        comment,
        images: images || [],
        isVerifiedPurchase: !!hasPurchased
      });

      res.status(201).json({
        success: true,
        review
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error creating review' });
    }
  },

  // Get reviews for a product
  getProductReviews: async (req: Request, res: Response) => {
    try {
      const productId = req.params.productId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      const sortBy = req.query.sortBy as string || '-createdAt';

      const query: any = { product: productId, isApproved: true };

      const reviews = await Review.find(query)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .populate('user', 'firstName lastName avatar');

      const total = await Review.countDocuments(query);

      // Calculate rating statistics
      const stats = await Review.aggregate([
        { $match: { product: productId, isApproved: true } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 },
            fiveStars: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
            fourStars: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
            threeStars: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
            twoStars: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
            oneStar: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } }
          }
        }
      ]);

      res.json({
        reviews,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalReviews: total,
        statistics: stats[0] || {
          averageRating: 0,
          totalReviews: 0,
          fiveStars: 0,
          fourStars: 0,
          threeStars: 0,
          twoStars: 0,
          oneStar: 0
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error fetching reviews' });
    }
  },

  // Get user's reviews
  getUserReviews: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const reviews = await Review.find({ user: userId })
        .sort('-createdAt')
        .skip(skip)
        .limit(limit)
        .populate('product', 'name images price');

      const total = await Review.countDocuments({ user: userId });

      res.json({
        reviews,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalReviews: total
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error fetching reviews' });
    }
  },

  // Update a review
  updateReview: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const reviewId = req.params.id;
      const { rating, title, comment, images } = req.body;

      const review = await Review.findOne({ _id: reviewId, user: userId });
      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      review.rating = rating || review.rating;
      review.title = title || review.title;
      review.comment = comment || review.comment;
      review.images = images || review.images;

      await review.save();

      res.json({
        success: true,
        review
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error updating review' });
    }
  },

  // Delete a review
  deleteReview: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const reviewId = req.params.id;

      const review = await Review.findOneAndDelete({ _id: reviewId, user: userId });
      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      res.json({
        success: true,
        message: 'Review deleted successfully'
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error deleting review' });
    }
  },

  // Mark review as helpful
  markHelpful: async (req: Request, res: Response) => {
    try {
      const reviewId = req.params.id;

      const review = await Review.findByIdAndUpdate(
        reviewId,
        { $inc: { helpfulCount: 1 } },
        { new: true }
      );

      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      res.json({
        success: true,
        helpfulCount: review.helpfulCount
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error updating review' });
    }
  },

  // Report review
  reportReview: async (req: Request, res: Response) => {
    try {
      const reviewId = req.params.id;

      const review = await Review.findByIdAndUpdate(
        reviewId,
        { $inc: { reportCount: 1 } },
        { new: true }
      );

      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      // Auto-hide if too many reports
      if (review.reportCount >= 5) {
        review.isApproved = false;
        await review.save();
      }

      res.json({
        success: true,
        message: 'Review reported successfully'
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error reporting review' });
    }
  },

  // Admin: Get all reviews
  getAllReviews: async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;
      const isApproved = req.query.isApproved;

      const query: any = {};
      if (isApproved !== undefined) {
        query.isApproved = isApproved === 'true';
      }

      const reviews = await Review.find(query)
        .sort('-createdAt')
        .skip(skip)
        .limit(limit)
        .populate('user', 'firstName lastName email')
        .populate('product', 'name');

      const total = await Review.countDocuments(query);

      res.json({
        reviews,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalReviews: total
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error fetching reviews' });
    }
  },

  // Admin: Approve/reject review
  moderateReview: async (req: Request, res: Response) => {
    try {
      const reviewId = req.params.id;
      const { isApproved } = req.body;

      const review = await Review.findByIdAndUpdate(
        reviewId,
        { isApproved },
        { new: true }
      );

      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      res.json({
        success: true,
        message: `Review ${isApproved ? 'approved' : 'rejected'}`,
        review
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error moderating review' });
    }
  },

  // Admin: Add response to review
  respondToReview: async (req: Request, res: Response) => {
    try {
      const adminId = (req as any).user?.id;
      const reviewId = req.params.id;
      const { text } = req.body;

      const review = await Review.findByIdAndUpdate(
        reviewId,
        {
          adminResponse: {
            text,
            respondedBy: adminId,
            respondedAt: new Date()
          }
        },
        { new: true }
      ).populate('adminResponse.respondedBy', 'name');

      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      res.json({
        success: true,
        review
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error responding to review' });
    }
  },

  // Admin: Approve review
  approveReview: async (req: Request, res: Response) => {
    try {
      const review = await Review.findByIdAndUpdate(
        req.params.id,
        { isApproved: true },
        { new: true }
      );

      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      res.json({ success: true, review });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error approving review' });
    }
  },

  // Admin: Reject review
  rejectReview: async (req: Request, res: Response) => {
    try {
      const review = await Review.findByIdAndUpdate(
        req.params.id,
        { isApproved: false },
        { new: true }
      );

      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      res.json({ success: true, review });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error rejecting review' });
    }
  },

  // Admin: Get review statistics
  getReviewStats: async (req: Request, res: Response) => {
    try {
      const stats = await Promise.all([
        Review.countDocuments(),
        Review.countDocuments({ isApproved: true }),
        Review.countDocuments({ isApproved: false }),
        Review.countDocuments({ reportCount: { $gt: 0 } }),
      ]);

      const avgRating = await Review.aggregate([
        { $match: { isApproved: true } },
        { $group: { _id: null, avgRating: { $avg: '$rating' } } },
      ]);

      res.json({
        success: true,
        stats: {
          total: stats[0],
          approved: stats[1],
          pending: stats[2],
          reported: stats[3],
          averageRating: avgRating[0]?.avgRating || 0,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error getting stats' });
    }
  }
};