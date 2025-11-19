# Password Reset Configuration Guide

## Overview
This guide explains how to configure password reset functionality for your Atlas application with Supabase.

## What Was Created

1. **Reset Password Page**: `/app/auth/reset-password/page.tsx`
   - Handles the password reset token from email links
   - Allows users to set a new password

2. **Reset Password Form Component**: `/src/components/auth/ResetPasswordForm.tsx`
   - Form for entering and confirming new password
   - Validates password strength (minimum 6 characters)
   - Checks that passwords match
   - Automatically redirects to login after success

## Supabase Dashboard Configuration

### Step 1: Configure Redirect URLs

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: **srsjynjccivtjvordrlc**
3. Navigate to **Authentication** → **URL Configuration**
4. Add the following URLs to **Redirect URLs**:
   ```
   http://localhost:3000/auth/reset-password
   https://your-production-domain.com/auth/reset-password
   ```
5. Click **Save**

### Step 2: Customize Email Templates (Optional)

1. In Supabase Dashboard, go to **Authentication** → **Email Templates**
2. Select **Reset Password** template
3. The default template should work, but you can customize it
4. Make sure the confirmation URL uses: `{{ .ConfirmationURL }}`

## How Password Reset Works

### User Flow:
1. User clicks "Forgot password?" on login page
2. User enters their email address
3. User receives an email with a reset link
4. User clicks the link (redirects to `/auth/reset-password`)
5. User enters and confirms new password
6. User is redirected to login page
7. User logs in with new password

### Technical Flow:
1. `ForgotPasswordForm.tsx` calls `resetPassword(email)`
2. `AuthContext` calls `supabase.auth.resetPasswordForEmail()` with:
   - User's email
   - Redirect URL: `${window.location.origin}/auth/reset-password`
3. Supabase sends email with magic link containing recovery token
4. User clicks link → lands on `/auth/reset-password` with token in URL
5. `ResetPasswordForm.tsx` validates session and shows password form
6. User submits → calls `supabase.auth.updateUser({ password })`
7. Success → redirect to `/auth/login`

## Testing the Flow

### 1. Request Password Reset
```bash
# Start your dev server
npm run dev

# Navigate to login page
http://localhost:3000/auth/login

# Click "Forgot password?"
# Enter your email address
# Click "Send Reset Link"
```

### 2. Check Your Email
- Look for email from Supabase
- Subject: "Reset Your Password"
- Click the reset link

### 3. Set New Password
- You should land on the reset password page
- Enter your new password (min 6 characters)
- Confirm the password
- Click "Update Password"

### 4. Login with New Password
- You'll be redirected to login
- Enter your email and new password
- You should be able to login successfully

## Troubleshooting

### Issue: Email not received
**Solution:**
- Check spam/junk folder
- Verify email in Supabase Dashboard → Authentication → Users
- Check Supabase logs: Authentication → Logs

### Issue: Reset link redirects to home page
**Solution:**
- Make sure redirect URL is added to Supabase Dashboard
- Check that URL matches exactly: `http://localhost:3000/auth/reset-password`
- Restart your dev server after adding redirect URLs

### Issue: "Invalid or expired password reset link"
**Solution:**
- Reset links expire after 1 hour by default
- Request a new password reset email
- Make sure you're using the latest link

### Issue: Cannot update password
**Solution:**
- Make sure passwords match
- Ensure password is at least 6 characters
- Check browser console for errors
- Verify Supabase connection in Network tab

## Security Notes

- Reset links expire after 1 hour (Supabase default)
- Links are single-use only
- Password must be at least 6 characters (you can increase this in the form)
- Supabase handles password hashing automatically
- Session is created automatically after password reset

## Production Deployment

Before deploying to production:

1. Add your production domain to Supabase redirect URLs:
   ```
   https://your-domain.com/auth/reset-password
   ```

2. Update Site URL in Supabase:
   - Go to Authentication → URL Configuration
   - Set **Site URL** to your production domain
   - Example: `https://your-domain.com`

3. Configure Email Provider (recommended):
   - Go to Project Settings → Auth → SMTP Settings
   - Configure your own SMTP server for reliable email delivery
   - Supabase's default email has limits and may be flagged as spam

## Related Files

- `/app/auth/reset-password/page.tsx` - Reset password page
- `/src/components/auth/ResetPasswordForm.tsx` - Reset password form
- `/app/auth/forgot-password/page.tsx` - Forgot password page
- `/src/components/auth/ForgotPasswordForm.tsx` - Forgot password form
- `/src/contexts/AuthContext.tsx` - Auth context with resetPassword function
- `/src/components/auth/LoginForm.tsx` - Login form with "Forgot password?" link

## Next Steps

1. ✅ Password reset pages created
2. ⚠️ **Configure redirect URLs in Supabase Dashboard** (required!)
3. ⚠️ Test the complete flow
4. Consider customizing email templates
5. Set up custom SMTP for production
