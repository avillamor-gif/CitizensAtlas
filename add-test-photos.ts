// Quick script to add sample photos to an approved report
// Run with: npx ts-node add-test-photos.ts

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function addPhotosToTestReport() {
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
      process.exit(1);
    }

    if (data && data.length > 0) {
      console.log('✅ Successfully added photos to report:');
      console.log('📋 Report ID:', data[0].id);
      console.log('👤 Name:', data[0].name);
      console.log('📸 Photos added:', data[0].photos?.length || 0);
      console.log('\n🎉 Go to Project List > click on this report > see photos!');
    } else {
      console.log('⚠️ No approved reports found');
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addPhotosToTestReport();
