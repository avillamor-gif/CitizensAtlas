-- Check all table schemas to see what columns exist
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('projects', 'news', 'publications', 'videos')
ORDER BY table_name, ordinal_position;
