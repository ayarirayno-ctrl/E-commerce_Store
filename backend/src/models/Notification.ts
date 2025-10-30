import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  type: 'order' | 'product' | 'review' | 'user' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  adminId?: mongoose.Types.ObjectId;
  relatedId?: string;
  relatedModel?: string;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  createdAt: Date;
  readAt?: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    type: {
      type: String,
      enum: ['order', 'product', 'review', 'user', 'system'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    relatedId: {
      type: String,
    },
    relatedModel: {
      type: String,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    actionUrl: {
      type: String,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ adminId: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;