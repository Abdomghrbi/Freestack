'use client';

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const categories = [
  { id: 'all', label: 'الكل', emoji: '📦' },
  { id: 'AI Video', label: 'فيديو AI', emoji: '🎬' },
  { id: 'AI Chat', label: 'محادثة AI', emoji: '🤖' },
  { id: 'Design', label: 'تصميم', emoji: '🎨' },
  { id: 'Development', label: 'تطوير', emoji: '💻' },
  { id: 'Productivity', label: 'إنتاجية', emoji: '⚡' },
];

export default function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onFilterChange(cat.id)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            activeFilter === cat.id
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
          }`}
        >
          <span>{cat.emoji}</span>
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
