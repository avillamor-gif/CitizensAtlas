import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Debug endpoint to check what's actually in the database
 * Usage: GET /api/debug/check-reports?status=approved&limit=1
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'approved';
    const limit = parseInt(searchParams.get('limit') || '5');

    const { data, error } = await supabase
      .from('partner_reports')
      .select('id, name, email, photos, relevant_links, status, submitted_at')
      .eq('status', status)
      .order('submitted_at', { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json({
        error: 'Database error',
        details: error.message,
      }, { status: 500 });
    }

    console.log('🔍 DEBUG: Raw database response:', JSON.stringify(data, null, 2));

    return NextResponse.json({
      status: 'success',
      count: data?.length || 0,
      query: { status, limit },
      reports: data?.map(r => ({
        id: r.id,
        name: r.name,
        email: r.email,
        photos: {
          raw: r.photos,
          type: typeof r.photos,
          isArray: Array.isArray(r.photos),
          length: Array.isArray(r.photos) ? r.photos.length : 'N/A',
        },
        relevant_links: {
          raw: r.relevant_links,
          type: typeof r.relevant_links,
          isArray: Array.isArray(r.relevant_links),
          length: Array.isArray(r.relevant_links) ? r.relevant_links.length : 'N/A',
        },
        status: r.status,
        submitted_at: r.submitted_at,
      })) || [],
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({
      error: 'Server error',
      message: String(error),
    }, { status: 500 });
  }
}
