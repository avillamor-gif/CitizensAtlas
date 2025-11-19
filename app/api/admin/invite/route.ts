import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Create a Supabase admin client with service role key
// This allows admin operations like inviting users
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Service role key (keep secret!)
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: NextRequest) {
  try {
    const { email, fullName, role } = await request.json();

    if (!email || !fullName || !role) {
      return NextResponse.json(
        { error: 'Email, full name, and role are required' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['contributor', 'admin', 'super-admin'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be contributor, admin, or super-admin' },
        { status: 400 }
      );
    }

    // Use Supabase Admin API to invite the user
    const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/accept-invite`;
    console.log('Sending invitation with redirect URL:', redirectUrl);
    
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        full_name: fullName,
        role: role,
      },
      redirectTo: redirectUrl,
    });
    
    console.log('Invitation result:', { success: !error, userEmail: data?.user?.email });

    if (error) {
      console.error('Invitation error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to send invitation' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Invitation sent successfully',
      user: data.user,
    });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
