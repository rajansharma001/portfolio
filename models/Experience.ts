import mongoose, { Schema, model, models } from 'mongoose';

export interface IExperience {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
  order: number;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    id: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    company: { type: String, required: true },
    period: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, default: '' },
    highlights: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ExperienceModel = models.Experience || model<IExperience>('Experience', ExperienceSchema);
