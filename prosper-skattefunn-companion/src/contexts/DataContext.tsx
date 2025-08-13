import { createContext, useContext, useMemo, useState } from 'react';
import type { Milestone, Objective, Project, ProjectDocument, Reflection, TimeEntry } from '../types';
import { mockDocuments, mockEntries, mockMilestones, mockObjectives, mockProject } from '../mock/data';

interface DataContextValue {
  project: Project;
  objectives: Objective[];
  milestones: Milestone[];
  entries: TimeEntry[];
  reflections: Reflection[];
  documents: ProjectDocument[];

  addEntry: (entry: Omit<TimeEntry, 'id'>) => void;
  addReflection: (reflection: Omit<Reflection, 'id' | 'createdAt'>) => void;
  updateMilestoneStatus: (milestoneId: string, status: Milestone['status']) => void;
  addDocument: (doc: Omit<ProjectDocument, 'id' | 'uploadedAt'>) => void;
  addObjective: (obj: Omit<Objective, 'id'>) => void;
  updateObjective: (obj: Objective) => void;
  deleteObjective: (id: string) => void;
  addMilestone: (ms: Omit<Milestone, 'id' | 'status'> & { status?: Milestone['status'] }) => void;
  updateMilestone: (ms: Milestone) => void;
  deleteMilestone: (id: string) => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

function generateId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [project] = useState<Project>(mockProject);
  const [objectives, setObjectives] = useState<Objective[]>(mockObjectives);
  const [milestones, setMilestones] = useState<Milestone[]>(mockMilestones);
  const [entries, setEntries] = useState<TimeEntry[]>(mockEntries);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [documents, setDocuments] = useState<ProjectDocument[]>(mockDocuments);

  const value = useMemo<DataContextValue>(() => ({
    project,
    objectives,
    milestones,
    entries,
    reflections,
    documents,

    addEntry(entry) {
      setEntries((prev) => [{ id: generateId('t'), ...entry }, ...prev]);
    },
    addReflection(ref) {
      setReflections((prev) => [{ id: generateId('r'), createdAt: new Date().toISOString(), ...ref }, ...prev]);
    },
    updateMilestoneStatus(milestoneId, status) {
      setMilestones((prev) => prev.map((m) => (m.id === milestoneId ? { ...m, status } : m)));
    },
    addDocument(doc) {
      setDocuments((prev) => [{ id: generateId('d'), uploadedAt: new Date().toISOString(), ...doc }, ...prev]);
    },
    addObjective(obj) {
      setObjectives((prev) => [...prev, { id: generateId('o'), ...obj }]);
    },
    updateObjective(obj) {
      setObjectives((prev) => prev.map((o) => (o.id === obj.id ? obj : o)));
    },
    deleteObjective(id) {
      setObjectives((prev) => prev.filter((o) => o.id !== id));
      setMilestones((prev) => prev.map((m) => (m.objectiveId === id ? { ...m, objectiveId: undefined } : m)));
    },
    addMilestone(ms) {
      setMilestones((prev) => [...prev, { id: generateId('m'), status: ms.status ?? 'not-started', ...ms }]);
    },
    updateMilestone(ms) {
      setMilestones((prev) => prev.map((m) => (m.id === ms.id ? ms : m)));
    },
    deleteMilestone(id) {
      setMilestones((prev) => prev.filter((m) => m.id !== id));
    },
  }), [project, objectives, milestones, entries, reflections, documents]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}