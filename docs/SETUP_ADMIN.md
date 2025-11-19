# Quick Setup Guide: Create Your Super Admin Account

## Step 1: Set Up Environment Variables

1. Copy the example file to create your actual environment file:
```bash
cp .env.local.example .env.local
```

2. Open `.env.local` and fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**To get these values:**
- Go to [https://app.supabase.com](https://app.supabase.com)
- Select your project (or create a new one)
- Go to **Settings** → **API**
- Copy the values:
  - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
  - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

## Step 2: Run Database Migration

1. Go to your Supabase project: [https://app.supabase.com](https://app.supabase.com)
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire SQL code from `docs/TEAM_MANAGEMENT_SETUP.md` (starting from "-- Create profiles table")
5. Paste it into the SQL Editor
6. Click **Run** or press `Ctrl+Enter`

This will create:
- The `profiles` table
- All necessary security policies
- Triggers for automatic profile creation
- Indexes for performance

## Step 3: Create Your First Super Admin

### Option A: Through Supabase Dashboard (Recommended)

1. In Supabase, go to **Authentication** → **Users**
2. Click **Add user**
3. Enter your email and a temporary password
4. Check "Auto Confirm User"
5. Click **Create user**

6. Then, go to **SQL Editor** and run:
```sql
UPDATE public.profiles
SET role = 'super-admin'
WHERE email = 'your-email@example.com';
```

### Option B: Through Sign-Up Page (If Available)

1. Start your development server: `npm run dev`
2. Go to the sign-up page (if you have one)
3. Create an account
4. Then update the role in Supabase SQL Editor (see above)

## Step 4: Configure Email Template (Optional but Recommended)

1. In Supabase, go to **Authentication** → **Email Templates**
2. Select **Invite user** template
3. Replace the content with:
```html
<h2>You've been invited!</h2>
<p>You have been invited to join the team. Click the link below to accept the invitation and set your password:</p>
<p><a href="{{ .SiteURL }}/auth/accept-invite?token={{ .Token }}&type=invite">Accept Invitation</a></p>
<p>This link expires in 24 hours.</p>
```

## Step 5: Test Your Setup

1. Start your development server:
```bash
npm run dev
```

2. Go to `http://localhost:3000`

3. Click the **user icon** in the top-right corner to go to login

4. Log in with your super-admin credentials

5. You should be redirected to `/admin` - your admin dashboard!

## Troubleshooting

### Can't log in?
- Check that your email/password are correct
- Verify the user exists in **Supabase → Authentication → Users**
- Make sure you updated the role to 'super-admin' in the profiles table

### "Authentication error" or "Invalid credentials"?
- Double-check your `.env.local` file has the correct Supabase keys
- Restart your development server after changing environment variables
- Check Supabase logs for detailed errors

### Need to reset your password?
1. In Supabase, go to **Authentication → Users**
2. Find your user
3. Click the three dots (•••) → **Reset Password**
4. You'll receive a password reset email

## Next Steps

Once you're logged in as super-admin:
1. Navigate to **Team Management** (in the admin sidebar)
2. Click **Invite Member** to add more team members
3. They'll receive an invitation email to set their password and join

---

**Need Help?**
- Check `docs/TEAM_MANAGEMENT_SETUP.md` for detailed documentation
- Review the Supabase logs for error messages
- Make sure all SQL migrations ran successfully
