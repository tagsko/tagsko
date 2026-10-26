import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

const schema = z.object({
  milestoneId: z.string().optional(),
  text: z.string().min(5, 'Please write a bit more.').max(2000),
});

type FormValues = z.infer<typeof schema>;

export default function Reflections() {
  const { user } = useAuth();
  const { milestones, reflections, addReflection } = useData();
  const options = useMemo(() => milestones.map((m) => ({ value: m.id, label: m.title })), [milestones]);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { milestoneId: undefined, text: '' },
  });

  async function onSubmit(values: FormValues) {
    if (!user) return;
    addReflection({ userId: user.id, ...values });
    reset();
  }

  return (
    <div className="mx-auto max-w-3xl p-4 grid gap-6 sm:grid-cols-2">
      <div>
        <h2 className="text-lg font-semibold mb-4">Add Reflection</h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm mb-1">Milestone (optional)</label>
            <select className="w-full rounded border p-2" {...register('milestoneId')}>
              <option value="">General</option>
              {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Reflection</label>
            <textarea rows={6} className="w-full rounded border p-2" {...register('text')} />
            {errors.text && <p className="text-sm text-red-600">{errors.text.message}</p>}
          </div>
          <button type="submit" className="w-full rounded bg-indigo-600 text-white py-2 disabled:opacity-50" disabled={isSubmitting || !user}>
            {isSubmitting ? 'Saving…' : 'Save Reflection'}
          </button>
        </form>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4">Latest Reflections</h2>
        <div className="space-y-3">
          {reflections.map((r) => (
            <div key={r.id} className="rounded border p-3">
              <div className="text-xs text-gray-500 mb-1">{new Date(r.createdAt).toLocaleString()}</div>
              <div className="text-sm whitespace-pre-wrap">{r.text}</div>
            </div>
          ))}
          {reflections.length === 0 && <div className="text-sm text-gray-500">No reflections yet.</div>}
        </div>
      </div>
    </div>
  );
}