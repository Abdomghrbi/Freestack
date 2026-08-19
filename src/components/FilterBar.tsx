'use client';

import { LayoutGrid, Video, Bot, Palette, Code, Zap } from 'lucide-react';

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const categories = [
  { id: 'all', label: 'الكل', icon: LayoutGrid },
  { id: 'AI Video', label: 'فيديو AI', icon: Video },
  { id: 'AI Chat', label: 'محادثة AI', icon: Bot },
  { id: 'Design', label: 'تصميم', icon: Palette },
  { id: 'Development', label: 'تطوير', icon: Code },
  { id: 'Productivity', label: 'إنتاجية', icon: Zap },
];

export default function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => {
        const Icon = cat.icon;
        return (
          <button
            key={cat.id}
            onClick={() => onFilterChange(cat.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeFilter === cat.id
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
