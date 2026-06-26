-- Enable RLS for publication_categories table
ALTER TABLE IF EXISTS publication_categories ENABLE ROW LEVEL SECURITY;

-- Public read policy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'publication_categories'
      AND policyname = 'Public can view publication categories'
  ) THEN
    CREATE POLICY "Public can view publication categories" ON publication_categories
      FOR SELECT USING (true);
  END IF;
END $$;

-- Authenticated management policy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'publication_categories'
      AND policyname = 'Authenticated users can manage publication categories'
  ) THEN
    CREATE POLICY "Authenticated users can manage publication categories" ON publication_categories
      FOR ALL USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- Keep updatedAt in sync using existing trigger function
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'update_publication_categories_updated_at'
  ) THEN
    CREATE TRIGGER update_publication_categories_updated_at
      BEFORE UPDATE ON publication_categories
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
