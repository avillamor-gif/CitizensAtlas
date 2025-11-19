# Mailgun Email Setup Guide

This guide walks you through setting up Mailgun for email notifications in your Atlas application.

## Why Mailgun?

- ✅ **Free tier**: 5,000 emails/month for 3 months, then 1,000/month
- ✅ **Reliable**: Used by thousands of companies
- ✅ **Easy setup**: Simple API integration
- ✅ **Sandbox domain**: Test without verifying your domain
- ✅ **Email validation**: Built-in email verification
- ✅ **Analytics**: Detailed delivery tracking

## Quick Setup (5 minutes)

### Step 1: Create Mailgun Account

1. Go to [https://www.mailgun.com/](https://www.mailgun.com/)
2. Click "Sign Up" (free account)
3. Verify your email address
4. Complete the registration

### Step 2: Get Your API Key

1. Log in to Mailgun dashboard
2. Go to **Settings** → **API Keys**
3. Find your **Private API key** (starts with `key-...`)
4. Click "Copy" to copy it

### Step 3: Get Your Domain

You have two options:

#### Option A: Use Sandbox Domain (Testing)
Perfect for development and testing!

1. In Mailgun dashboard, go to **Sending** → **Domains**
2. You'll see a **Sandbox domain** like: `sandboxXXXXXXXX.mailgun.org`
3. Copy this domain name
4. **Important**: Add authorized recipients:
   - Click on your sandbox domain
   - Go to **Authorized Recipients**
   - Add your email address (the one you want to receive test emails)
   - Verify it by clicking the link in the confirmation email

#### Option B: Use Your Own Domain (Production)
For sending to any email address:

1. In Mailgun dashboard, go to **Sending** → **Domains**
2. Click **Add New Domain**
3. Enter your domain (e.g., `mg.yourdomain.com`)
4. Follow DNS setup instructions (add MX, TXT, CNAME records)
5. Wait for verification (usually 24-48 hours)

### Step 4: Configure Environment Variables

Create or edit `.env.local` in your project root:

```bash
# Mailgun Configuration
MAILGUN_API_KEY=key-your_private_api_key_here
MAILGUN_DOMAIN=sandboxXXXXXXXX.mailgun.org  # or your custom domain
MAILGUN_FROM=Atlas Notifications <noreply@sandboxXXXXXXXX.mailgun.org>

# Admin email (receives submission notifications)
NEXT_PUBLIC_ADMIN_EMAIL=your-admin-email@example.com

# App URL (for links in emails)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important**: 
- Replace `key-your_private_api_key_here` with your actual API key
- Replace `sandboxXXXXXXXX.mailgun.org` with your sandbox domain
- Update the `from` email to match your domain

### Step 5: Test the Integration

1. **Restart your development server**:
   ```bash
   # Stop the current dev server (Ctrl+C)
   npm run dev
   ```

2. **Submit test content**:
   - Log in to admin panel (`?admin=true`)
   - Switch to contributor role (in code: set `currentUser.role = 'contributor'`)
   - Submit a project, news, publication, or video
   - Check your terminal for email logs
   - Check your email inbox!

3. **Test approval notification**:
   - Go to "Pending Approvals"
   - Approve a draft
   - Check the console and email inbox

## Troubleshooting

### ❌ "Email logged (Mailgun not configured)"

**Problem**: Environment variables not set or server not restarted.

**Solution**:
1. Check `.env.local` exists and has correct values
2. Restart dev server: `npm run dev`
3. Verify variables are loaded: Add `console.log(process.env.MAILGUN_API_KEY)` in API route

### ❌ "Sandbox domain recipients not authorized"

**Problem**: Trying to send to email that's not authorized in sandbox.

**Solution**:
1. Go to Mailgun dashboard → Your sandbox domain
2. Click "Authorized Recipients"
3. Add the recipient email address
4. Check that email for verification link
5. Click the verification link

### ❌ "Invalid domain or API key"

**Problem**: Wrong credentials or typo.

**Solution**:
1. Double-check API key copied correctly (no extra spaces)
2. Verify domain name is exact (case-sensitive)
3. Make sure you're using **Private API key**, not Public key
4. Try regenerating API key in Mailgun dashboard

### ❌ Emails not arriving

**Problem**: Emails sent but not received.

**Solution**:
1. Check spam/junk folder
2. Verify email address is authorized (for sandbox)
3. Check Mailgun **Logs** tab in dashboard for delivery status
4. Look for bounce/failure messages
5. Wait a few minutes (sometimes delayed)

## Example `.env.local` File

```bash
# === Mailgun Email Service ===
MAILGUN_API_KEY=key-1234567890abcdef1234567890abcdef
MAILGUN_DOMAIN=sandbox1a2b3c4d5e6f7890a1b2c3d4e5f6789.mailgun.org
MAILGUN_FROM=Atlas CMS <noreply@sandbox1a2b3c4d5e6f7890a1b2c3d4e5f6789.mailgun.org>

# === Application Configuration ===
NEXT_PUBLIC_ADMIN_EMAIL=admin@yourdomain.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Verifying It Works

### Check Console Logs

When emails are sent successfully, you'll see:
```
✅ Email sent successfully via Mailgun: <message-id>
```

When Mailgun is not configured:
```
📧 Email would be sent (Mailgun not configured):
To: admin@example.com
Subject: New project submission awaiting approval
⚠️ To enable Mailgun, set MAILGUN_API_KEY and MAILGUN_DOMAIN in .env.local
```

### Check Mailgun Dashboard

1. Go to **Sending** → **Logs**
2. You'll see all sent emails
3. Click any email to see:
   - Delivery status
   - Opens/clicks (if tracking enabled)
   - Full email content
   - Error messages if failed

## Email Flow Diagram

```
┌─────────────────────┐
│  User Action        │
│  (Submit/Approve)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  notification.ts    │
│  notifyAdmin() or   │
│  notifyContributor()│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  /api/send-email    │
│  POST request       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Mailgun API        │
│  mg.messages.create │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Email Delivered    │
│  to Inbox 📧        │
└─────────────────────┘
```

## Production Checklist

Before going live:

- [ ] Verify your custom domain in Mailgun
- [ ] Update `MAILGUN_DOMAIN` to your custom domain
- [ ] Update `MAILGUN_FROM` to use your domain
- [ ] Set `NEXT_PUBLIC_APP_URL` to production URL
- [ ] Test emails to external addresses
- [ ] Set up proper error monitoring
- [ ] Configure email sending limits if needed
- [ ] Enable webhook for delivery tracking (optional)

## Advanced Features

### Enable Email Tracking

Add to your email sending code in `app/api/send-email/route.ts`:

```typescript
const emailData = {
  from: MAILGUN_FROM,
  to: Array.isArray(to) ? to : [to],
  subject,
  text,
  html,
  'o:tracking': 'yes',           // Track opens
  'o:tracking-clicks': 'yes',    // Track clicks
  'o:tracking-opens': 'yes',     // Track opens
};
```

### Webhooks for Delivery Status

1. Go to Mailgun → **Sending** → **Webhooks**
2. Add webhook URL: `https://yourdomain.com/api/mailgun-webhook`
3. Select events: delivered, opened, clicked, failed
4. Create API route to handle webhooks

### Batch Sending

For multiple recipients:

```typescript
const emailData = {
  from: MAILGUN_FROM,
  to: ['user1@example.com', 'user2@example.com', 'user3@example.com'],
  subject,
  html,
};
```

## Cost Estimation

### Free Tier
- **First 3 months**: 5,000 emails/month
- **After 3 months**: 1,000 emails/month
- Perfect for small projects and testing

### Paid Plans (if needed)
- **Foundation**: $35/month - 50,000 emails
- **Growth**: $80/month - 100,000 emails
- Pay-as-you-go: $0.80 per 1,000 emails

Most small to medium Atlas deployments will stay within free tier!

## Support Resources

- **Mailgun Docs**: https://documentation.mailgun.com/
- **API Reference**: https://documentation.mailgun.com/en/latest/api_reference.html
- **Support**: https://help.mailgun.com/
- **Status Page**: https://status.mailgun.com/

## Alternative: Using EU Region

If you need EU data residency:

```typescript
const mg = mailgun.client({
  username: 'api',
  key: MAILGUN_API_KEY,
  url: 'https://api.eu.mailgun.net', // EU region
});
```

Update `.env.local`:
```bash
MAILGUN_REGION=eu  # or us (default)
```

---

## Quick Start Summary

1. **Sign up**: https://www.mailgun.com/
2. **Get API key**: Settings → API Keys → Copy private key
3. **Get domain**: Use sandbox domain for testing
4. **Add to `.env.local`**: API key, domain, from address
5. **Authorize email**: Add your email to sandbox authorized recipients
6. **Restart server**: `npm run dev`
7. **Test**: Submit content and check email!

You're all set! 🎉 Emails will now be sent through Mailgun automatically.
