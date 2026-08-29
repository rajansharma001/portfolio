import mongoose, { Schema, model, models } from 'mongoose';

export interface IProject {
  id: string;
  slug: string;
  title: string;
  type: string;
  tagline: string;
  impact: string;
  description: string;
  thumbnail: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  backendGithubUrl?: string;
  featured: boolean;
  published: boolean;
  order: number;
}

const ProjectSchema = new Schema<IProject>(
  {
    id: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    type: { type: String, default: 'Full-stack' },
    tagline: { type: String, default: '' },
    impact: { type: String, default: '' },
    description: { type: String, required: true },
    thumbnail: { type: String, default: '' },
    techStack: { type: [String], default: [] },
    liveUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    backendGithubUrl: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ProjectModel = models.Project || model<IProject>('Project', ProjectSchema);
