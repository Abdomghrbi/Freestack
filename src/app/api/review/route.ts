import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
             req.headers.get('x-real-ip') || 
             'unknown'
  
  const body = await req.json()
  
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
  
  const { data: existing } = await supabase
    .from('reviews')
    .select('id')
    .eq('tool_id', body.tool_id)
    .or(`ip_address.eq.${ip},visitor_id.eq.${body.visitor_id}`)
    .maybeSingle()
    
  if (existing) {
    return NextResponse.json(
      { error: 'لقد قيّمت هذه الأداة مسبقاً' }, 
      { status: 409 }
    )
  }
  
  const { error } = await supabase.from('reviews').insert({
    tool_id: body.tool_id,
    rating: body.rating,
    comment: body.comment,
    user_id: null,
    visitor_id: body.visitor_id,
    ip_address: ip,
  })
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ success: true })
}
