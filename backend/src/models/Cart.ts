import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

export interface ICart extends Document {
  client: mongoose.Types.ObjectId;
  items: ICartItem[];
  totalPrice: number;
  updatedAt: Date;
  createdAt: Date;
}

const CartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const CartSchema: Schema = new Schema(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
      unique: true,
    },
    items: [CartItemSchema],
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Calculate total price before saving
CartSchema.pre('save', function (next) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cart = this as any;
  cart.totalPrice = cart.items.reduce((total: number, item: ICartItem) => {
    return total + item.price * item.quantity;
  }, 0);
  next();
});

export default mongoose.model<ICart>('Cart', CartSchema);
