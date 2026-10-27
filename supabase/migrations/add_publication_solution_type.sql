-- Add publication_solution_type column to publications table
ALTER TABLE publications
ADD COLUMN "publicationSolutionType" TEXT DEFAULT 'False Solutions' CHECK ("publicationSolutionType" IN ('False Solutions', 'Solutions'));

-- Add comment for documentation
COMMENT ON COLUMN publications."publicationSolutionType" IS 'Indicates whether this publication is about "False Solutions" or actual "Solutions"';
