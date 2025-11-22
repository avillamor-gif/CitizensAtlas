-- ============================================
-- PAGE CONTENT TABLE
-- ============================================
-- Stores editable content for pages like "What We Do"
-- Each card can have customizable title, icon reference, and content

CREATE TABLE IF NOT EXISTS page_content (
  id BIGSERIAL PRIMARY KEY,
  page_name TEXT NOT NULL, -- e.g., 'what-we-do', 'about', etc.
  card_id TEXT NOT NULL, -- e.g., 'map-false-solutions', 'investigate-corruption'
  title TEXT NOT NULL,
  icon_name TEXT, -- Reference to icon component name
  content TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_name, card_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_page_content_page ON page_content(page_name);
CREATE INDEX IF NOT EXISTS idx_page_content_order ON page_content(page_name, display_order);

-- Enable Row Level Security
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read page content" ON page_content;
DROP POLICY IF EXISTS "Admins can insert page content" ON page_content;
DROP POLICY IF EXISTS "Admins can update page content" ON page_content;
DROP POLICY IF EXISTS "Super admins can delete page content" ON page_content;

-- Policy: Anyone can read page content
CREATE POLICY "Anyone can read page content"
  ON page_content
  FOR SELECT
  USING (true);

-- Policy: Only super-admins and admins can insert
CREATE POLICY "Admins can insert page content"
  ON page_content
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super-admin', 'admin')
    )
  );

-- Policy: Only super-admins and admins can update
CREATE POLICY "Admins can update page content"
  ON page_content
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super-admin', 'admin')
    )
  );

-- Policy: Only super-admins can delete
CREATE POLICY "Super admins can delete page content"
  ON page_content
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super-admin'
    )
  );

-- Trigger: Update timestamp on changes
CREATE OR REPLACE FUNCTION update_page_content_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_page_content_timestamp ON page_content;

CREATE TRIGGER trigger_update_page_content_timestamp
  BEFORE UPDATE ON page_content
  FOR EACH ROW
  EXECUTE FUNCTION update_page_content_timestamp();

-- Insert default "What We Do" content
INSERT INTO page_content (page_name, card_id, title, icon_name, content, display_order) VALUES
  ('what-we-do', 'map-false-solutions', 'Map False Solutions', 'map-pin', 'Our core work is building a global, crowdsourced database of projects that undermine climate and circular economy goals. From incinerators to plastic-to-fuel plants, we track their location, funding, and environmental impact.', 1),
  ('what-we-do', 'investigate-corruption', 'Investigate Corruption & Greenwashing', 'search', 'We expose the financial and political mechanisms that prop up these harmful industries. We follow the money from international financial institutions to local projects, highlighting conflicts of interest and lack of transparency.', 2),
  ('what-we-do', 'empower-communities', 'Empower Communities with Data', 'document', 'Knowledge is power. By making complex data accessible and understandable, we provide communities with the evidence they need to challenge misleading corporate claims and hold decision-makers accountable.', 3),
  ('what-we-do', 'amplify-stories', 'Amplify Local Stories', 'play', 'We platform the voices of those on the frontlines of environmental injustice. Through case studies, articles, and videos, we share powerful stories of resistance, resilience, and the fight for a healthier planet.', 4),
  ('what-we-do', 'promote-solutions', 'Promote Real Solutions', 'lightning', 'Our work isn''t just about stopping the bad; it''s about championing the good. We highlight and promote proven, community-led Zero Waste systems that build local economies, create green jobs, and protect the environment.', 5),
  ('what-we-do', 'foster-collaboration', 'Foster Global Collaboration', 'globe', 'The challenges we face are global, and so are the solutions. We connect grassroots groups, researchers, legal experts, and advocates from around the world to share strategies, build solidarity, and create a unified movement.', 6)
ON CONFLICT (page_name, card_id) DO NOTHING;
