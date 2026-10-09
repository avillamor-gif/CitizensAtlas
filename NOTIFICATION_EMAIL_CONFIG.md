# Email Notification Configuration Feature

## Overview
This feature allows super admins to configure which email addresses receive notifications about pending approvals. Admins can add, edit, delete, and toggle the status of notification emails.

## Setup Instructions

### 1. Apply Database Migration

You need to run the SQL migration to create the `notification_emails` table. You can do this through:

#### Option A: Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Create a new query
4. Copy and paste the contents of `supabase/migrations/create_notification_emails_table.sql`
5. Run the query

#### Option B: Supabase CLI
```bash
cd /Users/leopura/Desktop/atlas
supabase db push
```

### 2. Database Schema

The migration creates a `notification_emails` table with the following structure:

```sql
CREATE TABLE notification_emails (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  label TEXT, -- Optional label (e.g., "Primary Admin", "Backup Email")
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT -- User ID who created this configuration
);
```

**Features:**
- Row Level Security (RLS) enabled - only super_admin role can access
- Email validation constraint (CHECK constraint)
- Index on `is_active` for faster queries
- Unique email constraint to prevent duplicates

## Usage

### For Super Admins

#### Accessing the Configuration Panel
1. Log in as a super_admin user
2. Go to the Admin Dashboard
3. Click on "Notification Emails" in the sidebar (Mail icon)

#### Adding a New Email
1. Click "Add Notification Email" button
2. Enter email address (required)
3. Enter optional label (e.g., "Primary Admin", "Backup Email")
4. Click "Add Email"

#### Editing an Email
1. Click the Edit icon (pencil) on the email row
2. Modify the email address or label
3. Click "Update Email"

#### Deleting an Email
1. Click the Delete icon (trash) on the email row
2. Confirm deletion

#### Toggling Active Status
1. Click the check/X icon in the "Active" column to toggle
2. Inactive emails will not receive notifications

### For Contributors/Users

When contributors submit new content (projects, news, publications, videos):
- **All active notification emails** will receive an email notification
- Each notification includes a "Review Pending Approvals" button
- The button takes them directly to the pending approvals dashboard
- Email recipients can identify themselves in the email footer

## Email Notification Flow

### When Content is Submitted
1. Contributor submits content (status: 'draft')
2. System fetches all active notification emails from `notification_emails` table
3. For each active email:
   - Sends an HTML and plain text email
   - Includes submission details (title, type, contributor info)
   - Includes direct link to pending approvals dashboard
4. Admin receives email and can click to review

### When Content is Approved/Rejected
1. Admin approves or rejects the submission
2. System sends notification to contributor's email
3. Email includes the new status and relevant links

## API Endpoints

### GET /api/notification-emails
Fetch all notification email configurations
```bash
curl http://localhost:3000/api/notification-emails
```

### POST /api/notification-emails
Add a new notification email
```bash
curl -X POST http://localhost:3000/api/notification-emails \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "label": "Primary Admin"
  }'
```

### PUT /api/notification-emails/[id]
Update a notification email
```bash
curl -X PUT http://localhost:3000/api/notification-emails/1 \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newemail@example.com",
    "label": "Updated Label",
    "is_active": true
  }'
```

### DELETE /api/notification-emails/[id]
Delete a notification email
```bash
curl -X DELETE http://localhost:3000/api/notification-emails/1
```

## Updated Notification System

The `src/utils/notifications.ts` file has been updated to:

1. **New function: `getNotificationEmails()`**
   - Fetches all active notification emails from database
   - Returns empty array if database fetch fails
   - Includes error handling and logging

2. **Updated function: `notifyAdminOfNewSubmission()`**
   - Automatically fetches configured notification emails
   - Sends individual emails to each configured recipient
   - Includes direct link to pending approvals dashboard
   - Shows email label in footer if configured
   - Falls back to default admin email if no configured emails exist

## Email Template Features

**Admin Notification Email includes:**
- Green header with "New Content Submission" title
- Content details (type, title, contributor name, submission time)
- Styled container for submission information
- "Review Pending Approvals" button linking to admin dashboard
- Email recipient identifier in footer

**Contributor Status Notification Email includes:**
- Color-coded header (green for approved, red for rejected)
- Clear status message
- Content details
- Status badge with color coding
- Conditional message based on approval/rejection
- Link to published content (if approved)

## Environment Variables

No new environment variables required. Uses existing:
- `NEXT_PUBLIC_EMAIL_SERVICE_URL` - Email API endpoint (default: `/api/send-email`)
- `NEXT_PUBLIC_APP_URL` - Application URL for email links
- `RESEND_API_KEY` - Email service key (optional, falls back to console logging)

## Security

- **Row Level Security (RLS)**: Only super_admin users can view/edit/delete notification emails
- **Email Validation**: SQL constraint validates email format
- **Duplicate Prevention**: UNIQUE constraint on email field
- **API Protection**: All endpoints check user role before allowing access
- **XSS Protection**: Email content is properly escaped in HTML templates

## Troubleshooting

### Emails not being sent
1. Check RESEND_API_KEY is configured in .env.local or .env.production
2. Check email logs in browser console (dev tools)
3. Verify notification emails table exists in Supabase
4. Verify at least one active notification email is configured

### Can't access Notification Emails panel
1. Verify user has 'super_admin' role in database
2. Check admin sidebar for Mail icon
3. If not visible, user doesn't have required permissions

### Email validation errors
1. Ensure email format is valid (user@domain.com)
2. Check for duplicate emails in the list
3. Verify email doesn't already exist in database

## Future Enhancements

Possible future improvements:
- Email templates customization
- Per-content-type notification preferences
- Notification frequency settings (immediate, daily digest, etc.)
- Template preview before sending
- Email delivery status tracking
- Bulk email management (import/export)
- Email testing functionality
