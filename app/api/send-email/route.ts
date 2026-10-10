import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

/**
 * API Route for sending email notifications using Resend
 * 
 * Configuration in .env.local:
 *    RESEND_API_KEY=xxxxx
 *    RESEND_FROM="Citizens' Atlas <onboarding@resend.dev>"
 *    PARTNER_REPORT_ADMIN_EMAIL=admin@example.com
 */

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Check if Resend is configured
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const RESEND_FROM = process.env.RESEND_FROM || 'Citizens\' Atlas <onboarding@resend.dev>';

    if (!RESEND_API_KEY) {
      // Development mode - log to console
      console.log('📧 Email would be sent (Resend not configured):');
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('From:', RESEND_FROM);
      console.log('Body:', text || html.substring(0, 100) + '...');
      console.log('\n⚠️ To enable Resend, set RESEND_API_KEY in .env.local');

      return NextResponse.json(
        {
          success: true,
          message: 'Email logged (Resend not configured)',
          preview: { to, subject, from: RESEND_FROM },
        },
        { status: 200 }
      );
    }

    // Send via Resend
    const result = await resend.emails.send({
      from: RESEND_FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html: html || undefined,
      text: text || undefined,
    });

    if (result.error) {
      throw new Error(result.error.message || 'Resend API error');
    }

    console.log('✅ Email sent successfully via Resend:', result.data?.id);

    return NextResponse.json(
      {
        success: true,
        message: 'Email sent successfully via Resend',
        messageId: result.data?.id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Error sending email via Resend:', error);

    return NextResponse.json(
      { 
        error: 'Failed to send email notification',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
