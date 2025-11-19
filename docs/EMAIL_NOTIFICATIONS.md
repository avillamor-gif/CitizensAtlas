# Email Notification System

This document describes the email notification system for the draft approval workflow.

## Overview

The notification system sends automated emails when:
1. **Contributors submit content** → Super Admin receives notification
2. **Super Admin approves content** → Contributor receives approval notification
3. **Super Admin rejects content** → Contributor receives rejection notification

## Files

### Core Files
- `src/utils/notifications.ts` - Notification utility functions
- `app/api/send-email/route.ts` - API endpoint for sending emails

### Configuration
- `NEXT_PUBLIC_ADMIN_EMAIL` - Super admin email address (default: admin@atlas.org)
- `NEXT_PUBLIC_EMAIL_SERVICE_URL` - Email service API endpoint (default: /api/send-email)
- `NEXT_PUBLIC_APP_URL` - Application URL for links in emails (default: http://localhost:3000)

## Current Implementation

### Email Service: Mailgun ✅

The system is now configured to use **Mailgun** for sending emails. Mailgun offers:
- Free tier: 5,000 emails/month for 3 months, then 1,000/month
- Easy setup with sandbox domain for testing
- Reliable delivery with detailed tracking
- Professional email service used by thousands of companies

**Setup Instructions**: See `docs/MAILGUN_SETUP.md` for complete Mailgun configuration.

**Quick Reference**: See `docs/MAILGUN_QUICK_REF.md` for quick commands and troubleshooting.

### Development Mode

When Mailgun credentials are not configured, the system logs emails to the console instead of sending them. This is useful for development and testing without configuring an email service.

### Email Content

#### New Submission Notification (to Admin)
```
Subject: New [type] submission awaiting approval

Content includes:
- Content type (Project, News, Publication, Video)
- Title
- Submitted by (name and email)
- Submitted at (timestamp)
- Direct link to review in admin dashboard
```

#### Approval Notification (to Contributor)
```
Subject: Your [type] submission has been approved

Content includes:
- Content type and title
- Approval status (green badge)
- Admin who approved it
- Link to view published content
```

#### Rejection Notification (to Contributor)
```
Subject: Your [type] submission has been rejected

Content includes:
- Content type and title
- Rejection status (red badge)
- Admin who rejected it
- Encouragement to submit revised content
```

## Integration with Email Services

### Current: Mailgun (Installed ✅)

Mailgun is already integrated! To enable it:

```bash
# 1. Get credentials from Mailgun
# Sign up: https://www.mailgun.com/
# Dashboard: https://app.mailgun.com/

# 2. Add to .env.local
MAILGUN_API_KEY=key-your_private_api_key
MAILGUN_DOMAIN=sandbox123abc.mailgun.org
MAILGUN_FROM=Atlas CMS <noreply@sandbox123abc.mailgun.org>
NEXT_PUBLIC_ADMIN_EMAIL=admin@yourdomain.com

# 3. Restart dev server
npm run dev
```

**Complete Setup Guide**: See `docs/MAILGUN_SETUP.md`

### Alternative Email Services

If you prefer a different service, here are integration examples:

#### SendGrid

```bash
npm install @sendgrid/mail
```

Edit `app/api/send-email/route.ts`:
```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

await sgMail.send({
  to,
  from: 'noreply@atlas.org', // Verify this email in SendGrid
  subject,
  html,
  text
});
```

Environment variables:
```
SENDGRID_API_KEY=your_api_key_here
```

### 2. Resend

```bash
npm install resend
```

Edit `app/api/send-email/route.ts`:
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'noreply@atlas.org',
  to,
  subject,
  html
});
```

Environment variables:
```
RESEND_API_KEY=your_api_key_here
```

### 3. Nodemailer (SMTP)

```bash
npm install nodemailer
```

Edit `app/api/send-email/route.ts`:
```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

await transporter.sendMail({
  from: 'noreply@atlas.org',
  to,
  subject,
  html,
  text
});
```

Environment variables:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

## Testing

### Console Testing (Current)
When you submit or approve/reject content, check the browser console for:
```
📧 Email Notification (Admin): {...}
⚠️ Email service not configured...
```

### Test Notification Flow

1. **Submit as Contributor**
   - Switch `currentUser.role` to 'contributor'
   - Submit any content (Project, News, Publication, Video)
   - Check console for admin notification

2. **Approve as Super Admin**
   - Go to Pending Approvals
   - Click approve on a draft
   - Check console for contributor approval notification

3. **Reject as Super Admin**
   - Go to Pending Approvals
   - Click reject on a draft
   - Check console for contributor rejection notification

## User Management

Currently using placeholder emails:
- Admin: `admin@atlas.org`
- Contributors: `{name}@example.com`

### Production Integration
When integrating with authentication:

1. Store user emails in your user database
2. Update notification calls to fetch real emails:
```typescript
// Instead of placeholder:
const contributorEmail = await getUserEmail(submittedBy);

// Update notifyContributorOfStatus call
notifyContributorOfStatus({
  contributorEmail: contributorEmail, // Real email
  ...
})
```

## Notification Functions

### `notifyAdminOfNewSubmission()`
Called when contributor submits content.
- Sends email to super admin
- Includes submission details
- Links to admin review page

### `notifyContributorOfStatus()`
Called when admin approves/rejects content.
- Sends email to contributor
- Status: 'approved' or 'rejected'
- Includes admin name who made decision

### `notifyAdminOfMultipleSubmissions()`
Optional utility for batch notifications.
- Sends single email with multiple submissions
- Useful for daily digest emails

## Customization

### Email Templates
Edit templates in `src/utils/notifications.ts`:
- Modify HTML structure
- Update colors and styling
- Change text content
- Add additional fields

### Notification Triggers
Add more notification types:
- Draft edited
- Comment added
- Deadline approaching
- Bulk actions completed

## Troubleshooting

### Emails not sending in production
1. Verify email service API key is set
2. Check sender email is verified with service
3. Review API logs for errors
4. Test API endpoint directly

### Wrong email addresses
1. Verify user data includes email field
2. Check contributor email resolution logic
3. Update placeholder email generation

### Missing notifications
1. Verify notification calls aren't caught by error handlers
2. Check browser console for errors
3. Ensure API route is accessible
4. Test with simple fetch to /api/send-email

## Future Enhancements

- [ ] Email preferences (opt-in/opt-out)
- [ ] Digest emails (daily/weekly summaries)
- [ ] SMS notifications
- [ ] In-app notification center
- [ ] Email templates with React Email
- [ ] Notification history/audit log
- [ ] Retry failed notifications
- [ ] Queue system for bulk emails
