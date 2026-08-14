'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Tool } from '@/types';
import ToolCard from '@/components/cards/ToolCard';
import FilterBar from '@/components/FilterBar';
import { Search, Zap, Plus } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTools();
  }, []);

  useEffect(() => {
    let result = tools;

    if (activeFilter !== 'all') {
      result = result.filter((t) => t.category === activeFilter);
    }

    if (searchQuery.trim()) {
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTools(result);
  }, [activeFilter, searchQuery, tools]);

  async function fetchTools() {
    try {
      const supabaseClient = createClient();
   const { data, error } = await supabaseClient
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTools(data || []);
      setFilteredTools(data || []);
    } catch (err) {
      console.error('Error fetching tools:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">FreeStack</h1>
                <p className="text-xs text-slate-500">أدوات مجانية مجتمعية</p>
              </div>
            </div>
            <Link
              href="/submit"
              className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">اقترح أداة</span>
            </Link>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="ابحث عن أداة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 bg-slate-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Filter */}
        <div className="mb-6">
          <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">
            {filteredTools.length} أداة {activeFilter !== 'all' && `في "${activeFilter}"`}
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />
            ))}
          </div>
        ) : filteredTools.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">لا توجد أدوات مطابقة</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
