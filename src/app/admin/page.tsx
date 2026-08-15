'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Tool } from '@/types';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2, Shield, ArrowRight } from 'lucide-react';

interface Suggestion {
  id: string;
  name: string;
  url: string;
  description: string | null;
  category: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setChecking(false);
      return;
    }

    setUser(user);

    // التحقق من الدور
    const role = user.user_metadata?.role;
    if (role === 'admin') {
      setIsAdmin(true);
      fetchSuggestions();
    } else {
      setChecking(false);
      setLoading(false);
    }
  }

  async function fetchSuggestions() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('suggestions')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSuggestions(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setChecking(false);
    }
  }

  async function approveSuggestion(suggestion: Suggestion) {
    setActionLoading(suggestion.id);
    try {
      const supabase = createClient();

      // 1. إضافة الأداة لـ tools
      const { error: insertError } = await supabase.from('tools').insert([
        {
          name: suggestion.name,
          url: suggestion.url,
          description: suggestion.description,
          category: suggestion.category,
          price: 'free',
        },
      ]);

      if (insertError) throw insertError;

      // 2. تحديث حالة الاقتراح
      await supabase
        .from('suggestions')
        .update({ status: 'approved' })
        .eq('id', suggestion.id);

      // 3. إزالة من القائمة
      setSuggestions((prev) => prev.filter((s) => s.id !== suggestion.id));
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الموافقة');
    } finally {
      setActionLoading(null);
    }
  }

  async function rejectSuggestion(id: string) {
    setActionLoading(id);
    try {
      const supabase = createClient();
      await supabase
        .from('suggestions')
        .update({ status: 'rejected' })
        .eq('id', id);

      setSuggestions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الرفض');
    } finally {
      setActionLoading(null);
    }
  }

  // لو عم بيتحقق
  if (checking) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </main>
    );
  }

  // لو مش مسجل دخول
  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
          <Shield className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">تسجيل الدخول مطلوب</h2>
          <p className="text-slate-500 mb-6">يجب تسجيل الدخول للوصول لهذه الصفحة</p>
          <Link
            href="/login?redirect=/admin"
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors"
          >
            تسجيل الدخول
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    );
  }

  // لو مسجل دخول بس مش مشرف
  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
          <Shield className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">وصول مرفوض</h2>
          <p className="text-slate-500 mb-6">ليس لديك صلاحية الوصول لهذه الصفحة</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors"
          >
            العودة للرئيسية
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    );
  }

  // لوحة المشرف
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">لوحة المشرف</h1>
          </div>
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">
            ← العودة للموقع
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
          <p className="text-indigo-700 text-sm">
            👋 مرحباً <strong>{user.email}</strong> | لديك <strong>{suggestions.length}</strong> اقتراح قيد المراجعة
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : suggestions.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">لا توجد اقتراحات معلقة</h2>
            <p className="text-slate-500">جميع الاقتراحات تمت مراجعتها</p>
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{suggestion.name}</h3>
                    <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs mt-1">
                      {suggestion.category || 'بدون تصنيف'}
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                    قيد المراجعة
                  </span>
                </div>

                <p className="text-slate-600 text-sm mb-2">{suggestion.description || 'بدون وصف'}</p>
                <a
                  href={suggestion.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 text-sm hover:underline mb-4 block"
                >
                  {suggestion.url}
                </a>

                <div className="flex gap-2">
                  <button
                    onClick={() => approveSuggestion(suggestion)}
                    disabled={actionLoading === suggestion.id}
                    className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {actionLoading === suggestion.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        موافقة
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => rejectSuggestion(suggestion.id)}
                    disabled={actionLoading === suggestion.id}
                    className="flex-1 bg-red-50 text-red-600 border border-red-200 py-2.5 rounded-xl font-medium hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    رفض
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
