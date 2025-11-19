import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Use server-side Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Use the stable Vercel domain if available, otherwise construct from current request
    let appUrl = process.env.NEXT_PUBLIC_APP_URL;
    
    if (!appUrl || appUrl.includes('localhost')) {
      // Fallback to current request URL
      const currentHost = request.nextUrl.host
      const protocol = request.nextUrl.protocol
      appUrl = `${protocol}//${currentHost}`
    }
    
    const redirectTo = `${appUrl}/auth/reset-password`

    console.log('🔄 [API] Sending password reset email to:', email)
    console.log('📧 [API] Redirect URL:', redirectTo)
    console.log('🌍 [API] App URL from env:', process.env.NEXT_PUBLIC_APP_URL)
    console.log('🌍 [API] Current host:', request.nextUrl.host)
    console.log('🌍 [API] Final app URL used:', appUrl)

    // Use the standard resetPasswordForEmail instead of admin.generateLink
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo,
    })

    if (error) {
      console.error('❌ [API] Reset password error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log('✅ [API] Reset password email sent successfully')
    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('❌ [API] Reset password exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}