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

async function sendInvitationEmail(email: string, fullName: string, role: string, inviteLink: string) {
  try {
    const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
    const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || 'mg.zerowaste.asia';
    const MAILGUN_FROM = `Citizens' Atlas <noreply@${MAILGUN_DOMAIN}>`;

    if (!MAILGUN_API_KEY) {
      console.log('⚠️ Mailgun not configured, email not sent');
      return false;
    }

    // Capitalize role for display
    const roleDisplay = role === 'super-admin' ? 'Super Admin' : role.charAt(0).toUpperCase() + role.slice(1);

    const emailContent = `
      <h2>You're Invited to Citizens' Atlas ${roleDisplay}</h2>
      <p>Hi ${fullName},</p>
      <p>You have been invited to join the Citizens' Atlas Admin Team as a <strong>${roleDisplay}</strong>.</p>
      <p>Citizens' Atlas is a collaborative, public effort documenting waste-to-energy projects and false climate solutions across Asia-Pacific.</p>
      <hr style="margin: 20px 0;">
      <h3>Your Role: ${roleDisplay}</h3>
      <p>
        ${role === 'admin' ? 
          'As an Admin, you can:<br/>• Review and approve citizen reports<br/>• Manage content (news, publications, videos)<br/>• Invite new team members<br/>• View analytics and statistics' :
          role === 'super-admin' ?
          'As a Super Admin, you have full access to:<br/>• All admin functions<br/>• System settings and configuration<br/>• User and role management<br/>• Complete data access' :
          'As a Contributor, you can:<br/>• Submit project information<br/>• Upload reports and documentation<br/>• Collaborate with the team'}
      </p>
      <hr style="margin: 20px 0;">
      <p>
        <a href="${inviteLink}" style="display: inline-block; padding: 12px 24px; background-color: #f3b23c; color: #0a1628; text-decoration: none; font-weight: bold; border-radius: 6px; margin: 20px 0;">
          Accept Invitation
        </a>
      </p>
      <p style="font-size: 12px; color: #999;">
        Or copy this link: <a href="${inviteLink}">${inviteLink}</a>
      </p>
      <p style="margin-top: 30px; font-size: 12px; color: #999;">
        This invitation link will expire in 24 hours.
      </p>
      <hr style="margin: 20px 0;">
      <p>Welcome to Citizens' Atlas!<br/>The Citizens' Atlas Team</p>
    `;

    const mailgunUrl = `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`;
    
    const formData = new FormData();
    formData.append('from', MAILGUN_FROM);
    formData.append('to', email);
    formData.append('subject', `You're Invited to Citizens' Atlas ${roleDisplay}`);
    formData.append('html', emailContent);
    formData.append('text', `You have been invited to join Citizens' Atlas as a ${roleDisplay}. Click the link to accept: ${inviteLink}`);

    const response = await fetch(mailgunUrl, {
      method: 'POST',
      auth: {
        username: 'api',
        password: MAILGUN_API_KEY,
      },
      body: formData,
    } as any);

    const result = await response.json();

    if (!response.ok) {
      console.error('Mailgun error:', result);
      return false;
    }

    console.log('✅ Invitation email sent via Mailgun:', result.id);
    return true;
  } catch (error) {
    console.error('Error sending invitation email:', error);
    return false;
  }
}

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

    // Send custom branded email via Mailgun
    if (data?.user?.email) {
      const inviteLink = data.user.user_metadata?.confirmation_url || redirectUrl;
      await sendInvitationEmail(email, fullName, role, inviteLink);
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
