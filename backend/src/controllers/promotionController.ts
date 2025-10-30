import { Request, Response } from 'express';
import Promotion from '../models/Promotion';

// Get all promotions
export const getAllPromotions = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    
    let query: Record<string, unknown> = {};
    
    if (status === 'active') {
      query.active = true;
      query.endDate = { $gte: new Date() };
    } else if (status === 'expired') {
      query.endDate = { $lt: new Date() };
    } else if (status === 'inactive') {
      query.active = false;
    }

    const promotions = await Promotion.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: promotions.length,
      promotions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get promotion by ID
export const getPromotionById = async (req: Request, res: Response) => {
  try {
    const promotion = await Promotion.findById(req.params.id);

    if (!promotion) {
      return res.status(404).json({ success: false, message: 'Promotion not found' });
    }

    res.json({ success: true, promotion });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create promotion
export const createPromotion = async (req: Request, res: Response) => {
  try {
    const { code, discount, startDate, endDate, active, discountType, minPurchase, maxDiscount, usageLimit } = req.body;

    // Check if code already exists
    const existingPromotion = await Promotion.findOne({ code: code.toUpperCase() });
    if (existingPromotion) {
      return res.status(400).json({ success: false, message: 'Code promo déjà existant' });
    }

    const promotion = await Promotion.create({
      code: code.toUpperCase(),
      discount,
      startDate,
      endDate,
      active,
      discountType,
      minPurchase,
      maxDiscount,
      usageLimit,
    });

    res.status(201).json({ success: true, promotion });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update promotion
export const updatePromotion = async (req: Request, res: Response) => {
  try {
    const { code, discount, startDate, endDate, active, discountType, minPurchase, maxDiscount, usageLimit } = req.body;

    // Check if code exists for another promotion
    if (code) {
      const existingPromotion = await Promotion.findOne({ 
        code: code.toUpperCase(),
        _id: { $ne: req.params.id }
      });
      if (existingPromotion) {
        return res.status(400).json({ success: false, message: 'Code promo déjà utilisé' });
      }
    }

    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      {
        code: code?.toUpperCase(),
        discount,
        startDate,
        endDate,
        active,
        discountType,
        minPurchase,
        maxDiscount,
        usageLimit,
      },
      { new: true, runValidators: true }
    );

    if (!promotion) {
      return res.status(404).json({ success: false, message: 'Promotion not found' });
    }

    res.json({ success: true, promotion });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete promotion
export const deletePromotion = async (req: Request, res: Response) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);

    if (!promotion) {
      return res.status(404).json({ success: false, message: 'Promotion not found' });
    }

    res.json({ success: true, message: 'Promotion deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Validate promotion code
export const validatePromotionCode = async (req: Request, res: Response) => {
  try {
    const { code, totalAmount } = req.body;

    const promotion = await Promotion.findOne({ 
      code: code.toUpperCase(),
      active: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });

    if (!promotion) {
      return res.status(404).json({ 
        success: false, 
        message: 'Code promo invalide ou expiré' 
      });
    }

    // Check minimum purchase
    if (promotion.minPurchase && totalAmount < promotion.minPurchase) {
      return res.status(400).json({
        success: false,
        message: `Montant minimum requis: $${promotion.minPurchase}`
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (promotion.discountType === 'percentage') {
      discountAmount = (totalAmount * promotion.discount) / 100;
      if (promotion.maxDiscount && discountAmount > promotion.maxDiscount) {
        discountAmount = promotion.maxDiscount;
      }
    } else {
      discountAmount = promotion.discount;
    }

    res.json({
      success: true,
      promotion,
      discountAmount,
      finalAmount: totalAmount - discountAmount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get promotion statistics
export const getPromotionStats = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    
    const stats = await Promise.all([
      Promotion.countDocuments({ active: true, endDate: { $gte: now } }),
      Promotion.countDocuments({ endDate: { $lt: now } }),
      Promotion.countDocuments({ active: false }),
      Promotion.countDocuments(),
    ]);

    res.json({
      success: true,
      stats: {
        active: stats[0],
        expired: stats[1],
        inactive: stats[2],
        total: stats[3],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
