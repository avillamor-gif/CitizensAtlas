-- Temporarily disable RLS on profiles table to test admin role loading
-- This will allow the app to read profiles without authentication restrictions

-- First, check current RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';

-- Disable RLS temporarily
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';

-- Test query - this should now work without authentication
SELECT id, email, role, full_name FROM profiles WHERE email IN ('akawar@gmail.com', 'alberto.b.villamor@gmail.com');