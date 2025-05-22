import { FiTag } from 'react-icons/fi';

/**
 * LabelList displays color-coded labels for chats.
 * You can extend this to fetch and assign labels from Supabase.
 */
export default function LabelList() {
  // Example static labels (replace with dynamic data)
  const labels = [
    { id: 1, name: 'Demo', color: 'bg-yellow-200 text-yellow-800' },
    { id: 2, name: 'Signup', color: 'bg-green-200 text-green-800' },
    { id: 3, name: 'Internal', color: 'bg-blue-200 text-blue-800' },
  ];

  return (
    <div className="mb-2">
      <div className="flex items-center gap-2 mb-1 text-sm font-semibold">
        <FiTag className="text-gray-400" /> Labels
      </div>
      <div className="flex flex-wrap gap-2">
        {labels.map(label => (
          <span
            key={label.id}
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${label.color}`}
          >
            {label.name}
          </span>
        ))}
      </div>
    </div>
  );
}