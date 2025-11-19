# Mailgun Quick Reference

## ⚡ Quick Setup (2 minutes)

```bash
# 1. Install (already done)
npm install mailgun.js form-data

# 2. Get credentials from Mailgun
# Go to: https://app.mailgun.com/app/sending/domains
# Copy: API Key and Sandbox Domain

# 3. Create .env.local
MAILGUN_API_KEY=key-xxxxxxxxxxxxx
MAILGUN_DOMAIN=sandboxXXXXXXXX.mailgun.org
MAILGUN_FROM=Atlas <noreply@sandboxXXXXXXXX.mailgun.org>
NEXT_PUBLIC_ADMIN_EMAIL=your-email@example.com

# 4. Authorize your email (for sandbox testing)
# Dashboard → Sandbox Domain → Authorized Recipients → Add Email

# 5. Restart server
npm run dev

# 6. Test it!
# Submit content as contributor → Check email
```

## 📧 Email Types Sent

| Trigger | Recipient | Subject |
|---------|-----------|---------|
| Contributor submits | Super Admin | "New [type] submission awaiting approval" |
| Admin approves | Contributor | "Your [type] submission has been approved" |
| Admin rejects | Contributor | "Your [type] submission has been rejected" |

## 🔧 Environment Variables

```bash
# Required
MAILGUN_API_KEY=key-xxxxx          # From Mailgun dashboard
MAILGUN_DOMAIN=sandbox.mailgun.org  # Your Mailgun domain
MAILGUN_FROM=noreply@yourdomain.com # Sender email

# Optional
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com    # Who receives notifications
NEXT_PUBLIC_APP_URL=http://localhost:3000    # For email links
```

## ✅ How to Test

### Test 1: Admin Notification (When Contributor Submits)
```typescript
// 1. In page.tsx, set currentUser to contributor:
const [currentUser, setCurrentUser] = useState<User>({
  id: '2',
  email: 'contributor@example.com',
  role: 'contributor',
  name: 'Test Contributor'
})

// 2. Submit any content (Project/News/Publication/Video)
// 3. Check console for: ✅ Email sent successfully via Mailgun
// 4. Check admin email inbox
```

### Test 2: Contributor Notification (When Admin Approves)
```typescript
// 1. Go to admin panel → Pending Approvals
// 2. Click "Approve" on a draft
// 3. Check console for: ✅ Email sent successfully via Mailgun
// 4. Check contributor email inbox (must be authorized in sandbox)
```

### Test 3: Rejection Notification
```typescript
// 1. Go to admin panel → Pending Approvals
// 2. Click "Reject" on a draft
// 3. Check contributor email inbox
```

## 🐛 Troubleshooting

### Problem: "Email logged (Mailgun not configured)"
```bash
# Check .env.local exists and has values
cat .env.local

# Restart dev server
pkill -f "next dev"
npm run dev
```

### Problem: "Sandbox domain recipients not authorized"
```bash
# Solution:
# 1. Go to: https://app.mailgun.com/app/sending/domains
# 2. Click your sandbox domain
# 3. Go to "Authorized Recipients"
# 4. Add recipient email
# 5. Check email and click verification link
```

### Problem: Emails not arriving
```bash
# Check Mailgun logs:
# https://app.mailgun.com/app/sending/logs

# Common issues:
# - Email in spam folder
# - Email not authorized (sandbox)
# - Wrong domain/API key
# - Typo in recipient email
```

## 📊 Checking Email Status

### In Console
```
✅ Email sent successfully via Mailgun: <20230615123456.1.ABC123@sandboxXXX.mailgun.org>
```

### In Mailgun Dashboard
1. Go to: https://app.mailgun.com/app/sending/logs
2. See real-time delivery status
3. Click any email to see:
   - Delivery confirmation
   - Open/click tracking
   - Full email content
   - Error messages

## 🔐 Security Notes

- ✅ Never commit `.env.local` to git
- ✅ Use environment variables only
- ✅ Rotate API keys periodically
- ✅ Use sandbox for testing
- ✅ Verify domain for production

## 📈 Monitoring

### Console Logs
```javascript
// Success
✅ Email sent successfully via Mailgun: <message-id>

// Not configured (development)
📧 Email would be sent (Mailgun not configured):
⚠️ To enable Mailgun, set MAILGUN_API_KEY and MAILGUN_DOMAIN

// Error
❌ Error sending email via Mailgun: [error details]
```

### Mailgun Dashboard
- **Logs**: See all sent emails
- **Analytics**: Delivery rates, opens, clicks
- **Suppressions**: Bounces, complaints, unsubscribes
- **Webhooks**: Set up delivery notifications

## 🚀 Production Checklist

- [ ] Verify custom domain in Mailgun
- [ ] Update `MAILGUN_DOMAIN` to custom domain
- [ ] Update `MAILGUN_FROM` email address
- [ ] Set `NEXT_PUBLIC_APP_URL` to production URL
- [ ] Test emails to external addresses
- [ ] Monitor Mailgun dashboard for issues
- [ ] Set up billing alerts in Mailgun
- [ ] Configure SPF/DKIM records for domain

## 💰 Costs

- **Free**: 5,000 emails/month (first 3 months)
- **Free**: 1,000 emails/month (after 3 months)
- **Paid**: $35/month for 50,000 emails

## 📚 Helpful Links

- **Setup Guide**: `docs/MAILGUN_SETUP.md`
- **Notification Flow**: `docs/NOTIFICATION_FLOW.md`
- **Mailgun Dashboard**: https://app.mailgun.com/
- **Mailgun Docs**: https://documentation.mailgun.com/
- **API Reference**: https://documentation.mailgun.com/en/latest/api_reference.html

## 🎯 Common Commands

```bash
# Install dependencies
npm install mailgun.js form-data

# Start dev server
npm run dev

# Check environment variables
echo $MAILGUN_API_KEY

# Test email endpoint directly (optional)
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "html": "<h1>Hello!</h1>",
    "text": "Hello!"
  }'
```

## 🆘 Support

If you need help:
1. Check `docs/MAILGUN_SETUP.md` for detailed setup
2. Review console logs for error messages
3. Check Mailgun dashboard logs
4. Verify environment variables are set
5. Ensure dev server restarted after config changes

---

**Quick Start**: Copy `.env.local.example` → `.env.local` → Fill in Mailgun credentials → Restart server → Test! 🎉
