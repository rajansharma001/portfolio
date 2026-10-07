export interface Project {
  id: string;
  slug: string;
  title: string;
  type: string;
  tagline: string;
  impact: string;
  description: string;
  thumbnail?: string;
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

// -------------------------------------------------------------
// Planner & Productivity Suite Types (Mobile-First Life Tracking)
// -------------------------------------------------------------

export interface SubtaskItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'completed' | 'cancelled';
  category: string;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  subtasks: SubtaskItem[];
  estimatedMinutes?: number;
  actualMinutes?: number;
  recurring: 'none' | 'daily' | 'weekdays' | 'weekly';
  completedAt?: string;
  completedDates?: string[]; // per-day completion for recurring tasks (YYYY-MM-DD)
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface HabitItem {
  id: string;
  title: string;
  emoji: string;
  category: string;
  targetDaysPerWeek: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime';
  completedDates: string[]; // ['YYYY-MM-DD', ...]
  currentStreak: number;
  bestStreak: number;
  archived: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleBlock {
  id: string;
  title: string;
  startTime: string; // HH:mm (e.g. "07:00")
  endTime: string; // HH:mm (e.g. "08:30")
  type: 'deep_work' | 'client_meeting' | 'routine' | 'learning' | 'exercise' | 'break' | 'admin';
  description?: string;
  daysOfWeek: number[]; // 0=Sun, 1=Mon, ..., 6=Sat (empty or [0..6] for daily)
  specificDate?: string; // YYYY-MM-DD
  completedDates: string[]; // ['YYYY-MM-DD']
  color: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuickNote {
  id: string;
  title: string;
  content: string;
  category: string;
  pinned: boolean;
  color: 'default' | 'blue' | 'emerald' | 'amber' | 'purple' | 'rose';
  tags: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface DailySummaryStats {
  date: string;
  tasksTotal: number;
  tasksCompleted: number;
  tasksDueToday: number;
  habitsTotal: number;
  habitsCompletedToday: number;
  completionScore: number; // 0-100%
  activeScheduleBlock?: ScheduleBlock | null;
  nextScheduleBlock?: ScheduleBlock | null;
}

export const DEFAULT_HABITS: Omit<HabitItem, 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'habit-1',
    title: 'Deep Coding & Architecture',
    emoji: '💻',
    category: 'Engineering',
    targetDaysPerWeek: 7,
    timeOfDay: 'morning',
    completedDates: [],
    currentStreak: 0,
    bestStreak: 0,
    archived: false,
    order: 1,
  },
  {
    id: 'habit-2',
    title: 'Physical Workout / Gym',
    emoji: '🏋️',
    category: 'Fitness',
    targetDaysPerWeek: 5,
    timeOfDay: 'morning',
    completedDates: [],
    currentStreak: 0,
    bestStreak: 0,
    archived: false,
    order: 2,
  },
  {
    id: 'habit-3',
    title: 'Read Tech Docs / System Design',
    emoji: '📖',
    category: 'Learning',
    targetDaysPerWeek: 6,
    timeOfDay: 'evening',
    completedDates: [],
    currentStreak: 0,
    bestStreak: 0,
    archived: false,
    order: 3,
  },
  {
    id: 'habit-4',
    title: 'Drink 3L Clean Water',
    emoji: '💧',
    category: 'Health',
    targetDaysPerWeek: 7,
    timeOfDay: 'anytime',
    completedDates: [],
    currentStreak: 0,
    bestStreak: 0,
    archived: false,
    order: 4,
  },
  {
    id: 'habit-5',
    title: 'Japanese N5 Language Practice',
    emoji: '🇯🇵',
    category: 'Learning',
    targetDaysPerWeek: 5,
    timeOfDay: 'afternoon',
    completedDates: [],
    currentStreak: 0,
    bestStreak: 0,
    archived: false,
    order: 5,
  },
  {
    id: 'habit-6',
    title: '8 Hours Quality Rest & Sleep',
    emoji: '💤',
    category: 'Health',
    targetDaysPerWeek: 7,
    timeOfDay: 'evening',
    completedDates: [],
    currentStreak: 0,
    bestStreak: 0,
    archived: false,
    order: 6,
  },
];

export const DEFAULT_SCHEDULE_BLOCKS: Omit<ScheduleBlock, 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'sched-1',
    title: 'Morning Routine & Fitness',
    startTime: '06:30',
    endTime: '08:00',
    type: 'exercise',
    description: 'Hydration, gym workout, stretching & breakfast',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    completedDates: [],
    color: '#10b981',
    order: 1,
  },
  {
    id: 'sched-2',
    title: 'Daily Planning & Inbound Review',
    startTime: '08:00',
    endTime: '09:00',
    type: 'admin',
    description: 'Check CRM leads, client messages, review today tasks',
    daysOfWeek: [1, 2, 3, 4, 5],
    completedDates: [],
    color: '#3b82f6',
    order: 2,
  },
  {
    id: 'sched-3',
    title: 'Deep Engineering Work Block 1',
    startTime: '09:00',
    endTime: '13:00',
    type: 'deep_work',
    description: 'High-focus programming, full-stack systems, core feature implementation',
    daysOfWeek: [1, 2, 3, 4, 5, 6],
    completedDates: [],
    color: '#6366f1',
    order: 3,
  },
  {
    id: 'sched-4',
    title: 'Lunch & Rest Recharge',
    startTime: '13:00',
    endTime: '14:00',
    type: 'break',
    description: 'Healthy meal, walk, disconnect from screens',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    completedDates: [],
    color: '#84cc16',
    order: 4,
  },
  {
    id: 'sched-5',
    title: 'Deep Work Block 2 & Client Deliverables',
    startTime: '14:00',
    endTime: '18:00',
    type: 'deep_work',
    description: 'API development, debugging, testing, deployment & client reviews',
    daysOfWeek: [1, 2, 3, 4, 5],
    completedDates: [],
    color: '#06b6d4',
    order: 5,
  },
  {
    id: 'sched-6',
    title: 'Skill Upgrade / Language Study',
    startTime: '18:30',
    endTime: '20:00',
    type: 'learning',
    description: 'Japanese study, new frameworks, reading technical blogs',
    daysOfWeek: [1, 2, 3, 4, 5],
    completedDates: [],
    color: '#ec4899',
    order: 6,
  },
  {
    id: 'sched-7',
    title: 'Evening Wind-down & Daily Retrospective',
    startTime: '21:30',
    endTime: '22:30',
    type: 'routine',
    description: 'Reflect on habits, journal notes, plan tomorrow',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    completedDates: [],
    color: '#a855f7',
    order: 7,
  },
];

