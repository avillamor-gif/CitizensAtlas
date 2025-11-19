# Database Setup for Team Management

## Prerequisites
- Supabase project set up
- Service role key configured in `.env.local`

## Environment Variables

Add the following to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

⚠️ **Important**: The `SUPABASE_SERVICE_ROLE_KEY` should NEVER be exposed to the client. It's only used in API routes.

## SQL Migration

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'contributor' CHECK (role IN ('contributor', 'admin', 'super-admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  last_sign_in_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Allow admins and super-admins to view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'super-admin')
    )
  );

-- Allow users to update their own profile (except role)
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );

-- Allow admins and super-admins to update profiles (including role)
CREATE POLICY "Admins can update profiles"
  ON public.profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'super-admin')
    )
  );

-- Create a function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'contributor')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create a function to update last_sign_in_at
CREATE OR REPLACE FUNCTION public.handle_user_login()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.last_sign_in_at IS DISTINCT FROM OLD.last_sign_in_at THEN
    UPDATE public.profiles
    SET last_sign_in_at = NEW.last_sign_in_at,
        updated_at = NOW()
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to update last_sign_in_at on auth.users
DROP TRIGGER IF EXISTS on_auth_user_login ON auth.users;
CREATE TRIGGER on_auth_user_login
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_login();

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
```

## Email Templates

### Configure Invite Email Template in Supabase

1. Go to Authentication > Email Templates in your Supabase dashboard
2. Select "Invite user" template
3. Update the template:

```html
<h2>You've been invited!</h2>
<p>You have been invited to join the team. Click the link below to accept the invitation and set your password:</p>
<p><a href="{{ .SiteURL }}/auth/accept-invite?token={{ .Token }}&type=invite">Accept Invitation</a></p>
<p>This link expires in 24 hours.</p>
```

## Testing the Invite System

1. Make sure your environment variables are set correctly
2. Log in as an admin or super-admin user
3. Navigate to the Team Management page in the admin dashboard
4. Click "Invite Member"
5. Fill in the email, full name, and role
6. The user will receive an invitation email
7. They can click the link to set their password and join

## Manual Admin Creation

To create your first super-admin user manually:

```sql
-- First, create the user through Supabase Auth (or sign up)
-- Then, update their role in the profiles table:

UPDATE public.profiles
SET role = 'super-admin'
WHERE email = 'your-admin@example.com';
```

## Troubleshooting

### "Failed to send invitation" Error
- Check that `SUPABASE_SERVICE_ROLE_KEY` is set correctly in `.env.local`
- Make sure the email doesn't already exist in the system
- Check Supabase logs for detailed error messages

### Users Not Appearing in Team Management
- Verify the profiles table exists and has data
- Check that the trigger is creating profiles on user signup
- Manually inspect the profiles table in Supabase

### Email Not Sending
- Verify email settings in Supabase Dashboard
- Check that SMTP is configured (or using Supabase's default email service)
- Test with a different email address

## Security Notes

1. **Service Role Key**: Never expose the service role key to the client. It should only be used in API routes.
2. **Row Level Security**: All policies are enforced at the database level
3. **Role Changes**: Only admins can change user roles
4. **Email Verification**: Users must verify their email through the invitation link
