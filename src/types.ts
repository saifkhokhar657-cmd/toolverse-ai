export type ToolCategory = 'ai' | 'image' | 'pdf' | 'calculators' | 'text';

export interface ToolItem {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  path: string;
  iconName: string;
  badge?: string;
  metaTitle: string;
  metaDescription: string;
  popular?: boolean;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  category: ToolCategory | 'general';
  readTime: string;
  date: string;
  summary: string;
  relatedToolSlugs: string[];
  sections: {
    heading: string;
    level?: 2 | 3;
    body: string[];
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export interface UserUsage {
  plan: 'guest' | 'free' | 'pro';
  dailyGenerationsUsed: number;
  dailyGenerationsLimit: number;
  lastResetDate: string;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro';
  createdAt: string;
  photoURL?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  plan: 'free' | 'pro';
  createdAt: string;
  updatedAt: string;
}

export interface DailyUsage {
  uid: string;
  date: string; // YYYY-MM-DD
  generationsUsed: number;
  generationsLimit: number;
  updatedAt: string;
}

export interface BookmarkItem {
  id: string;
  uid: string;
  itemId: string;
  itemType: 'tool' | 'article';
  title: string;
  path: string;
  category?: string;
  createdAt: string;
}

export interface SubscriptionRecord {
  uid: string;
  plan: 'free' | 'pro';
  status: 'active' | 'trialing' | 'canceled';
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  updatedAt: string;
}

export interface SiteSettings {
  maintenanceMode: boolean;
  announcementBanner?: {
    enabled: boolean;
    text: string;
    link?: string;
  };
  freeDailyAiLimit: number;
}

export interface SavedItem {
  id: string;
  toolName: string;
  toolPath: string;
  createdAt: string;
  preview: string;
  data: any;
}
