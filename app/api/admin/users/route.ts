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

// PUT - Update user role
export async function PUT(request: NextRequest) {
  try {
    const { userId, role } = await request.json();

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'User ID and role are required' },
        { status: 400 }
      );
    }

    // Verify the current user is authenticated
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing authentication token' },
        { status: 401 }
      );
    }

    console.log(`📝 Updating user ${userId} role to ${role}`);

    // Update user metadata via admin API
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { role },
    });

    if (error) {
      console.error('Error updating user role in auth:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update user role' },
        { status: 500 }
      );
    }

    console.log(`✅ User ${userId} role updated in auth.users to ${role}`);

    // Also update the profiles table to keep it in sync
    try {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({ role })
        .eq('id', userId);

      if (profileError) {
        console.warn(`⚠️ Failed to update role in profiles table:`, profileError);
        // Don't fail if profiles table update fails - user_metadata is primary source
      } else {
        console.log(`✅ User ${userId} role updated in profiles table to ${role}`);
      }
    } catch (profileErr) {
      console.warn(`⚠️ Exception updating profiles table:`, profileErr);
    }

    return NextResponse.json({
      success: true,
      message: 'User role updated successfully',
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
