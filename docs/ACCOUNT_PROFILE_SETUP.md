# Account Profile Setup

## Overview
The Account Profile feature allows users to manage their profile information including uploading an avatar, updating their full name, and viewing their account details.

## Features
- Upload profile avatar (JPG, PNG, or GIF, max 2MB)
- Update full name
- View email and role (read-only)
- Responsive design matching the admin dashboard style
- Built with shadcn/ui components

## Setup Instructions

### 1. Run Storage Setup SQL

Run the storage setup SQL to create the `user-avatars` bucket:

```bash
# In your Supabase SQL Editor, run:
supabase/setup-storage.sql
```

Or manually create the bucket in Supabase Dashboard:
1. Go to Storage in your Supabase Dashboard
2. Click "Create a new bucket"
3. Name it `user-avatars`
4. Make it public
5. Add the storage policies from `setup-storage.sql`

### 2. Verify Storage Bucket

Check that the `user-avatars` bucket exists:
- Go to Supabase Dashboard > Storage
- You should see `user-avatars` bucket listed

### 3. Test the Feature

1. Login to the admin dashboard
2. Click on your user avatar in the sidebar footer
3. Click "Account Profile"
4. Upload an avatar by clicking on the avatar placeholder
5. Update your full name
6. Click "Save Changes"

## Technical Details

### Components
- **AccountProfile** (`src/components/features/admin/AccountProfile.tsx`)
  - Main profile management component
  - Handles avatar upload to Supabase Storage
  - Updates user profile in `profiles` table

### Data Service
- **updateUserProfile** (`src/lib/services/data-service.ts`)
  - Service function for updating user profiles
  - Follows the hybrid pattern (Supabase + localStorage fallback)

### Storage Structure
```
user-avatars/
  └── avatars/
      └── {user_id}-{timestamp}.{ext}
```

### Database Schema
The feature uses the existing `profiles` table:
```sql
profiles (
  id uuid PRIMARY KEY,
  email text,
  role text,
  full_name text,
  avatar_url text,  -- URL to avatar in storage
  created_at timestamptz,
  updated_at timestamptz
)
```

## Navigation

Users can access their Account Profile in two ways:

1. **From the User Menu**
   - Click the user avatar in the sidebar footer
   - Click "Account Profile" in the dropdown

2. **Admin Sidebar**
   - The page is registered as `account-profile` in the AdminPage type
   - Can be navigated to programmatically via `setActivePage('account-profile')`

## Security

- Only authenticated users can upload/update avatars
- Avatar uploads are scoped to the `avatars/` folder
- Public read access for viewing avatars
- Profile updates only affect the current user's data

## Future Enhancements

Potential improvements for the Account Profile feature:
- Change password functionality
- Two-factor authentication settings
- Email notification preferences
- Session management (view/revoke active sessions)
- Profile privacy settings
