'use server';

import { createClient } from '@/lib/supabase/server';

export async function getTools() {
  const supabase = await createClient();
  
  const { data: toolsData } = await supabase
    .from('tools')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: reviewsData } = await supabase
    .from('reviews')
    .select('tool_id, rating');

  const toolsWithStats = (toolsData || []).map((tool: any) => {
    const toolReviews = (reviewsData || []).filter((r: any) => r.tool_id === tool.id);
    const reviewCount = toolReviews.length;
    const avgRating = reviewCount > 0
      ? toolReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviewCount
      : 0;
    return { ...tool, reviewCount, avgRating };
  });

  return toolsWithStats;
}
