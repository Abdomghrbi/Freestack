'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface Suggestion {
  id: string;
  name: string;
  url: string;
  description: string | null;
  category: string | null;
  price: string | null;
  status: string;
  created_at: string;
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function init() {
      try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          setLoading(false);
          return;
        }

        const role = user.user_metadata?.role;
        if (role !== 'admin') {
          setLoading(false);
          return;
        }

        setIsAdmin(true);

        const { data, error: dbError } = await supabase
          .from('suggestions')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        if (dbError) throw dbError;

        setSuggestions(data || []);
      } catch (err: any) {
        console.error('Admin error:', err);
        setError(err?.message || 'حدث خطأ غير متوقع');
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  async function approve(suggestion: Suggestion) {
    try {
      const supabase = createClient();

      const { data: existing } = await supabase
        .from('tools')
        .select('id')
        .eq('url', suggestion.url)
        .single();

      if (existing) {
        alert('هذه الأداة موجودة مسبقاً في الموقع! سيتم رفض الاقتراح.');
        // رفض الاقتراح تلقائياً لأنه مكرر
        await supabase.from('suggestions').update({ status: 'rejected' }).eq('id', suggestion.id);
        setSuggestions((prev) => prev.filter((s) => s.id !== suggestion.id));
        return;
      }

      const { error: insertError } = await supabase.from('tools').insert([{
        name: suggestion.name,
        url: suggestion.url,
        description: suggestion.description,
        category: suggestion.category,
        price: suggestion.price || 'free',
      }]);

      if (insertError) throw insertError;

      await supabase.from('suggestions').update({ status: 'approved' }).eq('id', suggestion.id);

      setSuggestions((prev) => prev.filter((s) => s.id !== suggestion.id));
    } catch (err: any) {
      alert('خطأ: ' + err?.message);
    }
  }

  async function reject(id: string) {
    try {
      const supabase = createClient();
      await supabase.from('suggestions').update({ status: 'rejected' }).eq('id', id);
      setSuggestions((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      alert('خطأ: ' + err?.message);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-400">جاري التحميل...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
          <p className="text-red-500 mb-4">{error}</p>
          <Link href="/" className="text-indigo-600 hover:underline">العودة</Link>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
          <p className="text-2xl mb-2">🛡️</p>
          <h2 className="text-xl font-bold text-slate-900 mb-2">وصول مرفوض</h2>
          <p className="text-slate-500 mb-6">ليس لديك صلاحية الوصول</p>
          <Link href="/" className="bg-slate-900 text-white px-6 py-2 rounded-xl text-sm">العودة</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-900">لوحة المشرف</h1>
          <Link href="/" className="text-sm text-slate-500">← العودة</Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <p className="text-sm text-slate-500 mb-4">اقتراحات معلقة: {suggestions.length}</p>

        {suggestions.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <p className="text-slate-400">لا توجد اقتراحات معلقة ✅</p>
          </div>
        ) : (
          <div className="space-y-3">
            {suggestions.map((s) => (
              <div key={s.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900">{s.name}</h3>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">معلق</span>
                </div>
                <p className="text-xs text-slate-500 mb-1">{s.category || 'بدون تصنيف'}</p>
                <p className="text-sm text-slate-600 mb-3">{s.description || 'بدون وصف'}</p>
                <a href={s.url} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 block mb-3">{s.url}</a>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => approve(s)}
                    className="flex-1 bg-emerald-600 text-white text-sm py-2 rounded-lg hover:bg-emerald-700"
                  >
                    ✅ موافقة
                  </button>
                  <button
                    onClick={() => reject(s.id)}
                    className="flex-1 bg-red-50 text-red-600 border border-red-200 text-sm py-2 rounded-lg hover:bg-red-100"
                  >
                    ❌ رفض
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
