-- ========================================
-- SIMPLE FIX: Add INSERT/UPDATE/DELETE policies for projects table
-- ========================================
-- Run this in Supabase SQL Editor

-- Add policy to allow service role to insert projects
CREATE POLICY "Service role can insert projects"
  ON public.projects
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Add policy to allow service role to update projects  
CREATE POLICY "Service role can update projects"
  ON public.projects
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add policy to allow service role to delete projects
CREATE POLICY "Service role can delete projects"
  ON public.projects
  FOR DELETE
  TO service_role
  USING (true);

-- Add policy to allow authenticated admins to insert projects
CREATE POLICY "Admins can insert projects"
  ON public.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.users
      WHERE role IN ('municipal_manager', 'super_admin')
    )
  );

-- Add policy to allow authenticated staff/admins to update projects
CREATE POLICY "Staff can update projects"
  ON public.projects
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM public.users
      WHERE role IN ('municipal_staff', 'department_head', 'municipal_manager', 'super_admin')
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.users
      WHERE role IN ('municipal_staff', 'department_head', 'municipal_manager', 'super_admin')
    )
  );

-- Add policy to allow authenticated admins to delete projects
CREATE POLICY "Admins can delete projects"
  ON public.projects
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM public.users
      WHERE role IN ('municipal_manager', 'super_admin')
    )
  );

-- Verify policies were created
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'projects'
ORDER BY cmd, policyname;

-- SUCCESS MESSAGE
SELECT 'RLS policies for projects table have been created successfully!' AS status;
