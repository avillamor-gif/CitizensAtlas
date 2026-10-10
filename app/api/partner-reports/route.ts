import { NextRequest, NextResponse } from 'next/server';
import { PartnerReport } from '@/types/types';
import { addReport, getReportsByStatus } from '@/lib/partner-reports';

async function sendSubmissionEmail(report: PartnerReport) {
  try {
    const submitterEmail = report.email;
    const adminEmail = process.env.PARTNER_REPORT_ADMIN_EMAIL || 'admin@citizensatlas.org';

    const emailContent = `
      <h2>Thank you for your report submission!</h2>
      <p>Hi ${report.name},</p>
      <p>We have received your report about a waste-to-energy facility or related false solution. Our team will review your submission and contact you if we need additional information.</p>
      <hr style="margin: 20px 0;">
      <h3>Report Details:</h3>
      <p><strong>Issue:</strong> ${report.issue}</p>
      <p><strong>Region:</strong> ${report.region}</p>
      <p><strong>Company:</strong> ${report.operatingCompany || 'Not provided'}</p>
      <p><strong>Observations:</strong> ${report.observations}</p>
      <p><strong>Report ID:</strong> ${report.id}</p>
      <hr style="margin: 20px 0;">
      <p>Thank you for helping us document false climate solutions and support affected communities.</p>
      <p>Best regards,<br/>The Citizens' Atlas Team</p>
    `;

    // Send confirmation email to submitter
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://citizensatlas.vercel.app'}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: submitterEmail,
        subject: 'Report Received - Citizens\' Atlas',
        html: emailContent,
        text: `Report received for ${report.issue} in ${report.region}. Report ID: ${report.id}`,
      }),
    });

    // Send notification to admin
    const adminContent = `
      <h2>New Partner Report Submitted</h2>
      <p><strong>Submitted by:</strong> ${report.name}</p>
      <p><strong>Email:</strong> ${report.email}</p>
      <p><strong>Phone:</strong> ${report.phone || 'Not provided'}</p>
      <p><strong>Region:</strong> ${report.region}</p>
      <p><strong>Date of Issue:</strong> ${report.date}</p>
      <p><strong>Issue:</strong> ${report.issue}</p>
      <p><strong>Operating Company:</strong> ${report.operatingCompany || 'Not provided'}</p>
      <p><strong>Consulted:</strong> ${report.consulted}</p>
      <p><strong>Observations:</strong> ${report.observations}</p>
      <p><strong>Relevant Links:</strong> ${report.relevantLinks?.join(', ') || 'None'}</p>
      ${report.photos && report.photos.length > 0 ? `<p><strong>Photos:</strong> ${report.photos.length} image(s) attached</p>` : ''}
      <p><strong>Report ID:</strong> ${report.id}</p>
      <p><strong>Submitted At:</strong> ${report.submittedAt}</p>
      <hr style="margin: 20px 0;">
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://citizensatlas.vercel.app'}/admin?page=partner-reports-pending">Review in Admin Dashboard</a></p>
    `;

    await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://citizensatlas.vercel.app'}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: adminEmail,
        subject: `New Partner Report: ${report.issue}`,
        html: adminContent,
      }),
    });

    console.log('✅ Submission emails sent for report:', report.id);
  } catch (error) {
    console.error('Error sending submission emails:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: Omit<PartnerReport, 'id' | 'submittedAt' | 'status'> = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.observations) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new report with pending status
    const newReport: PartnerReport = {
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...body,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    // Save to database
    const savedReport = await addReport(newReport);

    if (!savedReport) {
      return NextResponse.json(
        { error: 'Failed to save report to database' },
        { status: 500 }
      );
    }

    // Send email notifications (non-blocking)
    sendSubmissionEmail(newReport);

    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully. It will be reviewed by our team.',
      reportId: newReport.id,
    });
  } catch (error) {
    console.error('Error submitting partner report:', error);
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    console.log('📥 GET /api/partner-reports - Status filter:', status);

    // Fetch from database
    const reports = status
      ? await getReportsByStatus(status)
      : await getReportsByStatus('pending'); // Default to pending if no status specified

    console.log('📤 Returning', reports.length, 'reports');
    if (reports.length > 0) {
      console.log('📸 First report:', reports[0]);
    }

    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Error fetching partner reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
