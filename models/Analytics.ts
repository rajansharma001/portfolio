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

export interface IVisitLog {
  _id?: string;
  ip: string;
  country: string;
  countryCode: string;
  city: string;
  region: string;
  flag: string;
  path: string;
  referrer: string;
  referrerHost: string;
  device: 'desktop' | 'mobile' | 'tablet' | 'bot' | string;
  os: string;
  browser: string;
  screenResolution: string;
  language: string;
  isBot: boolean;
  botName?: string;
  userAgent: string;
  timestamp: Date;
}

export interface IAnalytics {
  key: string;
  totalViews: number;
  uniqueVisitors: number;
  visits: IVisitRecord[];
}

const VisitRecordSchema = new Schema<IVisitRecord>(
  {
    ip: { type: String, required: true },
    country: { type: String, default: 'Nepal' },
    city: { type: String, default: 'Kathmandu' },
    flag: { type: String, default: '🇳🇵' },
    path: { type: String, default: '/' },
    userAgent: { type: String, default: '' },
    timestamp: { type: String, default: () => new Date().toISOString() },
  },
  { _id: false }
);

const VisitLogSchema = new Schema<IVisitLog>(
  {
    ip: { type: String, required: true, index: true },
    country: { type: String, default: 'Nepal', index: true },
    countryCode: { type: String, default: 'NP' },
    city: { type: String, default: 'Kathmandu' },
    region: { type: String, default: 'Bagmati' },
    flag: { type: String, default: '🇳🇵' },
    path: { type: String, default: '/', index: true },
    referrer: { type: String, default: 'Direct' },
    referrerHost: { type: String, default: 'direct', index: true },
    device: { type: String, default: 'desktop', index: true },
    os: { type: String, default: 'Unknown' },
    browser: { type: String, default: 'Unknown' },
    screenResolution: { type: String, default: 'Unknown' },
    language: { type: String, default: 'en' },
    isBot: { type: Boolean, default: false, index: true },
    botName: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

// Compound indexes for high-speed dashboard analytics
VisitLogSchema.index({ timestamp: -1, isBot: 1 });
VisitLogSchema.index({ country: 1, timestamp: -1 });

const AnalyticsSchema = new Schema<IAnalytics>(
  {
    key: { type: String, required: true, unique: true, default: 'global_analytics' },
    totalViews: { type: Number, default: 0 },
    uniqueVisitors: { type: Number, default: 0 },
    visits: { type: [VisitRecordSchema], default: [] },
  },
  { timestamps: true }
);

export const VisitLogModel = models.VisitLog || model<IVisitLog>('VisitLog', VisitLogSchema);
export const AnalyticsModel = models.Analytics || model<IAnalytics>('Analytics', AnalyticsSchema);
