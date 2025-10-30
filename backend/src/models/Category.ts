import mongoose from 'mongoose';

export interface ICategory {
  name: string;
  slug: string;
  description?: string;
  parent?: mongoose.Types.ObjectId;
  image?: {
    url: string;
    public_id: string;
  };
  isActive: boolean;
  order: number;
}

const categorySchema = new mongoose.Schema<ICategory>({
  name: {
    type: String,
    required: [true, 'Please provide a category name'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  image: {
    url: String,
    public_id: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Middleware pour générer le slug avant la sauvegarde
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

const Category = mongoose.model<ICategory>('Category', categorySchema);

export default Category;