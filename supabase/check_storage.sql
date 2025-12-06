-- First, check if buckets exist
SELECT id, name, public FROM storage.buckets;

-- Check RLS policies on storage.objects
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';
