import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdmin {
  name: string;
  email: string;
  password: string;
  role: 'super-admin' | 'admin' | 'manager';
  isActive: boolean;
  lastLogin?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const adminSchema = new mongoose.Schema<IAdmin>({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  role: {
    type: String,
    enum: ['super-admin', 'admin', 'manager'],
    default: 'manager'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Hasher le mot de passe avant de sauvegarder
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Méthode pour comparer les mots de passe
adminSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.model<IAdmin>('Admin', adminSchema);

export default Admin;