import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IClient extends Document {
  name: string;
  email: string;
  password: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  phone?: string;
  avatar?: string;
  isActive?: boolean;
  emailVerified?: boolean;
  blocked?: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const ClientSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'United States' },
  },
  phone: { type: String },
  avatar: { type: String },
  isActive: { type: Boolean, default: true },
  emailVerified: { type: Boolean, default: false },
  blocked: { type: Boolean, default: false },
  resetPasswordToken: { type: String, select: false },
  resetPasswordExpires: { type: Date, select: false },
}, { timestamps: true });

// Hash password before saving
ClientSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  const password = this.password as string;
  this.password = await bcrypt.hash(password, salt);
  next();
});

// Compare password method
ClientSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IClient>('Client', ClientSchema);