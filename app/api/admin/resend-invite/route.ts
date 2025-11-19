import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Create a Supabase admin client with service role key
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

// POST - Resend invitation to a user
export async function POST(request: NextRequest) {
  try {
    const { userId, email } = await request.json();

    if (!userId || !email) {
      return NextResponse.json(
        { error: 'User ID and email are required' },
        { status: 400 }
      );
    }

    // Get user to check metadata
    const { data: { user }, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (getUserError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Resend invitation
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: user.user_metadata,
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/accept-invite`,
    });

    if (error) {
      console.error('Resend invitation error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to resend invitation' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Invitation resent successfully',
    });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
