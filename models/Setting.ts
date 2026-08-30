import mongoose, { Schema, model, models } from 'mongoose';

export interface ISetting {
  key: string;
  name: string;
  role: string;
  headline: string;
  heroImpactText: string;
  quickFacts: {
    location: string;
    coreStack: string;
    focus: string;
  };
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
  faqs: Array<{ q: string; a: string }>;
  processSteps: Array<{ num: string; title: string; desc: string }>;
  education: Array<{ degree: string; school: string; note?: string }>;
  languages: Array<{ language: string; proficiency: string }>;
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

const QuickFactsSchema = new Schema(
  {
    location: { type: String, default: 'Kathmandu, Bagmati Prov, Nepal' },
    coreStack: { type: String, default: 'Next.js / Node.js / PostgreSQL / MongoDB' },
    focus: { type: String, default: 'Scalable Architecture & Web Systems' },
  },
  { _id: false }
);

const FaqItemSchema = new Schema(
  {
    q: { type: String, required: true },
    a: { type: String, required: true },
  },
  { _id: false }
);

const ProcessStepSchema = new Schema(
  {
    num: { type: String, default: '01' },
    title: { type: String, required: true },
    desc: { type: String, required: true },
  },
  { _id: false }
);

const EducationSchema = new Schema(
  {
    degree: { type: String, required: true },
    school: { type: String, required: true },
    note: { type: String, default: '' },
  },
  { _id: false }
);

const LanguageSchema = new Schema(
  {
    language: { type: String, required: true },
    proficiency: { type: String, required: true },
  },
  { _id: false }
);

const SettingSchema = new Schema<ISetting>(
  {
    key: { type: String, required: true, unique: true, default: 'global_settings' },
    name: { type: String, default: 'Rajan Sharma' },
    role: { type: String, default: 'Full-Stack Software Engineer' },
    headline: { type: String, default: 'Building production-grade web systems & scalable backends.' },
    heroImpactText: {
      type: String,
      default: '16 production systems shipped across LMS, POS, tourism & geospatial domains.',
    },
    quickFacts: { type: QuickFactsSchema, default: () => ({}) },
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
    faqs: {
      type: [FaqItemSchema],
      default: [
        {
          q: 'Engineering Roles & Availability',
          a: 'I am open to full-time remote engineering positions, hybrid roles, and contract architectural projects worldwide.',
        },
        {
          q: 'Full-Stack Technical Scope',
          a: 'From relational/document database schemas and REST APIs to reactive Next.js frontends and production deployment, I handle end-to-end technical delivery.',
        },
        {
          q: 'Timezone & Collaboration',
          a: 'Based in Kathmandu, Nepal (UTC+5:45), coordinating seamlessly with Asian, European, and US working schedules.',
        },
      ],
    },
    processSteps: {
      type: [ProcessStepSchema],
      default: [
        {
          num: '01',
          title: 'Analyze & Architect',
          desc: 'Defining system requirements, database schema design, and technical feasibility for scalable infrastructure.',
        },
        {
          num: '02',
          title: 'Backend Engineering',
          desc: 'Building secure REST APIs, authentication pipelines, and data ingestion services using Node.js & PostgreSQL.',
        },
        {
          num: '03',
          title: 'Frontend Integration',
          desc: 'Connecting server actions to Next.js clients, optimizing caching layers, and ensuring responsive UI/UX.',
        },
        {
          num: '04',
          title: 'Deploy & Scale',
          desc: 'CI/CD pipeline configuration, server provisioning, containerization, and post-launch monitoring.',
        },
      ],
    },
    education: {
      type: [EducationSchema],
      default: [
        {
          degree: 'Diploma in Electrical Engineering',
          school: 'CTEVT (3-Year Technical Engineering Track)',
          note: 'Engineering fundamentals, logic circuits & technical math.',
        },
        {
          degree: 'Bachelor of Business Studies',
          school: 'Enrolled / Higher Education',
          note: 'Organizational strategy and business context.',
        },
      ],
    },
    languages: {
      type: [LanguageSchema],
      default: [
        { language: 'English', proficiency: 'Professional Proficiency' },
        { language: 'Nepali', proficiency: 'Native Speaker' },
        { language: 'Hindi', proficiency: 'Fluent' },
      ],
    },
  },
  { timestamps: true }
);

export const SettingModel = models.Setting || model<ISetting>('Setting', SettingSchema);
