import mongoose, { Schema, model, models } from 'mongoose';

export interface IMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const MessageSchema = new Schema<IMessage>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export const MessageModel = models.Message || model<IMessage>('Message', MessageSchema);
