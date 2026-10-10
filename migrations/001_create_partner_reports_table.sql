-- Create partner_reports table in Supabase
-- Run this migration in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS partner_reports (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date TEXT NOT NULL,
  region TEXT NOT NULL,
  photos TEXT[] DEFAULT '{}',
  issue TEXT NOT NULL,
  consulted TEXT NOT NULL CHECK (consulted IN ('Yes', 'No', 'Not sure')),
  operating_company TEXT,
  observations TEXT NOT NULL,
  relevant_links TEXT[] DEFAULT '{}',
  privacy_accepted BOOLEAN NOT NULL DEFAULT TRUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_partner_reports_status ON partner_reports(status);
CREATE INDEX IF NOT EXISTS idx_partner_reports_email ON partner_reports(email);
CREATE INDEX IF NOT EXISTS idx_partner_reports_submitted_at ON partner_reports(submitted_at DESC);

-- Create trigger to update updated_at automatically
CREATE OR REPLACE FUNCTION update_partner_reports_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER partner_reports_updated_at_trigger
BEFORE UPDATE ON partner_reports
FOR EACH ROW
EXECUTE FUNCTION update_partner_reports_timestamp();

-- Grant access to authenticated users (if using row-level security)
ALTER TABLE partner_reports ENABLE ROW LEVEL SECURITY;

-- Allow service role to do everything
CREATE POLICY "service_role_all" ON partner_reports
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Allow authenticated admins to read/write (requires admin role setup)
CREATE POLICY "admins_manage_reports" ON partner_reports
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
