import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const appUrl = process.env.NEXT_PUBLIC_APP_URL!

async function testResetPassword() {
  try {
    console.log('🔍 Testing password reset functionality...')
    console.log('🌐 App URL:', appUrl)
    console.log('🔗 Reset redirect URL:', `${appUrl}/auth/reset-password`)
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Test with a test email
    const testEmail = 'test@example.com'
    console.log('📧 Testing reset for email:', testEmail)
    
    const { error } = await supabase.auth.resetPasswordForEmail(testEmail, {
      redirectTo: `${appUrl}/auth/reset-password`,
    })
    
    if (error) {
      console.error('❌ Reset password error:', error)
    } else {
      console.log('✅ Reset password email would be sent successfully')
      console.log('📝 Note: This is just a test - no actual email sent to test@example.com')
    }
    
    // Test with admin email
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'akawar@gmail.com'
    console.log('🔑 Testing reset for admin email:', adminEmail)
    
    const { error: adminError } = await supabase.auth.resetPasswordForEmail(adminEmail, {
      redirectTo: `${appUrl}/auth/reset-password`,
    })
    
    if (adminError) {
      console.error('❌ Admin reset password error:', adminError)
    } else {
      console.log('✅ Admin reset password email sent successfully')
      console.log('📬 Check your email for the reset link')
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error)
  }
}

testResetPassword()