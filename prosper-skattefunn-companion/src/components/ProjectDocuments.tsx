import { useData } from '../contexts/DataContext';
import { formatDateTime } from '../utils/format';
import { FileText } from 'lucide-react';

export default function ProjectDocuments() {
  const { documents } = useData();
  return (
    <div className="space-y-2">
      {documents.map((d) => (
        <a key={d.id} href={d.url} className="flex items-center justify-between rounded border p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-indigo-600"/>
            <span>{d.name}</span>
            <span className="text-xs text-gray-500">({d.type})</span>
          </div>
          <span className="text-xs text-gray-500">{formatDateTime(d.uploadedAt)}</span>
        </a>
      ))}
      {documents.length === 0 && (
        <div className="text-sm text-gray-500">No documents uploaded yet.</div>
      )}
    </div>
  );
}