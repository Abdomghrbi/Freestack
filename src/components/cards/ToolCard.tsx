'use client';

import { Tool } from '@/types';
import { ExternalLink, Star, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface ToolCardProps {
  tool: Tool;
  reviewCount?: number;
  avgRating?: number;
  viewMode?: 'grid' | 'list';
}

export default function ToolCard({ tool, reviewCount = 0, avgRating = 0, viewMode = 'grid' }: ToolCardProps) {
  const priceColors = {
    free: 'bg-emerald-100 text-emerald-700',
    paid: 'bg-rose-100 text-rose-700',
    freemium: 'bg-amber-100 text-amber-700',
  };

  const priceLabels = {
    free: 'مجاني',
    paid: 'مدفوع',
    freemium: 'مجاني + مدفوع',
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group flex items-center gap-4 p-4">
        {/* أيقونة */}
        <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center shrink-0">
          <span className="text-2xl">
            {tool.category === 'AI Video' && '🎬'}
            {tool.category === 'AI Chat' && '🤖'}
            {tool.category === 'Design' && '🎨'}
            {tool.category === 'Development' && '💻'}
            {!['AI Video', 'AI Chat', 'Design', 'Development'].includes(tool.category) && '⚡'}
          </span>
        </div>

        {/* المحتوى */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
              {tool.name}
            </h3>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${priceColors[tool.price]}`}>
              {priceLabels[tool.price]}
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-1">{tool.category}</p>
          <p className="text-xs text-slate-600 line-clamp-1">{tool.description}</p>
        </div>

        {/* التقييم */}
        <div className="flex items-center gap-3 text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-slate-700">{avgRating > 0 ? avgRating.toFixed(1) : '-'}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3" />
            <span>{reviewCount}</span>
          </div>
        </div>

        {/* الأزرار */}
        <div className="flex gap-2 shrink-0">
          <Link
            href={`/tools/${tool.id}`}
            className="bg-slate-900 text-white text-xs font-medium py-2 px-4 rounded-lg text-center hover:bg-slate-800 transition-colors"
          >
            التفاصيل
          </Link>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ExternalLink className="w-3 h-3 text-slate-600" />
          </a>
        </div>
      </div>
    );
  }

  // Grid mode
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
      <div className="h-20 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative">
        <span className="text-3xl">
          {tool.category === 'AI Video' && '🎬'}
          {tool.category === 'AI Chat' && '🤖'}
          {tool.category === 'Design' && '🎨'}
          {tool.category === 'Development' && '💻'}
          {!['AI Video', 'AI Chat', 'Design', 'Development'].includes(tool.category) && '⚡'}
        </span>
        <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${priceColors[tool.price]}`}>
          {priceLabels[tool.price]}
        </div>
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
            {tool.name}
          </h3>
        </div>

        <p className="text-xs text-slate-500 mb-1 font-medium">{tool.category}</p>
        <p className="text-xs text-slate-600 mb-2 line-clamp-2 leading-relaxed">
          {tool.description}
        </p>

        <div className="flex items-center gap-3 mb-2 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-slate-700">{avgRating > 0 ? avgRating.toFixed(1) : '-'}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3" />
            <span>{reviewCount}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/tools/${tool.id}`}
            className="flex-1 bg-slate-900 text-white text-xs font-medium py-2 rounded-lg text-center hover:bg-slate-800 transition-colors"
          >
            التفاصيل
          </Link>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ExternalLink className="w-3 h-3 text-slate-600" />
          </a>
        </div>
      </div>
    </div>
  );
}
