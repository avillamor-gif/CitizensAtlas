# Authentication System with shadcn UI and Supabase

## Overview

The application now includes a complete authentication system using **shadcn UI** components and **Supabase Auth**. This provides a modern, secure, and beautiful authentication experience.

## Features

- ✅ **Sign In** - Email and password authentication
- ✅ **Sign Up** - User registration with email verification
- ✅ **Forgot Password** - Password reset via email
- ✅ **Protected Routes** - Automatic redirect for unauthenticated users
- ✅ **Session Management** - Persistent authentication state
- ✅ **Modern UI** - Beautiful forms with shadcn UI components

## Setup

### 1. Supabase Configuration

Make sure your `.env.local` file has the Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Enable Email Auth in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Providers**
3. Enable **Email** provider
4. Configure email templates (optional)
5. Set up SMTP settings for custom emails (optional)

### 3. Configure Auth Settings

In Supabase Dashboard → **Authentication** → **Settings**:

- Set **Site URL** to your application URL (e.g., `http://localhost:3000`)
- Add **Redirect URLs**: `http://localhost:3000/auth/**`
- Enable **Email Confirmation** (recommended for production)

## Usage

### Authentication Pages

The following auth pages are available:

- `/auth/login` - Sign in page
- `/auth/signup` - Sign up page
- `/auth/forgot-password` - Password reset page

### Using the Auth Context

The `AuthContext` provides authentication state and methods throughout your app:

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, session, loading, signIn, signUp, signOut, resetPassword } = useAuth();

  // Check if user is authenticated
  if (user) {
    return <div>Welcome, {user.email}</div>;
  }

  return <div>Please sign in</div>;
}
```

### Protecting Routes

To protect a page or component, wrap it with `ProtectedRoute`:

```typescript
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <div>Admin Content</div>
    </ProtectedRoute>
  );
}
```

### Sign In

```typescript
const { signIn } = useAuth();

const handleLogin = async () => {
  const { error } = await signIn('user@example.com', 'password');
  
  if (error) {
    console.error('Login failed:', error.message);
  } else {
    // User is signed in
    router.push('/dashboard');
  }
};
```

### Sign Up

```typescript
const { signUp } = useAuth();

const handleSignup = async () => {
  const { error } = await signUp('user@example.com', 'password', {
    full_name: 'John Doe',
    role: 'contributor'
  });
  
  if (error) {
    console.error('Signup failed:', error.message);
  } else {
    // Check email for verification link
  }
};
```

### Sign Out

```typescript
const { signOut } = useAuth();

const handleLogout = async () => {
  await signOut();
  router.push('/');
};
```

### Reset Password

```typescript
const { resetPassword } = useAuth();

const handleReset = async () => {
  const { error } = await resetPassword('user@example.com');
  
  if (error) {
    console.error('Reset failed:', error.message);
  } else {
    // Check email for reset link
  }
};
```

## Components

### shadcn UI Components

The following shadcn UI components are included:

- **Button** - `/src/components/ui/button.tsx`
- **Input** - `/src/components/ui/input.tsx`
- **Label** - `/src/components/ui/label.tsx`
- **Card** - `/src/components/ui/card.tsx`

All components follow your app's color scheme (`#0d234f`).

### Auth Components

- **LoginForm** - `/src/components/auth/LoginForm.tsx`
- **SignupForm** - `/src/components/auth/SignupForm.tsx`
- **ForgotPasswordForm** - `/src/components/auth/ForgotPasswordForm.tsx`
- **ProtectedRoute** - `/src/components/auth/ProtectedRoute.tsx`

## User Roles

Users can have the following roles (stored in `user.user_metadata.role`):

- `super-admin` - Full access to all features
- `admin` - Can manage content and users
- `contributor` - Can create and submit content

### Checking User Role

```typescript
const { user } = useAuth();

const role = user?.user_metadata?.role;

if (role === 'super-admin') {
  // Show admin features
}
```

## Supabase Database Schema

You may want to create a `profiles` table to store additional user data:

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'contributor',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create trigger to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'contributor')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Styling

All authentication UI uses your brand colors:

- Primary: `#0d234f` (brand dark blue)
- Hover: `#081629` (darker blue)
- Background: `bg-gray-50`
- Error: Red tones
- Success: Green tones

## Error Handling

All authentication methods return an error object:

```typescript
const { error } = await signIn(email, password);

if (error) {
  // Handle specific error cases
  if (error.message.includes('Invalid')) {
    setError('Invalid credentials');
  } else if (error.message.includes('Email')) {
    setError('Email not verified');
  } else {
    setError(error.message);
  }
}
```

## Security Best Practices

1. **Always use HTTPS in production**
2. **Enable email verification** for new users
3. **Set strong password requirements** (minimum 6 characters)
4. **Use Row Level Security (RLS)** in Supabase
5. **Implement rate limiting** for auth endpoints
6. **Store sensitive data** in environment variables
7. **Never expose** `SUPABASE_SERVICE_ROLE_KEY` on the client

## Testing

To test authentication locally:

1. Start your dev server: `npm run dev`
2. Visit `http://localhost:3000/auth/signup`
3. Create a test account
4. Check Supabase Dashboard → **Authentication** → **Users**
5. Verify email (or disable email verification for testing)
6. Sign in at `http://localhost:3000/auth/login`

## Troubleshooting

### Email Not Sending

- Check SMTP settings in Supabase
- Verify email templates are configured
- Check spam folder
- For testing, disable email confirmation in Supabase settings

### Redirect Issues

- Verify Site URL in Supabase settings
- Check Redirect URLs configuration
- Ensure `redirectTo` parameter is correct

### Session Not Persisting

- Check if cookies are enabled in browser
- Verify Supabase client is properly configured
- Check for CORS issues

## Next Steps

To complete the integration:

1. Add user profile page
2. Implement role-based access control throughout the app
3. Add user management for admins
4. Create email templates in Supabase
5. Add social auth providers (Google, GitHub, etc.)
6. Implement 2FA (two-factor authentication)

## Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [shadcn UI Documentation](https://ui.shadcn.com/)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
