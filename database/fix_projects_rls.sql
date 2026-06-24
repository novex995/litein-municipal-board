-- Fix RLS policies for projects table
-- This will allow the backend (using service role) to INSERT, UPDATE, and DELETE projects

-- First, let's check what policies exist
-- SELECT * FROM pg_policies WHERE tablename = 'projects';

-- Drop existing restrictive policies if they exist
DROP POLICY IF EXISTS "Service role can do anything on projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can manage projects" ON public.projects;

-- Option 1: Allow service role to bypass RLS entirely (RECOMMENDED)
-- This works because the backend uses SUPABASE_SERVICE_KEY which has bypassRLS: true
-- No additional policies needed - service role automatically bypasses RLS

-- Option 2: Create explicit policies for authenticated users with admin roles (BACKUP)
-- If Option 1 doesn't work, uncomment these:

-- CREATE POLICY "Admins can insert projects"
--   ON public.projects FOR INSERT
--   TO authenticated
--   WITH CHECK (
--     EXISTS (
--       SELECT 1 FROM public.users
--       WHERE users.id = auth.uid()
--       AND users.role IN ('municipal_manager', 'super_admin')
--     )
--   );

-- CREATE POLICY "Admins can update projects"
--   ON public.projects FOR UPDATE
--   TO authenticated
--   USING (
--     EXISTS (
--       SELECT 1 FROM public.users
--       WHERE users.id = auth.uid()
--       AND users.role IN ('municipal_staff', 'department_head', 'municipal_manager', 'super_admin')
--     )
--   );

-- CREATE POLICY "Admins can delete projects"
--   ON public.projects FOR DELETE
--   TO authenticated
--   USING (
--     EXISTS (
--       SELECT 1 FROM public.users
--       WHERE users.id = auth.uid()
--       AND users.role IN ('municipal_manager', 'super_admin')
--     )
--   );

-- Verify RLS is enabled (it should be)
-- ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Check that service role key is being used correctly in backend
-- The service role key should automatically bypass RLS policies
-- Make sure backend/.env has: SUPABASE_SERVICE_KEY=your-service-role-key

-- View current policies after changes
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual, 
  with_check 
FROM pg_policies 
WHERE tablename = 'projects';

-- Test: Try to insert a project using service role key
-- This should work without any policies if service role is configured correctly
-- INSERT INTO public.projects (name, description, status) 
-- VALUES ('Test Project', 'Testing RLS', 'planned');
