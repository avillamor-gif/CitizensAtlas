-- Create notification_emails table for managing admin notification recipients
CREATE TABLE IF NOT EXISTS notification_emails (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  label TEXT, -- Optional label like "Primary Admin", "Secondary Admin", etc.
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT, -- User ID who created this config
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Enable RLS
ALTER TABLE notification_emails ENABLE ROW LEVEL SECURITY;

-- Create policies for notification_emails
-- Only authenticated super admins can view
CREATE POLICY "super_admins_can_view_notification_emails"
ON notification_emails
FOR SELECT
USING (
  (SELECT role FROM auth.users WHERE auth.users.id::text = auth.uid()::text LIMIT 1) = 'super_admin'
);

-- Only authenticated super admins can insert
CREATE POLICY "super_admins_can_insert_notification_emails"
ON notification_emails
FOR INSERT
WITH CHECK (
  (SELECT role FROM auth.users WHERE auth.users.id::text = auth.uid()::text LIMIT 1) = 'super_admin'
);

-- Only authenticated super admins can update
CREATE POLICY "super_admins_can_update_notification_emails"
ON notification_emails
FOR UPDATE
USING (
  (SELECT role FROM auth.users WHERE auth.users.id::text = auth.uid()::text LIMIT 1) = 'super_admin'
)
WITH CHECK (
  (SELECT role FROM auth.users WHERE auth.users.id::text = auth.uid()::text LIMIT 1) = 'super_admin'
);

-- Only authenticated super admins can delete
CREATE POLICY "super_admins_can_delete_notification_emails"
ON notification_emails
FOR DELETE
USING (
  (SELECT role FROM auth.users WHERE auth.users.id::text = auth.uid()::text LIMIT 1) = 'super_admin'
);

-- Create index for faster queries
CREATE INDEX idx_notification_emails_active ON notification_emails(is_active) WHERE is_active = true;
