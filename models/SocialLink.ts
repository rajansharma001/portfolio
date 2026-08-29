import mongoose, { Schema, model, models } from 'mongoose';

export interface ISocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
}

const SocialLinkSchema = new Schema<ISocialLink>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    icon: { type: String, default: 'link' },
  },
  { timestamps: true }
);

export const SocialLinkModel = models.SocialLink || model<ISocialLink>('SocialLink', SocialLinkSchema);
