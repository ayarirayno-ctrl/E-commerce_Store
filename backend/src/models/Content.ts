import mongoose, { Document, Schema } from 'mongoose';

export interface IContent extends Document {
  type: 'banner' | 'slider' | 'page';
  title: string;
  slug?: string;
  content?: string;
  imageUrl?: string;
  images?: string[];
  link?: string;
  position?: number;
  isActive: boolean;
  metadata?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
  };
  settings?: {
    backgroundColor?: string;
    textColor?: string;
    buttonText?: string;
    buttonLink?: string;
  };
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema = new Schema<IContent>(
  {
    type: {
      type: String,
      enum: ['banner', 'slider', 'page'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    link: {
      type: String,
      default: '',
    },
    position: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    metadata: {
      metaTitle: String,
      metaDescription: String,
      metaKeywords: [String],
    },
    settings: {
      backgroundColor: String,
      textColor: String,
      buttonText: String,
      buttonLink: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index pour la recherche et le tri
ContentSchema.index({ type: 1, isActive: 1 });
ContentSchema.index({ position: 1 });
// slug already has unique:true index from schema field definition

// Générer slug automatiquement si page
ContentSchema.pre('save', function (next) {
  if (this.type === 'page' && !this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

export default mongoose.model<IContent>('Content', ContentSchema);
