import { useEffect, useState } from 'react';
import { useData } from '../contexts/DataContext';
import type { Milestone, Objective } from '../types';
import { getFirebaseServices, isFirebaseConfigured } from '../services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function AdminPanel() {
  const { objectives, milestones, addObjective, updateObjective, deleteObjective, addMilestone, updateMilestone, deleteMilestone, addDocument } = useData();

  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'application' | 'decision' | 'report' | 'other'>('other');
  const [uploading, setUploading] = useState(false);
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    setFirebaseReady(isFirebaseConfigured());
  }, []);

  async function handleUpload() {
    if (!file) return;
    if (!firebaseReady) {
      // Mock fallback
      addDocument({ name: file.name, type: fileType, url: '#' });
      setFile(null);
      return;
    }
    const services = getFirebaseServices();
    if (!services) return;
    setUploading(true);
    try {
      const storageRef = ref(services.storage, `documents/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      addDocument({ name: file.name, type: fileType, url });
      setFile(null);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-4 space-y-8">
      <section className="rounded border p-4 bg-white dark:bg-gray-900">
        <h2 className="text-lg font-semibold mb-3">Upload PDF {firebaseReady ? '' : '(Mock)'}</h2>
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="rounded border p-2 flex-1" />
          <select value={fileType} onChange={(e) => setFileType(e.target.value as any)} className="rounded border p-2">
            <option value="application">Application</option>
            <option value="decision">Decision</option>
            <option value="report">Report</option>
            <option value="other">Other</option>
          </select>
          <button onClick={handleUpload} disabled={!file || uploading} className="rounded bg-indigo-600 text-white px-3 py-2 disabled:opacity-50">{uploading ? 'Uploading…' : 'Upload'}</button>
        </div>
      </section>

      <section className="rounded border p-4 bg-white dark:bg-gray-900">
        <h2 className="text-lg font-semibold mb-3">Objectives</h2>
        <ObjectiveList objectives={objectives} onCreate={(o) => addObjective(o)} onUpdate={updateObjective} onDelete={deleteObjective} />
      </section>

      <section className="rounded border p-4 bg-white dark:bg-gray-900">
        <h2 className="text-lg font-semibold mb-3">Milestones</h2>
        <MilestoneList milestones={milestones} onCreate={(m) => addMilestone(m)} onUpdate={updateMilestone} onDelete={deleteMilestone} />
      </section>
    </div>
  );
}

function ObjectiveList({ objectives, onCreate, onUpdate, onDelete }: {
  objectives: Objective[];
  onCreate: (o: Omit<Objective, 'id'>) => void;
  onUpdate: (o: Objective) => void;
  onDelete: (id: string) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <input className="rounded border p-2 flex-1" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="rounded border p-2 flex-[2]" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button onClick={() => { if (title) { onCreate({ title, description }); setTitle(''); setDescription(''); } }} className="rounded bg-indigo-600 text-white px-3 py-2">Add</button>
      </div>
      <div className="space-y-2">
        {objectives.map((o) => (
          <div key={o.id} className="grid sm:grid-cols-3 gap-2 items-center">
            <input className="rounded border p-2" value={o.title} onChange={(e) => onUpdate({ ...o, title: e.target.value })} />
            <input className="rounded border p-2 sm:col-span-2" value={o.description} onChange={(e) => onUpdate({ ...o, description: e.target.value })} />
            <button onClick={() => onDelete(o.id)} className="text-red-600 text-sm">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function MilestoneList({ milestones, onCreate, onUpdate, onDelete }: {
  milestones: Milestone[];
  onCreate: (m: Omit<Milestone, 'id' | 'status'> & { status?: Milestone['status'] }) => void;
  onUpdate: (m: Milestone) => void;
  onDelete: (id: string) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [objectiveId, setObjectiveId] = useState('');

  return (
    <div className="space-y-3">
      <div className="grid sm:grid-cols-3 gap-2 items-center">
        <input className="rounded border p-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="rounded border p-2" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input className="rounded border p-2" placeholder="Objective ID (optional)" value={objectiveId} onChange={(e) => setObjectiveId(e.target.value)} />
        <button onClick={() => { if (title) { onCreate({ title, description, objectiveId: objectiveId || undefined }); setTitle(''); setDescription(''); setObjectiveId(''); } }} className="rounded bg-indigo-600 text-white px-3 py-2">Add</button>
      </div>
      <div className="space-y-2">
        {milestones.map((m) => (
          <div key={m.id} className="grid sm:grid-cols-4 gap-2 items-center">
            <input className="rounded border p-2" value={m.title} onChange={(e) => onUpdate({ ...m, title: e.target.value })} />
            <input className="rounded border p-2" value={m.description ?? ''} onChange={(e) => onUpdate({ ...m, description: e.target.value })} />
            <input className="rounded border p-2" value={m.objectiveId ?? ''} onChange={(e) => onUpdate({ ...m, objectiveId: e.target.value || undefined })} />
            <div className="flex gap-2 flex-wrap">
              {(['not-started', 'in-progress', 'done'] as const).map((s) => (
                <button key={s} className={`rounded px-2 py-1 text-xs border ${m.status === s ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white'}`} onClick={() => onUpdate({ ...m, status: s })}>{s}</button>
              ))}
              <button onClick={() => onDelete(m.id)} className="text-red-600 text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}