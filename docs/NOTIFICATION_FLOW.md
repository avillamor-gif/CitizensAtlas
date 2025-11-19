# Email Notification Flow Diagram

## Complete Draft Approval Workflow with Email Notifications

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        CONTRIBUTOR SUBMITS CONTENT                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                    ┌──────────────────────────────┐
                    │   Form Submission Handler    │
                    │  (handleAddProject/News/     │
                    │   Publication/Video)         │
                    └──────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
        ┌────────────────────┐        ┌────────────────────────┐
        │  Save to Database  │        │  Send Email to Admin   │
        │  status: 'draft'   │        │ notifyAdminOfNew       │
        │  submittedBy: name │        │ Submission()           │
        │  submittedAt: now  │        │                        │
        └────────────────────┘        └────────────────────────┘
                                                   │
                                                   ▼
                                    ┌───────────────────────────┐
                                    │  📧 Email to Super Admin  │
                                    │  ----------------------   │
                                    │  New [type] submission    │
                                    │  awaiting approval        │
                                    │                           │
                                    │  • Title: ...             │
                                    │  • Submitted by: ...      │
                                    │  • Link to review         │
                                    └───────────────────────────┘
                                                   │
                                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      SUPER ADMIN REVIEWS SUBMISSION                      │
│                     (Pending Approvals Dashboard)                        │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
        ┌────────────────────┐        ┌────────────────────────┐
        │   APPROVE DRAFT    │        │    REJECT DRAFT        │
        │ handleApproveDraft │        │  handleRejectDraft     │
        └────────────────────┘        └────────────────────────┘
                    │                               │
        ┌───────────┴───────────┐       ┌──────────┴──────────┐
        │                       │       │                     │
        ▼                       ▼       ▼                     ▼
┌───────────────┐  ┌─────────────────┐ ┌──────────┐  ┌────────────────┐
│ Update Status │  │  Send Email to  │ │  Delete  │  │  Send Email to │
│ to 'published'│  │   Contributor   │ │  Draft   │  │   Contributor  │
└───────────────┘  │ notifyContributor│ └──────────┘  │ notifyContributor│
                   │   OfStatus()    │               │   OfStatus()   │
                   │ status:'approved'│               │status:'rejected'│
                   └─────────────────┘               └────────────────┘
                           │                                 │
                           ▼                                 ▼
              ┌──────────────────────┐       ┌──────────────────────┐
              │ 📧 Email to          │       │ 📧 Email to          │
              │    Contributor       │       │    Contributor       │
              │ -------------------  │       │ -------------------  │
              │ Your [type]          │       │ Your [type]          │
              │ submission has been  │       │ submission has been  │
              │ APPROVED ✅          │       │ REJECTED ❌          │
              │                      │       │                      │
              │ • Title: ...         │       │ • Title: ...         │
              │ • Approved by: ...   │       │ • Rejected by: ...   │
              │ • Link to view       │       │ • Feedback message   │
              └──────────────────────┘       └──────────────────────┘
                           │                                 │
                           ▼                                 ▼
              ┌──────────────────────┐       ┌──────────────────────┐
              │   Content Visible    │       │  Contributor can     │
              │   on Public Website  │       │  submit revised      │
              └──────────────────────┘       │  content             │
                                              └──────────────────────┘
```

## Key Components

### 1. Notification Triggers

| Event | Recipient | Function Called |
|-------|-----------|-----------------|
| Content Submitted | Super Admin | `notifyAdminOfNewSubmission()` |
| Draft Approved | Contributor | `notifyContributorOfStatus(status: 'approved')` |
| Draft Rejected | Contributor | `notifyContributorOfStatus(status: 'rejected')` |

### 2. Email Contents

#### Admin Notification (New Submission)
```
Subject: New [project/news/publication/video] submission awaiting approval

Body:
- Content type with colored badge
- Title of submission
- Contributor name and email
- Submission timestamp
- Direct link to review in admin dashboard
```

#### Contributor Notification (Approved)
```
Subject: Your [type] submission has been approved

