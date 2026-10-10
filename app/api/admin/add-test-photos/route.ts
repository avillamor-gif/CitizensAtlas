import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST endpoint to add sample photos to an approved report for testing
 * Usage: POST /api/admin/add-test-photos
 */
export async function POST(request: NextRequest) {
  try {
    // Sample photo URLs from Unsplash (high quality, free images)
    const photoUrls = [
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1532996122724-8f3c2cd83c5d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=800&h=600&fit=crop',
    ];

    // Update first approved report with photos
    const { data, error } = await supabase
      .from('partner_reports')
      .update({ photos: photoUrls })
      .eq('status', 'approved')
      .limit(1)
      .select();

    if (error) {
      console.error('❌ Error updating report:', error);
      return NextResponse.json(
        { error: 'Failed to update report', details: error.message },
        { status: 500 }
      );
    }

    if (data && data.length > 0) {
      console.log('✅ Successfully added photos to report:', data[0].id);
      return NextResponse.json({
        success: true,
        message: 'Photos added successfully',
        report: {
          id: data[0].id,
          name: data[0].name,
          email: data[0].email,
          photosCount: data[0].photos?.length || 0,
          photos: data[0].photos,
        },
      });
    } else {
      return NextResponse.json(
        { error: 'No approved reports found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Server error', message: String(error) },
      { status: 500 }
    );
  }
}
