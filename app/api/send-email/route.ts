import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

/**
 * API Route for sending email notifications using Resend
 * 
 * Setup:
 * 1. Sign up at https://resend.com/
 * 2. Get your API key from dashboard (takes 30 seconds!)
 * 3. Add to .env.local:
 *    RESEND_API_KEY=re_xxxxx
 *    RESEND_FROM=onboarding@resend.dev (or your verified domain)
 * 
 * No phone verification needed! ✅
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

    // Check if Resend is configured
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const RESEND_FROM = process.env.RESEND_FROM || 'onboarding@resend.dev';

    if (!RESEND_API_KEY) {
      // Development mode - log to console
      console.log('📧 Email would be sent (Resend not configured):');
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('From:', RESEND_FROM);
      console.log('Body:', text || html.substring(0, 100) + '...');
      console.log('\n⚠️ To enable Resend, set RESEND_API_KEY in .env.local');
      console.log('Sign up: https://resend.com/ (no phone verification!)');

      return NextResponse.json(
        {
          success: true,
          message: 'Email logged (Resend not configured)',
          preview: { to, subject, from: RESEND_FROM },
        },
        { status: 200 }
      );
    }

    // Initialize Resend client
    const resend = new Resend(RESEND_API_KEY);

    // Send email via Resend
    const result = await resend.emails.send({
      from: RESEND_FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
    });

    if (result.error) {
      throw new Error(result.error.message);
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

// Handle OPTIONS for CORS if needed
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { status: 200 });
}
