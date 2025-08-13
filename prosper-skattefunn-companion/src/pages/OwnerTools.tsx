import { useMemo, useState } from 'react';
import { useData } from '../contexts/DataContext';

export default function OwnerTools() {
  const { milestones, updateMilestoneStatus, reflections } = useData();
  const [report, setReport] = useState<string>('');

  const grouped = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const r of reflections) {
      const key = r.milestoneId ?? 'general';
      if (!map[key]) map[key] = [];
      map[key].push(r.text);
    }
    return map;
  }, [reflections]);

  function generateReport() {
    const lines: string[] = [];
    for (const [milestoneId, texts] of Object.entries(grouped)) {
      lines.push(`# ${milestoneId === 'general' ? 'General Reflections' : `Milestone ${milestoneId}`}`);
      lines.push('');
      for (const t of texts) lines.push(`- ${t}`);
      lines.push('');
    }
    setReport(lines.join('\n'));
  }

  return (
    <div className="mx-auto max-w-5xl p-4 space-y-6">
      <section className="rounded border p-4 bg-white dark:bg-gray-900">
        <h2 className="text-lg font-semibold mb-3">Milestone Status</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {milestones.map((m) => (
            <div key={m.id} className="rounded border p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{m.title}</div>
                <div className="text-xs text-gray-500">Status: {m.status}</div>
              </div>
              <div className="flex gap-2">
                {(['not-started', 'in-progress', 'done'] as const).map((s) => (
                  <button key={s} onClick={() => updateMilestoneStatus(m.id, s)} className={`rounded px-2 py-1 text-xs border ${m.status === s ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded border p-4 bg-white dark:bg-gray-900">
        <h2 className="text-lg font-semibold mb-3">Auto-generate Report Draft</h2>
        <div className="flex gap-2 mb-2">
          <button onClick={generateReport} className="rounded bg-indigo-600 text-white px-3 py-1">Generate</button>
        </div>
        <textarea className="w-full h-64 rounded border p-2 font-mono text-sm" value={report} onChange={(e) => setReport(e.target.value)} />
      </section>
    </div>
  );
}