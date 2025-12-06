import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName } = await request.json();

    // Validate input
    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Email, first name, and last name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const mailgunApiKey = process.env.MAILGUN_API_KEY;
    const mailgunDomain = process.env.MAILGUN_DOMAIN;
    const mailingListAddress = process.env.MAILGUN_MAILING_LIST; // e.g., newsletter@yourdomain.com

    if (!mailgunApiKey || !mailgunDomain || !mailingListAddress) {
      console.error('Mailgun environment variables not configured');
      return NextResponse.json(
        { error: 'Newsletter service not configured' },
        { status: 500 }
      );
    }

    // Add subscriber to Mailgun mailing list
    const mailgunUrl = `https://api.mailgun.net/v3/lists/${mailingListAddress}/members`;
    
    const formData = new URLSearchParams();
    formData.append('address', email);
    formData.append('name', `${firstName} ${lastName}`);
    formData.append('subscribed', 'yes');
    formData.append('upsert', 'yes'); // Update if already exists

    const response = await fetch(mailgunUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${mailgunApiKey}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Mailgun API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to subscribe to newsletter' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data,
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
