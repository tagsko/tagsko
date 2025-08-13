export type Role = 'employee' | 'owner' | 'admin';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  photoURL?: string;
}

export interface Objective {
  id: string;
  title: string;
  description: string;
}

export type MilestoneStatus = 'not-started' | 'in-progress' | 'done';

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  objectiveId?: string;
  status: MilestoneStatus;
  dueDate?: string; // ISO date
}

export interface TimeEntry {
  id: string;
  userId: string;
  date: string; // ISO date
  hours: number; // 0.25 increments recommended
  milestoneId?: string;
  comment?: string;
}

export interface Reflection {
  id: string;
  userId: string;
  createdAt: string; // ISO datetime
  milestoneId?: string;
  text: string;
}

export type DocumentType = 'application' | 'decision' | 'report' | 'other';

export interface ProjectDocument {
  id: string;
  name: string;
  type: DocumentType;
  url: string; // Firebase Storage URL or external
  uploadedAt: string; // ISO datetime
}

export interface Project {
  id: string;
  name: string;
  customer: string;
  budgetHours?: number;
}