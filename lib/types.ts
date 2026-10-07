export interface Project {
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
  details?: ProjectDetails;
}

export interface ProjectDetails {
  role?: string;
  duration?: string;
  overview?: string;
  problem?: string;
  solution?: string;
  features?: string[];
  architecture?: string;
  takeaways?: string;
}

export type SkillsMap = Record<string, string[]>;

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
}

export interface BlogPost {
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

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
}

export interface SectionVisibility {
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
}

export const DEFAULT_VISIBILITY: SectionVisibility = {
  showHero: true,
  showAvailabilityBadge: true,
  showMarquee: true,
  showProjects: true,
  showSkills: true,
  showExperience: true,
  showProcess: true,
  showContact: true,
  showBlog: true,
  showScrollProgress: true,
  showFooter: true,
  showResumeButton: true,
  showClockWidget: true,
  showThemeToggle: true,
};

export interface FAQItem {
  id?: string;
  q: string;
  a: string;
}

export interface ProcessStep {
  num: string;
  title: string;
  desc: string;
}

export interface EducationItem {
  id?: string;
  degree: string;
  school: string;
  note?: string;
}

export interface LanguageItem {
  id?: string;
  language: string;
  proficiency: string;
}

export interface QuickFacts {
  location: string;
  coreStack: string;
  focus: string;
}

export const DEFAULT_FAQS: FAQItem[] = [
  {
    q: 'Engineering Roles & Availability',
    a: 'I am open to full-time remote software engineering positions, long-term contractor roles, and high-impact web system development worldwide.',
  },
  {
    q: 'Core Technical Stack & Architectural Scope',
    a: 'Specialized in Next.js 16, React 19, TypeScript, Node.js, Express REST APIs, PostgreSQL (Prisma), MongoDB (Mongoose), and secure JWT RBAC authentication.',
  },
  {
    q: 'Timezone Alignment & Remote Collaboration',
    a: 'Based in Kathmandu, Nepal (UTC+5:45), coordinating seamlessly with Asian, European, and US working schedules with proactive daily communication.',
  },
  {
    q: 'How do we start a project or schedule an interview?',
    a: 'Send a message through the contact form or email directly to email.rajan001@gmail.com. I respond within 24 hours to schedule an introductory technical discussion.',
  },
  {
    q: 'Production Experience & Project Track Record',
    a: 'Have engineered and shipped 16 production software systems across Learning Management (LMS), Point of Sale (POS), tourism portals, and geospatial data pipelines.',
  },
  {
    q: 'Code Quality, Testing & Security Standards',
    a: 'Strict type safety, cryptographic password hashing, rate limiting, parameterized queries, and optimized server rendering for top Core Web Vitals.',
  },
  {
    q: 'Deployment, CI/CD & Project Handover',
    a: 'Deliver production-ready environments on Linux VPS, Vercel, Docker, or cPanel with complete documentation, database migration scripts, and ongoing support.',
  },
];

export const DEFAULT_PROCESS_STEPS: ProcessStep[] = [
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
];

export const DEFAULT_EDUCATION: EducationItem[] = [
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
];

export const DEFAULT_LANGUAGES: LanguageItem[] = [
  { language: 'English', proficiency: 'Professional Proficiency' },
  { language: 'Nepali', proficiency: 'Native Speaker' },
  { language: 'Hindi', proficiency: 'Fluent' },
];

export const DEFAULT_QUICK_FACTS: QuickFacts = {
  location: 'Kathmandu, Bagmati Prov, Nepal',
  coreStack: 'Next.js / Node.js / PostgreSQL / MongoDB',
  focus: 'Scalable Architecture & Web Systems',
};

export const DEFAULT_MARQUEE_ITEMS: string[] = [
  'NEXT.JS',
  'REACT',
  'TYPESCRIPT',
  'NODE.JS',
  'EXPRESS',
  'POSTGRESQL',
  'MONGODB',
  'TAILWIND CSS',
  'PRISMA',
  'DOCKER',
  'REST APIS',
  'JWT RBAC',
];

export interface PortfolioSettings {
  name: string;
  role: string;
  headline: string;
  heroImpactText?: string;
  quickFacts?: QuickFacts;
  location: string;
  email: string;
  phone: string;
  isAvailableForHire: boolean;
  availabilityBadgeText: string;
  availabilityBadgeDate?: string;
  resumeUrl: string;
  bio: string;
  codeSnippet: string;
  sectionVisibility: SectionVisibility;
  faqs?: FAQItem[];
  processSteps?: ProcessStep[];
  education?: EducationItem[];
  languages?: LanguageItem[];
  marqueeItems?: string[];
}
