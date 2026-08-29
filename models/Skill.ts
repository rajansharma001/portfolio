import mongoose, { Schema, model, models } from 'mongoose';

export interface ISkillCategory {
  category: string;
  skills: string[];
}

const SkillCategorySchema = new Schema<ISkillCategory>(
  {
    category: { type: String, required: true, unique: true },
    skills: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const SkillModel = models.Skill || model<ISkillCategory>('Skill', SkillCategorySchema);
