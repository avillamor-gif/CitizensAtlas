-- Add publication_solution_type column to publications table
-- This column stores whether a publication is about "Solutions" or "False Solutions"

ALTER TABLE publications 
ADD COLUMN IF NOT EXISTS publication_solution_type VARCHAR(50) DEFAULT 'False Solutions';

-- Create index for faster filtering if needed
CREATE INDEX IF NOT EXISTS idx_publications_solution_type ON publications(publication_solution_type);
