import mongoose from 'mongoose';

export interface IOrder {
  user: mongoose.Types.ObjectId;
  orderNumber: string;
  items: {
    product: mongoose.Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: 'credit_card' | 'paypal' | 'stripe' | 'cash_on_delivery';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  notes?: string;
  trackingNumber?: string;
  deliveredAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const orderSchema = new mongoose.Schema<IOrder>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',  // Changed from 'User' to 'Client' for client orders
    required: [true, 'Order must belong to a client']
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    image: {
      type: String,
      required: true
    }
  }],
  shippingAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true,
      default: 'USA'
    }
  },
  billingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal', 'stripe', 'cash_on_delivery'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  shippingCost: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  discount: {
    type: Number,
    min: 0,
    default: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  notes: String,
  trackingNumber: String,
  deliveredAt: Date,
  cancelledAt: Date,
  cancellationReason: String
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
  }
  next();
});

// Index for better query performance
orderSchema.index({ user: 1, createdAt: -1 });
// orderNumber already has unique:true index from schema field definition
orderSchema.index({ orderStatus: 1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema);