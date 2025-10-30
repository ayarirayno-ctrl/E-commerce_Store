import mongoose, { Document, Schema } from 'mongoose';

export interface IAdminLog extends Document {
  action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'other';
  adminId: mongoose.Types.ObjectId;
  adminEmail?: string;
  targetModel: string;
  targetId?: string;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  description: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const AdminLogSchema = new Schema<IAdminLog>(
  {
    action: {
      type: String,
      enum: ['create', 'update', 'delete', 'login', 'logout', 'other'],
      required: true,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    adminEmail: {
      type: String,
    },
    targetModel: {
      type: String,
      required: true,
    },
    targetId: {
      type: String,
    },
    changes: [
      {
        field: String,
        oldValue: Schema.Types.Mixed,
        newValue: Schema.Types.Mixed,
      },
    ],
    description: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index pour améliorer les performances
AdminLogSchema.index({ adminId: 1, createdAt: -1 });
AdminLogSchema.index({ targetModel: 1, targetId: 1 });
AdminLogSchema.index({ action: 1 });
AdminLogSchema.index({ createdAt: -1 });

const AdminLog = mongoose.model<IAdminLog>('AdminLog', AdminLogSchema);

export default AdminLog;
