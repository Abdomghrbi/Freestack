'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Tool, Review } from '@/types';
import { Star, ArrowRight, ExternalLink, ThumbsUp, Loader2, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import SimpleCaptcha from '@/components/captcha/SimpleCaptcha';

export default function ToolDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [tool, setTool] = useState<Tool | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [captchaValid, setCaptchaValid] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchToolAndReviews();
  }, [params.id]);

  async function fetchToolAndReviews() {
    try {
      const { data: toolData } = await supabase
        .from('tools')
        .select('*')
        .eq('id', params.id)
        .single();

      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*')
        .eq('tool_id', params.id)
        .order('created_at', { ascending: false });

      setTool(toolData);
      setReviews(reviewsData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!captchaValid) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from('reviews').insert([
        {
          tool_id: params.id,
          rating: reviewForm.rating,
          comment: reviewForm.comment || null,
          user_id: '00000000-0000-0000-0000-000000000000', // anonymous
        },
      ]);

      if (error) throw error;

      setReviewForm({ rating: 5, comment: '' });
      setSubmitted(true);
      fetchToolAndReviews();
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const priceLabels: Record<string, string> = {
    free: 'مجاني',
    paid: 'مدفوع',
    freemium: 'مجاني + مدفوع',
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </main>
    );
  }

  if (!tool) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-400">الأداة غير موجودة</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
            ← العودة للرئيسية
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* معلومات الأداة */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-slate-900">{tool.name}</h1>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
                  {tool.category}
                </span>
              </div>
              <p className="text-slate-500">{tool.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span className="text-xl font-bold text-slate-900">{avgRating > 0 ? avgRating.toFixed(1) : '-'}</span>
              <span className="text-slate-400 text-sm">({reviews.length} تقييم)</span>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
              {priceLabels[tool.price]}
            </span>
          </div>

          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors"
          >
            زيارة الموقع
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* نموذج التقييم */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            أضف تقييمك
          </h2>

          {submitted && (
            <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl mb-4 text-sm">
              ✓ تم إرسال تقييمك بنجاح!
            </div>
          )}

          <form onSubmit={submitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">التقييم</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= reviewForm.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">تعليقك (اختياري)</label>
              <textarea
                rows={3}
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                placeholder="شارك تجربتك مع هاي الأداة..."
              />
            </div>

            <SimpleCaptcha onValidate={setCaptchaValid} />

            <button
              type="submit"
              disabled={!captchaValid || submitting}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'إرسال التقييم'
              )}
            </button>
          </form>
        </div>

        {/* قائمة التقييمات */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            التقييمات ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <p className="text-slate-400 text-center py-8">لا توجد تقييمات بعد. كن الأول!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400">
                      {new Date(review.created_at).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-slate-600 text-sm mb-2">{review.comment}</p>
                  )}
                  <button className="flex items-center gap-1 text-sm text-slate-400 hover:text-indigo-600 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span>مفيدة ({review.helpful_count})</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
