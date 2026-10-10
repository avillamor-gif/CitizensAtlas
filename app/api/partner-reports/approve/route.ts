import { NextRequest, NextResponse } from 'next/server';
import { getReportById, updateReport } from '@/lib/partner-reports';

interface ApprovalRequest {
  reportId: string;
  action: 'approve' | 'reject';
  reason?: string;
}

async function sendApprovalEmail(reportId: string, action: 'approve' | 'reject', reason?: string) {
  try {
    const report = getReportById(reportId);
    if (!report) return;

    const isApproval = action === 'approve';
    const subject = isApproval
      ? 'Your Report Has Been Approved - Citizens\' Atlas'
      : 'Your Report Submission - Citizens\' Atlas';

    const emailContent = `
      <h2>${isApproval ? 'Your Report Has Been Approved!' : 'Your Report Submission Update'}</h2>
      <p>Hi ${report.name},</p>
      ${isApproval
        ? `<p>Great news! Your report about <strong>${report.issue}</strong> in <strong>${report.region}</strong> has been reviewed and approved by our team. It is now being published on the Citizens' Atlas.</p>`
        : `<p>Thank you for your report submission. After review, we have decided not to publish this report at this time.</p>`
      }
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
      <hr style="margin: 20px 0;">
      <p>Thank you for contributing to the Citizens' Atlas!</p>
      <p>Best regards,<br/>The Citizens' Atlas Team</p>
    `;

    await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://citizensatlas.vercel.app'}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: report.email,
        subject,
        html: emailContent,
        text: `Your report has been ${isApproval ? 'approved' : 'rejected'}. ${reason ? `Reason: ${reason}` : ''}`,
      }),
    });

    console.log(`✅ ${isApproval ? 'Approval' : 'Rejection'} email sent for report:`, reportId);
  } catch (error) {
    console.error('Error sending approval email:', error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body: ApprovalRequest = await request.json();
    
    if (!body.reportId || !body.action) {
      return NextResponse.json(
        { error: 'Missing reportId or action' },
        { status: 400 }
      );
    }

    const report = getReportById(body.reportId);
    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    // Update report status
    const updates: any = { status: body.action === 'approve' ? 'approved' : 'rejected' };
    
    if (body.action === 'approve') {
      updates.approvedAt = new Date().toISOString();
      updates.approvedBy = 'admin'; // In a real app, get from authenticated user
    } else if (body.reason) {
      updates.rejectionReason = body.reason;
    }

    const updated = updateReport(body.reportId, updates);

    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to update report' },
        { status: 500 }
      );
    }

    // Send email notification (non-blocking)
    sendApprovalEmail(body.reportId, body.action, body.reason);

    return NextResponse.json({
      success: true,
      message: `Report ${body.action}d successfully`,
      reportId: body.reportId,
      action: body.action,
    });
  } catch (error) {
    console.error('Error processing report approval:', error);
    return NextResponse.json(
      { error: 'Failed to process approval' },
      { status: 500 }
    );
  }
}
