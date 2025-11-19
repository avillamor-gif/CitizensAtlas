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

// GET - List all users including pending invitations
export async function GET(request: NextRequest) {
  try {
    // Get all users via admin API
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch users' },
        { status: 500 }
      );
    }

    // Separate confirmed users from pending invites
    const confirmedUsers = users.filter(user => user.email_confirmed_at);
    const pendingInvites = users.filter(user => !user.email_confirmed_at);

    return NextResponse.json({
      success: true,
      confirmedUsers,
      pendingInvites,
    });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a user or pending invitation
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Delete the user via admin API
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      console.error('Error deleting user:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to delete user' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
