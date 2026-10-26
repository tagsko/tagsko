import { useMemo } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

const schema = z.object({
  date: z.string().min(1, 'Date is required'),
  hours: z.coerce.number().min(0.25).max(24),
  milestoneId: z.string().optional(),
  comment: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof schema>;

export default function LogTimeForm() {
  const { user } = useAuth();
  const { milestones, addEntry } = useData();

  const options = useMemo(() => milestones.map((m) => ({ value: m.id, label: m.title })), [milestones]);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<FormValues>,
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      hours: 1,
      milestoneId: undefined,
      comment: '',
    },
  });

  async function onSubmit(values: FormValues) {
    if (!user) return;
    addEntry({ userId: user.id, ...values });
    reset();
    alert('Time entry saved (mock)');
  }

  return (
    <div className="mx-auto max-w-md p-4">
      <h2 className="text-lg font-semibold mb-4">Log Time</h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-sm mb-1">Date</label>
          <input type="date" className="w-full rounded border p-2" {...register('date')} />
          {errors.date && <p className="text-sm text-red-600">{errors.date.message}</p>}
        </div>
        <div>
          <label className="block text-sm mb-1">Hours</label>
          <input type="number" step="0.25" min="0.25" max="24" className="w-full rounded border p-2" {...register('hours', { valueAsNumber: true })} />
          {errors.hours && <p className="text-sm text-red-600">{errors.hours.message}</p>}
        </div>
        <div>
          <label className="block text-sm mb-1">Milestone (optional)</label>
          <select className="w-full rounded border p-2" {...register('milestoneId')}>
            <option value="">—</option>
            {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Comment (optional)</label>
          <textarea rows={3} className="w-full rounded border p-2" {...register('comment')} />
          {errors.comment && <p className="text-sm text-red-600">{errors.comment.message}</p>}
        </div>
        <button type="submit" className="w-full rounded bg-indigo-600 text-white py-2 disabled:opacity-50" disabled={isSubmitting || !user}>
          {isSubmitting ? 'Saving…' : 'Save Entry'}
        </button>
      </form>
    </div>
  );
}