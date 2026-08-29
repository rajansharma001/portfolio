import mongoose, { Schema, model, models } from 'mongoose';

export interface ISetting {
  key: string;
  name: string;
  role: string;
  headline: string;
  location: string;
  email: string;
  phone: string;
  isAvailableForHire: boolean;
  availabilityBadgeText: string;
  resumeUrl: string;
  bio: string;
  codeSnippet: string;
}

const SettingSchema = new Schema<ISetting>(
  {
    key: { type: String, required: true, unique: true, default: 'global_settings' },
    name: { type: String, default: 'Rajan Sharma' },
    role: { type: String, default: 'Full-Stack Software Engineer' },
    headline: { type: String, default: 'Building production-grade web systems & scalable backends.' },
    location: { type: String, default: 'Kathmandu, Bagmati Prov, Nepal' },
    email: { type: String, default: 'email.rajan001@gmail.com' },
    phone: { type: String, default: '+977 9800000000' },
    isAvailableForHire: { type: Boolean, default: true },
    availabilityBadgeText: { type: String, default: 'Open for Roles' },
    resumeUrl: { type: String, default: '/uploads/resume.pdf' },
    bio: { type: String, default: 'Full-Stack Software Engineer specializing in Next.js, TypeScript, Node.js, Express, PostgreSQL, and MongoDB architectures.' },
    codeSnippet: {
      type: String,
      default: `// rajan.config.ts\nexport const engineer = {\n  name: "Rajan Sharma",\n  role: "Full-Stack Software Engineer",\n  location: "Kathmandu, Nepal",\n  focus: ["Scalable Architecture", "API Security", "High Performance Systems"],\n  status: "Available for Engineering Roles"\n};`,
    },
  },
  { timestamps: true }
);

export const SettingModel = models.Setting || model<ISetting>('Setting', SettingSchema);
