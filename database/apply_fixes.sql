-- ============================================================================
-- APPLY FIXES TO EXISTING DATABASE
-- ============================================================================
-- Run this if you already have tables but need to apply recent fixes
-- Safe to run multiple times (uses IF NOT EXISTS and DROP IF EXISTS)
-- ============================================================================

-- Add missing columns if they don't exist
DO $$ 
BEGIN
  -- Add status column to users if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='status') THEN
    ALTER TABLE public.users ADD COLUMN status TEXT DEFAULT 'active';
    RAISE NOTICE '✅ Added status column to users table';
  END IF;
END $$;

-- Create activity_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  user_email TEXT NOT NULL,
  user_name TEXT,
  user_role TEXT,
  action_type TEXT NOT NULL,
  action_description TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create system_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  category TEXT NOT NULL,
  description TEXT,
  data_type TEXT DEFAULT 'text',
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create newsletter_subscribers table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  status TEXT DEFAULT 'active',
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  verification_token TEXT,
  verified BOOLEAN DEFAULT FALSE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON public.activity_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON public.activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON public.system_settings(key);
CREATE INDEX IF NOT EXISTS idx_system_settings_category ON public.system_settings(category);

-- Enable RLS on new tables
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- FIX RLS POLICIES FOR COMPLAINTS (Admin Access)
-- ============================================================================

-- Drop old restrictive policies
DROP POLICY IF EXISTS "Users can view own complaints" ON public.complaints;
DROP POLICY IF EXISTS "Users can create complaints" ON public.complaints;

-- Create comprehensive policies
DROP POLICY IF EXISTS "Admin and staff can view all complaints" ON public.complaints;
CREATE POLICY "Admin and staff can view all complaints"
  ON public.complaints FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('municipal_staff', 'department_head', 'municipal_manager', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Citizens can view own complaints" ON public.complaints;
CREATE POLICY "Citizens can view own complaints"
  ON public.complaints FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can create complaints" ON public.complaints;
CREATE POLICY "Anyone can create complaints"
  ON public.complaints FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin and staff can update complaints" ON public.complaints;
CREATE POLICY "Admin and staff can update complaints"
  ON public.complaints FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('municipal_staff', 'department_head', 'municipal_manager', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Super admin can delete complaints" ON public.complaints;
CREATE POLICY "Super admin can delete complaints"
  ON public.complaints FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'super_admin'
    )
  );

-- Fix complaint_images policies
DROP POLICY IF EXISTS "Admin and staff can view all complaint images" ON public.complaint_images;
CREATE POLICY "Admin and staff can view all complaint images"
  ON public.complaint_images FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('municipal_staff', 'department_head', 'municipal_manager', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Users can view own complaint images" ON public.complaint_images;
CREATE POLICY "Users can view own complaint images"
  ON public.complaint_images FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.complaints
      WHERE complaints.id = complaint_images.complaint_id
      AND complaints.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Anyone can insert complaint images" ON public.complaint_images;
CREATE POLICY "Anyone can insert complaint images"
  ON public.complaint_images FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Fix complaint_comments policies
DROP POLICY IF EXISTS "Admin and staff can view all comments" ON public.complaint_comments;
CREATE POLICY "Admin and staff can view all comments"
  ON public.complaint_comments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('municipal_staff', 'department_head', 'municipal_manager', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Users can view own complaint comments" ON public.complaint_comments;
CREATE POLICY "Users can view own complaint comments"
  ON public.complaint_comments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.complaints
      WHERE complaints.id = complaint_comments.complaint_id
      AND complaints.user_id = auth.uid()
      AND complaint_comments.is_internal = false
    )
  );

DROP POLICY IF EXISTS "Admin and staff can insert comments" ON public.complaint_comments;
CREATE POLICY "Admin and staff can insert comments"
  ON public.complaint_comments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('municipal_staff', 'department_head', 'municipal_manager', 'super_admin')
    )
  );

-- ============================================================================
-- RLS POLICIES FOR NEW TABLES
-- ============================================================================

-- Activity Logs: Staff can view all
DROP POLICY IF EXISTS "Staff can view all activity logs" ON public.activity_logs;
CREATE POLICY "Staff can view all activity logs"
  ON public.activity_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('municipal_staff', 'department_head', 'municipal_manager', 'super_admin')
    )
  );

-- System Settings policies
DROP POLICY IF EXISTS "Anyone can view public settings" ON public.system_settings;
CREATE POLICY "Anyone can view public settings"
  ON public.system_settings FOR SELECT
  USING (is_public = TRUE);

DROP POLICY IF EXISTS "Staff can manage all settings" ON public.system_settings;
CREATE POLICY "Staff can manage all settings"
  ON public.system_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('municipal_staff', 'department_head', 'municipal_manager', 'super_admin')
    )
  );

-- ============================================================================
-- ADD TRIGGERS
-- ============================================================================

-- Ensure update_updated_at function exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to system_settings if it doesn't exist
DROP TRIGGER IF EXISTS update_system_settings_updated_at ON public.system_settings;
CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VERIFICATION
-- ============================================================================

DO $$
DECLARE
  complaint_count INTEGER;
  news_count INTEGER;
  user_count INTEGER;
BEGIN
  -- Count records
  SELECT COUNT(*) INTO complaint_count FROM public.complaints;
  SELECT COUNT(*) INTO news_count FROM public.news;
  SELECT COUNT(*) INTO user_count FROM public.users;
  
  -- Report status
  RAISE NOTICE '✅ Fixes applied successfully!';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Database Status:';
  RAISE NOTICE '   - Users: %', user_count;
  RAISE NOTICE '   - Complaints: %', complaint_count;
  RAISE NOTICE '   - News Articles: %', news_count;
  RAISE NOTICE '';
  RAISE NOTICE '✓ RLS policies updated for admin access';
  RAISE NOTICE '✓ Activity Log system enabled';
  RAISE NOTICE '✓ System Settings system enabled';
  RAISE NOTICE '✓ All indexes created';
END $$;
