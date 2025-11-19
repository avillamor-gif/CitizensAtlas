import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function disableRLS() {
  const tables = ['projects', 'news', 'videos', 'publications', 'news_categories', 'publication_types', 'video_categories']
  
  console.log('🔓 Disabling RLS on all tables...')
  
  for (const table of tables) {
    try {
      const { error } = await supabase.rpc('exec_sql', { 
        sql: `ALTER TABLE ${table} DISABLE ROW LEVEL SECURITY;`
      })
      
      if (error) {
        console.log(`⚠️  ${table}: ${error.message}`)
      } else {
        console.log(`✅ ${table}: RLS disabled`)
      }
    } catch (err: any) {
      console.log(`⚠️  ${table}: ${err.message}`)
    }
  }
  
  console.log('\n✅ Done! All tables should now be publicly accessible.')
}

disableRLS()
