import mongoose, { Document, Schema } from 'mongoose';

export interface IRole extends Document {
  name: string;
  displayName: string;
  description?: string;
  permissions: string[];
  level: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    permissions: {
      type: [String],
      default: [],
    },
    level: {
      type: Number,
      required: true,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index pour la recherche
// name already has unique:true index from schema field definition
RoleSchema.index({ level: 1 });

export default mongoose.model<IRole>('Role', RoleSchema);
