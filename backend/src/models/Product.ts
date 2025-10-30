import mongoose from 'mongoose';

export interface IProduct {
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  category: mongoose.Types.ObjectId;
  stock: number;
  images: {
    url: string;
    public_id: string;
    isMain: boolean;
  }[];
  sku: string;
  isActive: boolean;
  tags: string[];
  attributes: {
    name: string;
    value: string;
  }[];
}

const productSchema = new mongoose.Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  comparePrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please provide a category']
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative']
  },
  images: [{
    url: String,
    public_id: String,
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  sku: {
    type: String,
    required: [true, 'Please provide a SKU'],
    unique: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  attributes: [{
    name: String,
    value: String
  }]
}, {
  timestamps: true
});

// Index pour la recherche
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;