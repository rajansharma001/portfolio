export interface Project {
  id: string;
  slug: string;
  title: string;
  type: 'SaaS' | 'Client' | 'Personal' | 'WordPress';
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

export interface HeroTechChip {
  name: string;
  iconText: string;
  iconColor: string;
}

export interface HeroStat {
  value: string;
  label: string;
  icon: 'calendar' | 'code' | 'server';
  iconColor: string;
}

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
  heroTechChips: HeroTechChip[];
  heroStats: HeroStat[];
  whatIBring: string[];
}
