import mongoose, { Schema, model, models } from 'mongoose';

export interface IVisitRecord {
  ip: string;
  country: string;
  city: string;
  flag: string;
  path: string;
  userAgent: string;
  timestamp: string;
}

export interface IAnalytics {
  key: string;
  totalViews: number;
  uniqueVisitors: number;
  visits: IVisitRecord[];
}

const VisitRecordSchema = new Schema<IVisitRecord>({
  ip: { type: String, required: true },
  country: { type: String, default: 'Nepal' },
  city: { type: String, default: 'Kathmandu' },
  flag: { type: String, default: '🇳🇵' },
  path: { type: String, default: '/' },
  userAgent: { type: String, default: '' },
  timestamp: { type: String, default: () => new Date().toISOString() },
});

const AnalyticsSchema = new Schema<IAnalytics>(
  {
    key: { type: String, required: true, unique: true, default: 'global_analytics' },
    totalViews: { type: Number, default: 0 },
    uniqueVisitors: { type: Number, default: 0 },
    visits: { type: [VisitRecordSchema], default: [] },
  },
  { timestamps: true }
);

export const AnalyticsModel = models.Analytics || model<IAnalytics>('Analytics', AnalyticsSchema);
