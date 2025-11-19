import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function fixAdminRole() {
  const adminEmail = 'akawar@gmail.com'

  console.log('🔧 Updating role to super-admin...')

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: 'super-admin' })
      .eq('email', adminEmail)
      .select()

    if (error) {
      console.error('❌ Failed to update role:', error)
      return
    }

    console.log('✅ Role updated successfully!')
    console.log('User:', data[0].email)
    console.log('New role:', data[0].role)
    console.log('')
    console.log('🎉 You can now see the Pending Approvals page!')
    console.log('Refresh your browser to see the changes.')

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

fixAdminRole()
