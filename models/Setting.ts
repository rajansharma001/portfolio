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
  sectionVisibility: {
    showHero: boolean;
    showAvailabilityBadge: boolean;
    showMarquee: boolean;
    showProjects: boolean;
    showSkills: boolean;
    showExperience: boolean;
    showProcess: boolean;
    showContact: boolean;
    showBlog: boolean;
    showScrollProgress: boolean;
    showFooter: boolean;
    showResumeButton: boolean;
    showClockWidget: boolean;
    showThemeToggle: boolean;
  };
}

const SectionVisibilitySchema = new Schema(
  {
    showHero: { type: Boolean, default: true },
    showAvailabilityBadge: { type: Boolean, default: true },
    showMarquee: { type: Boolean, default: false },
    showProjects: { type: Boolean, default: true },
    showSkills: { type: Boolean, default: true },
    showExperience: { type: Boolean, default: true },
    showProcess: { type: Boolean, default: true },
    showContact: { type: Boolean, default: true },
    showBlog: { type: Boolean, default: true },
    showScrollProgress: { type: Boolean, default: true },
    showFooter: { type: Boolean, default: true },
    showResumeButton: { type: Boolean, default: true },
    showClockWidget: { type: Boolean, default: true },
    showThemeToggle: { type: Boolean, default: true },
  },
  { _id: false }
);

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
    bio: {
      type: String,
      default:
        'Full-Stack Software Engineer specializing in Next.js, TypeScript, Node.js, Express, PostgreSQL, and MongoDB architectures.',
    },
    codeSnippet: {
      type: String,
      default: `// rajan.config.ts\nexport const engineer = {\n  name: "Rajan Sharma",\n  role: "Full-Stack Software Engineer",\n  location: "Kathmandu, Nepal",\n  focus: ["Scalable Architecture", "API Security", "High Performance Systems"],\n  status: "Available for Engineering Roles"\n};`,
    },
    sectionVisibility: { type: SectionVisibilitySchema, default: () => ({}) },
  },
  { timestamps: true }
);

export const SettingModel = models.Setting || model<ISetting>('Setting', SettingSchema);