Body:
- Green success banner
- Content type and title
- Approval confirmation
- Admin name who approved
- Link to view published content
- Thank you message
```

#### Contributor Notification (Rejected)
```
Subject: Your [type] submission has been rejected

Body:
- Red rejection banner
- Content type and title
- Rejection confirmation
- Admin name who rejected
- Encouragement to revise and resubmit
- Contact information for feedback
```

### 3. System States

```
┌─────────────┐
│   Draft     │ ← Contributor submits (status: 'draft')
│  (Hidden)   │   📧 Email sent to admin
└─────────────┘
       │
       ├─→ Approve ─→ ┌───────────────┐
       │              │   Published   │ ← Public can view
       │              │   (Visible)   │   📧 Email sent to contributor
       │              └───────────────┘
       │
       └─→ Reject ──→ ┌───────────────┐
                      │    Deleted    │ ← Removed from system
                      └───────────────┘   📧 Email sent to contributor
```

### 4. Current vs. Production Mode

#### Development Mode (Current)
- Notifications logged to console
- No actual emails sent
- Easy to test workflow
- No email service required

```javascript
📧 Email Notification (Admin): {...}
⚠️ Email service not configured
```

#### Production Mode (After Setup)
- Real emails sent via SendGrid/Resend/SMTP
- Contributor emails from user database
- Proper "from" addresses
- Tracking and analytics

### 5. Configuration

#### Environment Variables
```bash
# Required for all environments
NEXT_PUBLIC_ADMIN_EMAIL=admin@atlas.org
NEXT_PUBLIC_APP_URL=https://yourapp.com

# For production email sending (choose one)
SENDGRID_API_KEY=your_key          # Option 1: SendGrid
RESEND_API_KEY=your_key            # Option 2: Resend
SMTP_HOST=smtp.gmail.com           # Option 3: SMTP
SMTP_USER=your_email
SMTP_PASSWORD=your_password
```

### 6. Testing Checklist

- [ ] Contributor submits project → Admin receives email
- [ ] Contributor submits news → Admin receives email
- [ ] Contributor submits publication → Admin receives email
- [ ] Contributor submits video → Admin receives email
- [ ] Admin approves draft → Contributor receives approval email
- [ ] Admin rejects draft → Contributor receives rejection email
- [ ] Emails contain correct content details
- [ ] Links in emails work correctly
- [ ] Email templates render properly

### 7. Integration Points

#### In Application Code
```typescript
// page.tsx - Submission handlers
handleAddProject() {
  // ... save draft ...
  if (currentUser.role === 'contributor') {
    notifyAdminOfNewSubmission({...})  // 📧 Send notification
  }
}

// page.tsx - Approval/Rejection handlers
handleApproveDraft() {
  // ... update status ...
  notifyContributorOfStatus({
    status: 'approved'  // 📧 Send notification
  })
}

handleRejectDraft() {
  // ... delete draft ...
  notifyContributorOfStatus({
    status: 'rejected'  // 📧 Send notification
  })
}
```

#### API Route
```typescript
// app/api/send-email/route.ts
POST /api/send-email
{
  to: "recipient@example.com",
  subject: "...",
  html: "...",
  text: "..."
}
```

### 8. Future Enhancements

- Email preferences (opt-in/opt-out)
- Batch/digest emails
- Email history tracking
- Retry failed sends
- Email templates with React Email
- In-app notifications
- SMS notifications
- Slack/Discord webhooks

---

## Quick Start

1. **Development Testing**: No setup needed! Check browser console for email logs.

2. **Enable Production Emails**: 
   - Choose email service (SendGrid/Resend/SMTP)
   - Install npm package
   - Set environment variables
   - Update `app/api/send-email/route.ts`

3. **Test Workflow**:
   - Submit content as contributor
   - Review in Pending Approvals
   - Approve or reject
   - Check recipient inbox

See `docs/EMAIL_NOTIFICATIONS.md` for detailed setup instructions.
