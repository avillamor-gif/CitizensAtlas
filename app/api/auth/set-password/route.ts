import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Create a Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 set-password API called');
    const { userId, password } = await request.json();
    console.log('📦 Received request for userId:', userId);

    if (!userId || !password) {
      console.error('❌ Missing userId or password');
      return NextResponse.json(
        { error: 'User ID and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      console.error('❌ Password too short');
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    console.log('⏳ Calling Supabase Admin API to update password...');
    const startTime = Date.now();

    // Use Admin API to update user password
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: password,
    });
    
    const duration = Date.now() - startTime;
    console.log(`⏱️ Supabase API call took ${duration}ms`);

    if (error) {
      console.error('❌ Supabase error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update password' },
        { status: 500 }
      );
    }

    console.log('✅ Password updated successfully for user:', userId);

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error: any) {
    console.error('❌ Server error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
