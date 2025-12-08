-- Create project_briefs table
CREATE TABLE IF NOT EXISTS project_briefs (
  id BIGSERIAL PRIMARY KEY,
  project_name TEXT NOT NULL,
  project_type TEXT,
  location TEXT NOT NULL,
  financing_amount TEXT,
  financiers TEXT,
  financial_instruments TEXT,
  other_partners_involved TEXT,
  timeline_and_status TEXT,
  safeguard_categories TEXT,
  negative_impacts TEXT,
  reprisals TEXT,
  advocacy_timeline TEXT,
  other_information TEXT,
  country TEXT,
  status TEXT DEFAULT 'published',
  submitted_by TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on country for faster filtering
CREATE INDEX IF NOT EXISTS idx_project_briefs_country ON project_briefs(country);

-- Create index on status for filtering published/draft
CREATE INDEX IF NOT EXISTS idx_project_briefs_status ON project_briefs(status);

-- Add RLS (Row Level Security) policies
ALTER TABLE project_briefs ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published briefs
CREATE POLICY "Public can view published briefs"
  ON project_briefs
  FOR SELECT
  USING (status = 'published');

-- Policy: Authenticated users can view all briefs
CREATE POLICY "Authenticated users can view all briefs"
  ON project_briefs
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can insert briefs
CREATE POLICY "Authenticated users can insert briefs"
  ON project_briefs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update briefs
CREATE POLICY "Authenticated users can update briefs"
  ON project_briefs
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can delete briefs
CREATE POLICY "Authenticated users can delete briefs"
  ON project_briefs
  FOR DELETE
  TO authenticated
  USING (true);
