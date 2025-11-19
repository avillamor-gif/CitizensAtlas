import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    console.log('🔍 Testing API endpoint...')
    
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        error: 'Missing environment variables',
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseAnonKey
      }, { status: 500 })
    }
    
    // Test database connection
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { data: projects, error } = await supabase
      .from('projects')
      .select('id, title')
      .eq('status', 'published')
      .limit(3)
    
    if (error) {
      return NextResponse.json({
        error: 'Database error',
        details: error.message
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      projectsCount: projects?.length || 0,
      sampleProjects: projects,
      environmentCheck: {
        hasUrl: true,
        hasKey: true,
        urlPreview: supabaseUrl.substring(0, 30) + '...'
      }
    })
    
  } catch (error: any) {
    console.error('API test error:', error)
    return NextResponse.json({
      error: 'Server error',
      message: error.message
    }, { status: 500 })
  }
}