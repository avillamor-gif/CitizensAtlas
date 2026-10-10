import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route for sending email notifications using Mailgun
 * 
 * Configuration in .env.local:
 *    MAILGUN_API_KEY=xxxxx
 *    MAILGUN_DOMAIN=mg.zerowaste.asia
 *    PARTNER_REPORT_ADMIN_EMAIL=admin@example.com
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, html, text } = body;

    // Validate required fields
    if (!to || !subject || (!html && !text)) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, and html or text' },
        { status: 400 }
      );
    }

    // Check if Mailgun is configured
    const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
    const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || 'mg.zerowaste.asia';
    const MAILGUN_FROM = process.env.MAILGUN_FROM || `Citizens' Atlas <noreply@${MAILGUN_DOMAIN}>`;

    if (!MAILGUN_API_KEY) {
      // Development mode - log to console
      console.log('📧 Email would be sent (Mailgun not configured):');
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('From:', MAILGUN_FROM);
      console.log('Body:', text || html.substring(0, 100) + '...');
      console.log('\n⚠️ To enable Mailgun, set MAILGUN_API_KEY and MAILGUN_DOMAIN in .env.local');

      return NextResponse.json(
        {
          success: true,
          message: 'Email logged (Mailgun not configured)',
          preview: { to, subject, from: MAILGUN_FROM },
        },
        { status: 200 }
      );
    }

    // Prepare Mailgun request
    const mailgunUrl = `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`;
    
    const formData = new FormData();
    formData.append('from', MAILGUN_FROM);
    formData.append('to', Array.isArray(to) ? to.join(',') : to);
    formData.append('subject', subject);
    if (html) formData.append('html', html);
    if (text) formData.append('text', text);

    // Send via Mailgun
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
      throw new Error(result.message || 'Mailgun API error');
    }

    console.log('✅ Email sent successfully via Mailgun:', result.id);

    return NextResponse.json(
      {
        success: true,
        message: 'Email sent successfully via Mailgun',
        messageId: result.id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Error sending email via Mailgun:', error);

    return NextResponse.json(
      { 
        error: 'Failed to send email notification',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
