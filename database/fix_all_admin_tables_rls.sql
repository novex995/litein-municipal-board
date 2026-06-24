-- ========================================
-- FIX ALL ADMIN TABLES RLS POLICIES
-- ========================================
-- This fixes RLS for: projects, project_images, news, project_updates
-- Run this in Supabase SQL Editor

-- ========================================
-- PROJECTS TABLE
-- ========================================

DROP POLICY IF EXISTS "Service role can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Service role can update projects" ON public.projects;
DROP POLICY IF EXISTS "Service role can delete projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Staff can update projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can delete projects" ON public.projects;

CREATE POLICY "Service role can insert projects"
  ON public.projects FOR INSERT TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update projects"
  ON public.projects FOR UPDATE TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role can delete projects"
  ON public.projects FOR DELETE TO service_role
  USING (true);

-- ========================================
-- PROJECT_IMAGES TABLE
-- ========================================

DROP POLICY IF EXISTS "Anyone can view project images" ON public.project_images;
DROP POLICY IF EXISTS "Service role can insert project images" ON public.project_images;
DROP POLICY IF EXISTS "Service role can update project images" ON public.project_images;
DROP POLICY IF EXISTS "Service role can delete project images" ON public.project_images;

CREATE POLICY "Anyone can view project images"
  ON public.project_images FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert project images"
  ON public.project_images FOR INSERT TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update project images"
  ON public.project_images FOR UPDATE TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role can delete project images"
  ON public.project_images FOR DELETE TO service_role
  USING (true);

-- ========================================
-- NEWS TABLE
-- ========================================

DROP POLICY IF EXISTS "Service role can insert news" ON public.news;
DROP POLICY IF EXISTS "Service role can update news" ON public.news;
DROP POLICY IF EXISTS "Service role can delete news" ON public.news;

CREATE POLICY "Service role can insert news"
  ON public.news FOR INSERT TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update news"
  ON public.news FOR UPDATE TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role can delete news"
  ON public.news FOR DELETE TO service_role
  USING (true);

-- ========================================
-- PROJECT_UPDATES TABLE
-- ========================================

DROP POLICY IF EXISTS "Anyone can view project updates" ON public.project_updates;
DROP POLICY IF EXISTS "Service role can insert project updates" ON public.project_updates;
DROP POLICY IF EXISTS "Service role can update project updates" ON public.project_updates;
DROP POLICY IF EXISTS "Service role can delete project updates" ON public.project_updates;

CREATE POLICY "Anyone can view project updates"
  ON public.project_updates FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert project updates"
  ON public.project_updates FOR INSERT TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update project updates"
  ON public.project_updates FOR UPDATE TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role can delete project updates"
  ON public.project_updates FOR DELETE TO service_role
  USING (true);

-- ========================================
-- VERIFY POLICIES
-- ========================================

-- Check all policies
SELECT 
  tablename, 
  policyname, 
  cmd AS operation,
  roles
FROM pg_policies
WHERE tablename IN ('projects', 'project_images', 'news', 'project_updates')
ORDER BY tablename, cmd, policyname;

-- SUCCESS MESSAGE
SELECT '✅ RLS policies have been fixed for all admin tables!' AS status;
SELECT 'Projects, News, Project Images, and Project Updates can now be managed via backend API' AS info;
