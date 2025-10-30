import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  role?: mongoose.Types.ObjectId;
  addresses: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
  }[];
  isActive: boolean;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  lastLogin?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
  firstName: {
    type: String,
    required: [true, 'Please provide a first name'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Please provide a last name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  phone: {
    type: String,
    trim: true
  },
  avatar: {
    type: String
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
  },
  addresses: [{
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
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  lastLogin: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

export const User = mongoose.model<IUser>('User', userSchema);