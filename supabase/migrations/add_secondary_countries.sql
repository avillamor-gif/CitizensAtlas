-- Add secondary_countries column to projects table
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS "secondaryCountries" TEXT;

-- Add comment for documentation
COMMENT ON COLUMN projects."secondaryCountries" IS 'Comma-separated list of secondary countries for the project';
