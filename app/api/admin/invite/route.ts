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
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #0a1628 0%, #1a2f4a 100%); color: white; padding: 40px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
            .header p { margin: 8px 0 0 0; font-size: 14px; opacity: 0.9; }
            .content { padding: 40px 30px; background: white; }
            .role-badge { display: inline-block; background: #f3b23c; color: #0a1628; padding: 8px 16px; border-radius: 6px; font-weight: 600; font-size: 13px; margin: 16px 0; }
            .section { margin: 24px 0; }
            .section h3 { color: #0a1628; font-size: 18px; margin: 16px 0 12px 0; }
            .section ul { margin: 12px 0; padding-left: 20px; }
            .section li { margin: 8px 0; color: #555; }
            .cta-button { display: inline-block; background: #f3b23c; color: #0a1628; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 24px 0; border: none; cursor: pointer; transition: background 0.2s; }
            .cta-button:hover { background: #e5a828; }
            .divider { border-top: 1px solid #eee; margin: 24px 0; }
            .footer { background: #f9f9f9; padding: 24px 30px; font-size: 12px; color: #888; text-align: center; border-top: 1px solid #eee; }
            .footer a { color: #f3b23c; text-decoration: none; }
            .highlight { color: #f3b23c; font-weight: 600; }
            .link-fallback { font-size: 11px; color: #999; word-break: break-all; padding: 12px; background: #f5f5f5; border-radius: 4px; margin: 12px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header -->
            <div class="header">
              <h1>Citizens' Atlas</h1>
              <p>Tracking False Solutions to Waste</p>
            </div>

            <!-- Content -->
            <div class="content">
              <p>Hi <span class="highlight">${fullName}</span>,</p>
              
              <p>You have been invited to join the <strong>Citizens' Atlas Admin Team</strong>!</p>
              
              <div class="role-badge">🔑 Role: ${roleDisplay}</div>

              <div class="section">
                <h3>Your Role: ${roleDisplay}</h3>
                <ul>
                  ${role === 'admin' ? `
                    <li>Review and approve citizen reports about false climate solutions</li>
                    <li>Manage content: news, publications, and videos</li>
                    <li>Monitor the public database and ensure data quality</li>
                    <li>Collaborate with team members</li>
                  ` : role === 'super-admin' ? `
                    <li>Full administrative access to all functions</li>
                    <li>Manage users and assign roles</li>
                    <li>System settings and configuration</li>
                    <li>Access all analytics and reports</li>
                  ` : `
                    <li>Submit project information and reports</li>
                    <li>Upload documentation and evidence</li>
                    <li>Collaborate with the Citizens' Atlas team</li>
                    <li>Help document false climate solutions</li>
                  `}
                </ul>
              </div>

              <div class="section">
                <p>Citizens' Atlas is a collaborative, public effort documenting waste-to-energy projects, plastic-to-fuel facilities, and other false climate fixes across Asia-Pacific. Together, we're making development finance visible and amplifying community voices.</p>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center;">
                <a href="${inviteLink}" class="cta-button">Accept Invitation →</a>
              </div>

              <div class="link-fallback">
                Or copy this link: <a href="${inviteLink}">${inviteLink}</a>
              </div>

              <div class="divider"></div>

              <div class="section" style="font-size: 13px; color: #666;">
                <p><strong>⏰ This invitation expires in 24 hours</strong></p>
                <p>If you didn't expect this invitation or have questions, please contact us.</p>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p style="margin: 0 0 8px 0;">
                <strong style="color: #333;">Citizens' Atlas</strong> — A collaboration with no-burn.org and AidData
              </p>
              <p style="margin: 0;">
                <a href="https://citizensatlas.org">citizensatlas.org</a> • 
                <a href="https://no-burn.org">no-burn.org</a>
              </p>
              <p style="margin: 8px 0 0 0; color: #aaa;">
                © 2025 Citizens' Atlas – All rights reserved
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailgunUrl = `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`;
    
    const formData = new FormData();
    formData.append('from', MAILGUN_FROM);
    formData.append('to', email);
    formData.append('subject', `You're Invited to Citizens' Atlas as a ${roleDisplay}`);
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
