import mongoose, { Schema, Document } from 'mongoose';

export interface IPromotion extends Document {
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  startDate: Date;
  endDate: Date;
  active: boolean;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
}

const PromotionSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discount: { type: Number, required: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  active: { type: Boolean, default: true },
  minPurchase: { type: Number },
  maxDiscount: { type: Number },
  usageLimit: { type: Number },
  usedCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<IPromotion>('Promotion', PromotionSchema);