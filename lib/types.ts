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
  showMarquee: false,
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

export interface PortfolioSettings {
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
  sectionVisibility: SectionVisibility;
}
