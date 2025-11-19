# Supabase Invitation Setup Guide

## Problem
"Invalid Invitation" error when clicking invite link from email.

## Solution

### 1. Configure Supabase Authentication URLs

Go to **Supabase Dashboard** → **Authentication** → **URL Configuration**:

**Site URL:**
```
http://localhost:3000
```
(For production, use your actual domain)

**Redirect URLs:** Add these URLs (one per line):
```
http://localhost:3000/auth/accept-invite
http://localhost:3000/auth/callback
http://localhost:3000/auth/reset-password
http://localhost:3000/**
```

### 2. Update Email Template

Go to **Authentication** → **Email Templates** → **Invite user**

Replace the template with:

```html
<h2>You've been invited!</h2>
<p>You have been invited to join the team. Click the link below to accept the invitation and set your password:</p>
<p><a href="{{ .SiteURL }}/auth/accept-invite?token_hash={{ .TokenHash }}&type=invite">Accept Invitation</a></p>
<p>This link expires in 24 hours.</p>
```

**Important:** Use `{{ .TokenHash }}` NOT `{{ .Token }}`

### 3. How to Invite Users

#### Option A: Via Supabase Dashboard
1. Go to **Authentication** → **Users**
2. Click **Invite user**
3. Enter email address
4. User receives email with invitation link

#### Option B: Via API (programmatically)
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Need service role key
);

// Invite user
const { data, error } = await supabase.auth.admin.inviteUserByEmail(
  'user@example.com',
  {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/accept-invite`,
  }
);
```

### 4. Testing the Flow

1. Invite a test user via Supabase Dashboard
2. Check the email for the invitation link
3. Click the link - should go to `/auth/accept-invite?token_hash=...&type=invite`
4. Set password (minimum 8 characters)
5. Should redirect to admin dashboard

### 5. Troubleshooting

**Check browser console** for debug logs:
- "Invite params:" - shows what URL parameters were received
- "Verifying OTP with:" - shows what's being sent to Supabase
- Any error messages

**Common Issues:**

1. **"Invalid invitation link"**
   - Email template uses `{{ .Token }}` instead of `{{ .TokenHash }}`
   - Fix: Update email template to use `{{ .TokenHash }}`

2. **"This invitation link is invalid or has expired"**
   - Token expired (24 hours)
   - URL not in Redirect URLs list
   - Wrong domain/port

3. **"Failed to accept invitation"**
   - Check console for specific error
   - Verify redirect URLs in Supabase settings

### 6. After User Accepts Invitation

You'll need to update their profile role in the database:

```sql
-- Update user role after they accept invitation
UPDATE public.profiles
SET role = 'admin'  -- or 'super-admin', 'contributor'
WHERE email = 'user@example.com';
```

Or create a database trigger to automatically set a default role when profile is created.
