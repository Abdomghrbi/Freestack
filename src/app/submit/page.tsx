'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { ArrowRight, CheckCircle, Loader2, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SubmitPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    category: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setCheckingAuth(false);
    }
    checkUser();
  }, []);

  const categories = [
    'AI Video',
    'AI Chat',
    'Design',
    'Development',
    'Productivity',
    'Writing',
    'Other',
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('suggestions')
        .insert([
          {
            name: formData.name,
            url: formData.url,
            category: formData.category,
            description: formData.description,
            user_id: user?.id || null,
          },
        ]);

      if (insertError) throw insertError;

      setSuccess(true);
      setFormData({ name: '', url: '', category: '', description: '' });
    } catch (err: any) {
      setError(err.message || 'حدث خطأ، حاول مرة أخرى');
    } finally {
      setLoading(false);
    }
  }

  // لو عم بيتحقق من الـ auth
  if (checkingAuth) {
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
          <Lock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">تسجيل الدخول مطلوب</h2>
          <p className="text-slate-500 mb-6">يجب تسجيل الدخول لإضافة أدوات جديدة للمجتمع</p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/login"
              className="bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors"
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/"
              className="px-6 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
            >
              العودة
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // لو نجح الإرسال
  if (success) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">تم الإرسال!</h2>
          <p className="text-slate-500 mb-6">شكراً لاقتراحك. رح نراجع الأداة ونضيفها قريباً.</p>
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

  // الفورم العادي
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
            ← العودة
          </Link>
          <span className="text-sm text-slate-400">{user.email}</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">اقترح أداة جديدة</h1>
          <p className="text-slate-500 mb-8">شارك أداة مجانية استفدت منها مع المجتمع</p>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">اسم الأداة</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="مثال: Kling AI"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">رابط الموقع</label>
              <input
                type="url"
                required
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">التصنيف</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">اختر تصنيف...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">وصف مختصر</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                placeholder="شو بتسوي هاي الأداة؟"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                'إرسال الاقتراح'
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
