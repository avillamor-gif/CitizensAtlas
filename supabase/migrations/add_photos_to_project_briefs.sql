-- Add photos column to project_briefs table
ALTER TABLE project_briefs
ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_project_briefs_photos ON project_briefs(photos);
