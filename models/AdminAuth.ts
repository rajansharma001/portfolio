import mongoose, { Schema, model, models } from 'mongoose';

export interface IAdminAuth {
  key: string;
  passwordHash: string;
  salt: string;
  lastUpdated: string;
}

const AdminAuthSchema = new Schema<IAdminAuth>(
  {
    key: { type: String, required: true, unique: true, default: 'admin_credentials' },
    passwordHash: { type: String, required: true },
    salt: { type: String, required: true },
    lastUpdated: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export const AdminAuthModel = models.AdminAuth || model<IAdminAuth>('AdminAuth', AdminAuthSchema);
