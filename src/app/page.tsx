'use client';

import { useEffect, useState } from 'react';
import { getTools } from './actions';
import { createClient } from '@/lib/supabase/client';
import { Tool } from '@/types';
import ToolCard from '@/components/cards/ToolCard';
import FilterBar from '@/components/FilterBar';
import { LogOut, Search, Zap, Plus } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await createClient().auth.getUser();
      setUser(user);
    }
    getUser();
  }, []);

  async function handleLogout() {
    await createClient().auth.signOut();
    setUser(null);
    window.location.reload();
  }

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
      const toolsWithStats = await getTools();
      setTools(toolsWithStats);
      setFilteredTools(toolsWithStats);
    } catch (err) {
      console.error('Error fetching tools:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
    
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
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 hidden sm:inline">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-slate-600 hover:text-red-600 px-3 py-2 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">خروج</span>
                </button>
                <Link
                  href="/submit"
                  className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">اقترح أداة</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-sm text-slate-600 hover:text-slate-900 font-medium px-3 py-2"
                >
                  دخول
                </Link>
                <Link
                  href="/submit"
                  className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">اقترح أداة</span>
                </Link>
              </div>
            )}
          </div>

          
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

    
      <div className="max-w-6xl mx-auto px-4 py-6">
      
        <div className="mb-6">
          <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        </div>

      
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">
            {filteredTools.length} أداة {activeFilter !== 'all' && `في "${activeFilter}"`}
          </p>
        </div>

      
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
              <ToolCard
                key={tool.id}
                tool={tool}
                reviewCount={(tool as any).reviewCount || 0}
                avgRating={(tool as any).avgRating || 0}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
