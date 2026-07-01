const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteAllProjects() {
  try {
    // Delete all projects
    const { data, error } = await supabase
      .from('projects')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

    if (error) {
      console.error('Error deleting projects:', error);
      process.exit(1);
    }

    // Count remaining projects
    const { data: count, error: countError } = await supabase
      .from('projects')
      .select('id', { count: 'exact', head: true });

    if (countError) {
      console.error('Error counting projects:', countError);
      process.exit(1);
    }

    console.log(`✅ Successfully deleted all projects. Remaining: ${count?.length || 0}`);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

deleteAllProjects();
