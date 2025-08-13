import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { formatDate } from '../utils/format';
import ProjectDocuments from '../components/ProjectDocuments';

export default function Dashboard() {
  const { user } = useAuth();
  const { project, milestones, entries, reflections } = useData();

  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);
  const budget = project.budgetHours ?? 0;
  const budgetPct = budget > 0 ? Math.min(totalHours / budget, 1) : 0;

  const myEntries = useMemo(() => entries.filter((e) => e.userId === user?.id), [entries, user?.id]);

  return (
    <div className="mx-auto max-w-5xl p-4 space-y-6">
      <section className="rounded-lg border p-4 bg-white dark:bg-gray-900">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-xl font-semibold">{project.name}</h2>
            <p className="text-sm text-gray-500">Customer: {project.customer}</p>
          </div>
          {project.budgetHours && (
            <div className="w-full sm:w-64">
              <div className="text-sm mb-1">Budget usage: {totalHours}/{project.budgetHours} h</div>
              <div className="h-2 w-full rounded bg-gray-200 dark:bg-gray-800 overflow-hidden">
                <div className="h-full bg-indigo-600" style={{ width: `${budgetPct * 100}%` }} />
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 rounded-lg border p-4 bg-white dark:bg-gray-900">
          <h3 className="font-medium mb-3">Milestones</h3>
          <div className="flex flex-wrap gap-2">
            {milestones.map((m) => (
              <span key={m.id} className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${m.status === 'done' ? 'bg-green-50 border-green-200 text-green-700' : m.status === 'in-progress' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                {m.title}
                <span className="opacity-70">({m.status.replace('-', ' ')})</span>
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-lg border p-4 bg-white dark:bg-gray-900">
          <h3 className="font-medium mb-3">Your latest entries</h3>
          <div className="space-y-2">
            {myEntries.slice(0, 5).map((e) => (
              <div key={e.id} className="text-sm flex items-center justify-between">
                <span>{formatDate(e.date)}</span>
                <span className="font-medium">{e.hours} h</span>
              </div>
            ))}
            {myEntries.length === 0 && <div className="text-sm text-gray-500">No entries yet.</div>}
          </div>
        </div>
      </section>

      <section className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-lg border p-4 bg-white dark:bg-gray-900">
          <h3 className="font-medium mb-3">Latest reflections</h3>
          <div className="space-y-2">
            {reflections.slice(0, 5).map((r) => (
              <div key={r.id} className="text-sm">
                <div className="text-gray-500">{new Date(r.createdAt).toLocaleString()}</div>
                <div>{r.text}</div>
              </div>
            ))}
            {reflections.length === 0 && <div className="text-sm text-gray-500">No reflections yet.</div>}
          </div>
        </div>
        <div className="rounded-lg border p-4 bg-white dark:bg-gray-900">
          <h3 className="font-medium mb-3">Documents</h3>
          <ProjectDocuments />
        </div>
      </section>
    </div>
  );
}