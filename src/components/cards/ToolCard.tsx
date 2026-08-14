'use client';

import { Tool } from '@/types';
import { ExternalLink, Star, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface ToolCardProps {
  tool: Tool;
  reviewCount?: number;
  avgRating?: number;
}

export default function ToolCard({ tool, reviewCount = 0, avgRating = 0 }: ToolCardProps) {
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

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* صورة/أيقونة */}
      <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative">
        <span className="text-4xl">
          {tool.category === 'AI Video' && '🎬'}
          {tool.category === 'AI Chat' && '🤖'}
          {tool.category === 'Design' && '🎨'}
          {tool.category === 'Development' && '💻'}
          {!['AI Video', 'AI Chat', 'Design', 'Development'].includes(tool.category) && '⚡'}
        </span>
        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold ${priceColors[tool.price]}`}>
          {priceLabels[tool.price]}
        </div>
      </div>

      {/* المحتوى */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            {tool.name}
          </h3>
        </div>

        <p className="text-sm text-slate-500 mb-1 font-medium">{tool.category}</p>
        
        <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
          {tool.description}
        </p>

        {/* التقييم */}
        <div className="flex items-center gap-4 mb-4 text-sm text-slate-500">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-slate-700">{avgRating > 0 ? avgRating.toFixed(1) : '-'}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{reviewCount} تقييم</span>
          </div>
        </div>

        {/* الأزرار */}
        <div className="flex gap-2">
          <Link
            href={`/tools/${tool.id}`}
            className="flex-1 bg-slate-900 text-white text-sm font-medium py-2.5 rounded-xl text-center hover:bg-slate-800 transition-colors"
          >
            التفاصيل
          </Link>
          <a
            href={tool.id}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-slate-600" />
          </a>
        </div>
      </div>
    </div>
  );
}
