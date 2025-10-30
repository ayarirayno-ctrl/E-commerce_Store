import mongoose, { Schema, Document } from 'mongoose';

export interface ILogAdmin extends Document {
  admin: mongoose.Types.ObjectId;
  action: string;
  target: string;
  timestamp: Date;
}

const LogAdminSchema: Schema = new Schema({
  admin: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
  action: { type: String, required: true },
  target: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<ILogAdmin>('LogAdmin', LogAdminSchema);