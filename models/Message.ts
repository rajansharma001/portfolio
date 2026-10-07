import mongoose, { Schema, model, models } from 'mongoose';

export interface IMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  inquiryType?: string;
  timeline?: string;
  status?: 'new' | 'in_discussion' | 'quoted' | 'won' | 'archived';
  priority?: 'normal' | 'high' | 'urgent';
  notes?: string;
  ip?: string;
  country?: string;
  flag?: string;
  read: boolean;
  createdAt: string;
  updatedAt?: string;
}

const MessageSchema = new Schema<IMessage>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    inquiryType: { type: String, default: 'General Inquiry' },
    timeline: { type: String, default: 'Flexible' },
    status: {
      type: String,
      enum: ['new', 'in_discussion', 'quoted', 'won', 'archived'],
      default: 'new',
    },
    priority: {
      type: String,
      enum: ['normal', 'high', 'urgent'],
      default: 'normal',
    },
    notes: { type: String, default: '' },
    ip: { type: String, default: '' },
    country: { type: String, default: 'Unknown' },
    flag: { type: String, default: '🌐' },
    read: { type: Boolean, default: false },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export const MessageModel = models.Message || model<IMessage>('Message', MessageSchema);
