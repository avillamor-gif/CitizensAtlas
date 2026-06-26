/**
 * Email Notification System for Draft Approval Workflow
 * 
 * This module handles sending email notifications for:
 * - New draft submissions (to super admin)
 * - Draft approvals (to contributor)
 * - Draft rejections (to contributor)
 */

export interface NotificationConfig {
  superAdminEmail: string;
  emailServiceUrl?: string; // Optional API endpoint for email service
}

export interface DraftSubmissionNotification {
  contributorName: string;
  contributorEmail: string;
  contentType: 'project' | 'news' | 'publication' | 'video';
  contentTitle: string;
  submittedAt: string;
}

export interface DraftStatusNotification {
  contributorEmail: string;
  contributorName: string;
  contentType: 'project' | 'news' | 'publication' | 'video';
  contentTitle: string;
  status: 'approved' | 'rejected';
  adminName?: string;
}

// Default configuration - should be set from environment variables
const defaultConfig: NotificationConfig = {
  superAdminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@atlas.org',
  emailServiceUrl: process.env.NEXT_PUBLIC_EMAIL_SERVICE_URL || '/api/send-email',
};

/**
 * Sends email notification when a contributor submits new content
 */
export async function notifyAdminOfNewSubmission(
  notification: DraftSubmissionNotification,
  config: Partial<NotificationConfig> = {}
): Promise<boolean> {
  const finalConfig = { ...defaultConfig, ...config };

  const emailData = {
    to: finalConfig.superAdminEmail,
    subject: `New ${notification.contentType} submission awaiting approval`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Content Submission</h2>
        <p>A new ${notification.contentType} has been submitted and is awaiting your approval.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Content Type:</strong> ${notification.contentType.charAt(0).toUpperCase() + notification.contentType.slice(1)}</p>
          <p><strong>Title:</strong> ${notification.contentTitle}</p>
          <p><strong>Submitted By:</strong> ${notification.contributorName} (${notification.contributorEmail})</p>
          <p><strong>Submitted At:</strong> ${new Date(notification.submittedAt).toLocaleString()}</p>
        </div>
        
        <p>Please log in to the admin dashboard to review and approve or reject this submission.</p>
        
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/pending-approvals" 
           style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
          Review Submission
        </a>
      </div>
    `,
    text: `
New ${notification.contentType} submission awaiting approval

Content Type: ${notification.contentType}
Title: ${notification.contentTitle}
Submitted By: ${notification.contributorName} (${notification.contributorEmail})
Submitted At: ${new Date(notification.submittedAt).toLocaleString()}

Please log in to the admin dashboard to review this submission.
    `,
  };

  try {
    // If email service URL is configured, send via API
    if (finalConfig.emailServiceUrl) {
      const response = await fetch(finalConfig.emailServiceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error(`Email service responded with status: ${response.status}`);
      }

      console.log('✅ Admin notification sent successfully');
      return true;
    } else {
      // Fallback: Log to console (for development)
      console.log('📧 Email Notification (Admin):', emailData);
      console.log('⚠️ Email service not configured. Set NEXT_PUBLIC_EMAIL_SERVICE_URL to enable email sending.');
      return true;
    }
  } catch (error) {
    console.error('❌ Failed to send admin notification:', error);
    return false;
  }
}

/**
 * Sends email notification when content is approved or rejected
 */
export async function notifyContributorOfStatus(
  notification: DraftStatusNotification,
  config: Partial<NotificationConfig> = {}
): Promise<boolean> {
  const finalConfig = { ...defaultConfig, ...config };
  const isApproved = notification.status === 'approved';
  const emailData = {
    to: notification.contributorEmail,
    subject: `Your ${notification.contentType} submission has been ${notification.status}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${isApproved ? '#16a34a' : '#dc2626'};">
          Submission ${isApproved ? 'Approved' : 'Rejected'}
        </h2>
        <p>Hello ${notification.contributorName},</p>
        <p>Your ${notification.contentType} submission has been <strong>${notification.status}</strong>${notification.adminName ? ` by ${notification.adminName}` : ''}.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Content Type:</strong> ${notification.contentType.charAt(0).toUpperCase() + notification.contentType.slice(1)}</p>
          <p><strong>Title:</strong> ${notification.contentTitle}</p>
          <p><strong>Status:</strong> <span style="color: ${isApproved ? '#16a34a' : '#dc2626'}; font-weight: bold;">${notification.status.toUpperCase()}</span></p>
        </div>
        ${isApproved
          ? `<p style="margin-top: 20px;">Your content is now published and visible to the public. Thank you for your contribution!</p>
             <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${notification.contentType}s/${notification.contentTitle.replace(/\s+/g, '-').toLowerCase()}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">View Published Post</a>`
          : `<p style="margin-top: 20px;">Unfortunately, your submission did not meet our publication criteria at this time. Please feel free to submit revised content or contact the admin team for feedback.</p>`
        }
      </div>
    `,
    text: `
Hello ${notification.contributorName},

Your ${notification.contentType} submission has been ${notification.status}${notification.adminName ? ` by ${notification.adminName}` : ''}.

Content Type: ${notification.contentType}
Title: ${notification.contentTitle}
Status: ${notification.status.toUpperCase()}

${isApproved 
  ? 'Your content is now published and visible to the public. Thank you for your contribution!'
  : 'Unfortunately, your submission did not meet our publication criteria at this time. Please feel free to submit revised content or contact the admin team for feedback.'
}
    `,
  };

  try {
    // If email service URL is configured, send via API
    if (finalConfig.emailServiceUrl) {
      const response = await fetch(finalConfig.emailServiceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error(`Email service responded with status: ${response.status}`);
      }

      console.log('✅ Contributor notification sent successfully');
      return true;
    } else {
      // Fallback: Log to console (for development)
      console.log('📧 Email Notification (Contributor):', emailData);
      console.log('⚠️ Email service not configured. Set NEXT_PUBLIC_EMAIL_SERVICE_URL to enable email sending.');
      return true;
    }
  } catch (error) {
    console.error('❌ Failed to send contributor notification:', error);
    return false;
  }
}

/**
 * Batch notify admin of multiple submissions (optional utility)
 */
export async function notifyAdminOfMultipleSubmissions(
  notifications: DraftSubmissionNotification[],
  config: Partial<NotificationConfig> = {}
): Promise<boolean> {
  const finalConfig = { ...defaultConfig, ...config };

  const emailData = {
    to: finalConfig.superAdminEmail,
    subject: `${notifications.length} new submission(s) awaiting approval`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">${notifications.length} New Submissions</h2>
        <p>You have ${notifications.length} new content submissions awaiting your approval.</p>
        
        ${notifications.map(notif => `
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #2563eb;">
            <p style="margin: 5px 0;"><strong>${notif.contentType.toUpperCase()}:</strong> ${notif.contentTitle}</p>
            <p style="margin: 5px 0; font-size: 14px; color: #6b7280;">By ${notif.contributorName} at ${new Date(notif.submittedAt).toLocaleString()}</p>
          </div>
        `).join('')}
        
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/pending-approvals" 
           style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
          Review All Submissions
        </a>
      </div>
    `,
  };

  try {
    if (finalConfig.emailServiceUrl) {
      const response = await fetch(finalConfig.emailServiceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      return response.ok;
    } else {
      console.log('📧 Batch Email Notification (Admin):', emailData);
      return true;
    }
  } catch (error) {
    console.error('❌ Failed to send batch admin notification:', error);
    return false;
  }
}
