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

    // Always use the stable domain for production
    const isLocalhost = request.nextUrl.host.includes('localhost') || request.nextUrl.host.includes('127.0.0.1');
    
    let appUrl;
    if (isLocalhost) {
      appUrl = 'http://localhost:3000';
    } else {
      // Always use stable domain for any production deployment
      appUrl = 'https://citizens-atlas.vercel.app';
    }
    
    const redirectTo = `${appUrl}/auth/reset-password`

    console.log('🔄 [API] Sending password reset email to:', email)
    console.log('📧 [API] Redirect URL:', redirectTo)
    console.log('🌍 [API] Current host:', request.nextUrl.host)
    console.log('🌍 [API] Is localhost:', isLocalhost)
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