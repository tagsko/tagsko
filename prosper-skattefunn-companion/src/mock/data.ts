import type { AppUser, DocumentType, Milestone, Objective, Project, ProjectDocument, Reflection, Role, TimeEntry } from '../types';
import { addDays, formatISO } from 'date-fns';

export const mockUsers: AppUser[] = [
  { id: 'u1', name: 'Eva Employee', email: 'eva@example.com', role: 'employee' },
  { id: 'u2', name: 'Ola Owner', email: 'ola@example.com', role: 'owner' },
  { id: 'u3', name: 'Anna Admin', email: 'anna@example.com', role: 'admin' },
];

export const mockProject: Project = {
  id: 'p1',
  name: 'SkatteFUNN AI Assistant',
  customer: 'Prosper',
  budgetHours: 600,
};

export const mockObjectives: Objective[] = [
  { id: 'o1', title: 'Automate Time Tracking', description: 'Reduce manual time tracking overhead.' },
  { id: 'o2', title: 'Improve Reporting', description: 'Generate accurate SkatteFUNN reports.' },
];

export const mockMilestones: Milestone[] = [
  { id: 'm1', title: 'MVP', description: 'Initial MVP ready', objectiveId: 'o1', status: 'in-progress', dueDate: formatISO(addDays(new Date(), 30), { representation: 'date' }) },
  { id: 'm2', title: 'Report Draft', description: 'Auto-generated draft', objectiveId: 'o2', status: 'not-started', dueDate: formatISO(addDays(new Date(), 60), { representation: 'date' }) },
  { id: 'm3', title: 'V1 Release', description: 'Public release', objectiveId: 'o1', status: 'not-started', dueDate: formatISO(addDays(new Date(), 90), { representation: 'date' }) },
];

export const mockEntries: TimeEntry[] = [
  { id: 't1', userId: 'u1', date: formatISO(addDays(new Date(), -2), { representation: 'date' }), hours: 4, milestoneId: 'm1', comment: 'Implemented forms' },
  { id: 't2', userId: 'u1', date: formatISO(addDays(new Date(), -1), { representation: 'date' }), hours: 6, milestoneId: 'm1', comment: 'Validation and UI' },
  { id: 't3', userId: 'u2', date: formatISO(addDays(new Date(), -1), { representation: 'date' }), hours: 2, milestoneId: 'm2', comment: 'Planning report draft' },
];

export const mockReflections: Reflection[] = [
  { id: 'r1', userId: 'u2', createdAt: new Date().toISOString(), milestoneId: 'm1', text: 'Good progress this week, MVP shaping up.' },
  { id: 'r2', userId: 'u2', createdAt: new Date().toISOString(), text: 'Risk: Integration delays with external systems.' },
];

export const mockDocuments: ProjectDocument[] = [
  { id: 'd1', name: 'Application.pdf', type: 'application', url: '#', uploadedAt: new Date().toISOString() },
  { id: 'd2', name: 'Decision.pdf', type: 'decision', url: '#', uploadedAt: new Date().toISOString() },
];

export const documentTypeLabel: Record<DocumentType, string> = {
  application: 'Application',
  decision: 'Decision Letter',
  report: 'Report',
  other: 'Other',
};

export function roleLabel(role: Role): string {
  return role === 'employee' ? 'Employee' : role === 'owner' ? 'Project Owner' : 'Prosper Admin';
}