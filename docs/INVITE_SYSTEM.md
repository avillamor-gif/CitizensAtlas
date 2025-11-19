# Invite Member System - Implementation Summary

## Overview

The application now uses an **invitation-only** user management system instead of public signup. Only administrators and super-admins can invite new team members.

## Features

✅ **Invite Member Dialog** - shadcn UI styled dialog for inviting users  
✅ **Team Management Page** - View and manage all team members  
✅ **Role-Based Invitations** - Assign contributor, admin, or super-admin roles  
✅ **Secure API Endpoint** - Server-side invitation handling with Supabase Admin API  
✅ **Email Invitations** - Automatic invitation emails with setup links  
✅ **Invitation Acceptance** - Password setup page for new users  
✅ **No Public Signup** - Signup page replaced with invitation-only message  

## Architecture

### Components Created

1. **InviteMemberDialog** (`src/components/auth/InviteMemberDialog.tsx`)
   - Full name, email, and role selection
   - Form validation and error handling
   - Success state with animation
   - Uses shadcn UI components (Dialog, Input, Select, Button)

2. **TeamManagement** (`src/components/features/admin/TeamManagement.tsx`)
   - Lists all team members from profiles table
   - Shows member details (name, email, role, joined date, last sign in)
   - Invite member button
   - Remove member action (requires admin access)
   - Empty state with CTA

3. **Accept Invite Page** (`app/auth/accept-invite/page.tsx`)
   - Token validation
   - Password setup form
   - Password confirmation
   - Error handling for expired/invalid tokens

### API Routes

4. **Invite API** (`app/api/admin/invite/route.ts`)
   - Uses Supabase Service Role Key (admin privileges)
   - Validates email, full name, and role
   - Calls `supabase.auth.admin.inviteUserByEmail()`
   - Sends invitation email with redirect to accept-invite page

### Updated Components

5. **AdminSidebar** - Added "Team Management" menu item (admin/super-admin only)
6. **AdminDashboard** - Added team-management page routing
7. **Signup Page** - Replaced with invitation-only message
8. **LoginForm** - Removed signup link, added admin contact message

## User Flow

```
Admin invites user
    ↓
User receives email with invitation link
    ↓
User clicks link → /auth/accept-invite?token=xxx&type=invite
    ↓
User sets password
    ↓
Profile created automatically (trigger)
    ↓
User redirected to /admin dashboard
```

## Database Schema

### profiles Table

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,           -- References auth.users(id)
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL,            -- 'contributor', 'admin', 'super-admin'
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  last_sign_in_at TIMESTAMP
);
```

### Automatic Profile Creation

A database trigger automatically creates a profile when a user is invited:

```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

## Security

### Row Level Security (RLS)

- Users can view and update their own profile
- Admins and super-admins can view and update all profiles
- Role changes require admin privileges
- Enforced at database level

### Service Role Key

The `/api/admin/invite` endpoint uses `SUPABASE_SERVICE_ROLE_KEY` which bypasses RLS and has admin privileges. This key:
- Is only used server-side (API routes)
- Never exposed to the client
- Allows admin operations like inviting users

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Server-only!
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Setup Instructions

See `docs/TEAM_MANAGEMENT_SETUP.md` for:
- Database migration SQL
- Email template configuration
- Manual admin creation
- Troubleshooting guide

## Usage

### As an Admin

1. Navigate to Admin Dashboard
2. Click "Team Management" in the sidebar
3. Click "Invite Member" button
4. Fill in:
   - Full Name
   - Email Address
   - Role (contributor, admin, super-admin)
5. Click "Send Invitation"
6. User receives email with setup link

### As a New User

1. Check email for invitation
2. Click "Accept Invitation" link
3. Set password (minimum 8 characters)
4. Confirm password
5. Click "Complete Setup"
6. Redirected to admin dashboard

## Role Permissions

### Contributor
- Create and submit content for approval
- View own submissions
- Cannot approve or delete content
- Cannot invite users

### Admin
- All contributor permissions
- Approve/reject submissions
- Manage all content
- Batch upload
- Invite contributors and admins
- View team management

### Super Admin
- All admin permissions
- Manage super-admins
- Access to pending approvals
- Full system access

## UI Components Used

Built with shadcn UI components:
- **Dialog** - Modal wrapper for invite form
- **Button** - Brand-styled buttons (#0d234f)
- **Input** - Form inputs with focus states
- **Label** - Form labels
- **Select** - Dropdown for role selection
- **Card** - Container components

## Files Modified/Created

### New Files
```
src/components/auth/InviteMemberDialog.tsx
src/components/features/admin/TeamManagement.tsx
src/components/ui/dialog.tsx
src/components/ui/select.tsx
app/api/admin/invite/route.ts
app/auth/accept-invite/page.tsx
docs/TEAM_MANAGEMENT_SETUP.md
docs/INVITE_SYSTEM.md
```

### Modified Files
```
src/components/features/admin/AdminSidebar.tsx
src/components/features/admin/AdminDashboard.tsx
src/components/auth/LoginForm.tsx
app/auth/signup/page.tsx
```

## Next Steps

1. **Run Database Migration**
   - Execute SQL from `docs/TEAM_MANAGEMENT_SETUP.md`
   - Verify profiles table exists

2. **Configure Environment**
   - Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`
   - Set `NEXT_PUBLIC_SITE_URL`

3. **Setup Email Templates**
   - Configure invite email in Supabase Dashboard
   - Test email delivery

4. **Create First Admin**
   - Manually set role to 'super-admin' in profiles table
   - Or use SQL to update first user

5. **Test Invite Flow**
   - Invite a test user
   - Verify email received
   - Complete invitation acceptance
   - Check profile created in database

## Benefits

✅ **More Secure** - No public registration endpoint  
✅ **Controlled Access** - Admins control who joins  
✅ **Better UX** - Streamlined onboarding process  
✅ **Role Management** - Assign roles during invitation  
✅ **Audit Trail** - Track who invited whom  
✅ **Email Verification** - Built into invitation process  

## Troubleshooting

### Common Issues

**Email not sending:**
- Check Supabase email settings
- Verify SMTP configuration
- Test with different email provider

**Service role key error:**
- Ensure key is in `.env.local`
- Restart dev server after adding
- Check key has correct permissions

**Profile not created:**
- Verify database trigger exists
- Check trigger function syntax
- Manually inspect auth.users and profiles tables

**Token invalid:**
- Tokens expire in 24 hours
- Regenerate invitation for expired links
- Check URL parameters are correct

For detailed troubleshooting, see `docs/TEAM_MANAGEMENT_SETUP.md`.
