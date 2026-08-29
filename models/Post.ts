import mongoose, { Schema, model, models } from 'mongoose';

export interface IPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  coverImage?: string;
  published: boolean;
  publishedAt: string;
  readTimeMinutes: number;
  views: number;
}

const PostSchema = new Schema<IPost>(
  {
    id: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    excerpt: { type: String, default: '' },
    content: { type: String, required: true },
    category: { type: String, default: 'Engineering' },
    tags: { type: [String], default: [] },
    coverImage: { type: String, default: '' },
    published: { type: Boolean, default: true },
    publishedAt: { type: String, default: () => new Date().toISOString() },
    readTimeMinutes: { type: Number, default: 3 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const PostModel = models.Post || model<IPost>('Post', PostSchema);
