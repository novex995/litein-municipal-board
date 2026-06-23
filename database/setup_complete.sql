-- ============================================================================
-- LITEIN MUNICIPAL BOARD - COMPLETE DATABASE SETUP
-- ============================================================================
-- This script sets up the complete database with all tables, RLS policies,
-- and additional features (Activity Log, System Settings, Newsletter)
-- 
-- Run this script once in Supabase SQL Editor to set up everything
-- ============================================================================

-- Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE user_role AS ENUM (
  'citizen',
  'municipal_staff',
  'department_head',
  'municipal_manager',
  'super_admin'
);

CREATE TYPE complaint_status AS ENUM (
  'submitted',
  'under_review',
  'assigned',
  'in_progress',
  'resolved',
  'closed',
  'rejected'
);

CREATE TYPE project_status AS ENUM (
  'planned',
  'tendering',
  'ongoing',
  'completed',
  'suspended',
  'cancelled'
);

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Users Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role DEFAULT 'citizen',
  avatar_url TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Departments Table
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  head_id UUID REFERENCES public.users(id),
  contact_email TEXT,
  contact_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Complaints Table
CREATE TABLE IF NOT EXISTS public.complaints (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reference_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.users(id),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status complaint_status DEFAULT 'submitted',
  priority TEXT DEFAULT 'medium',
  assigned_to UUID REFERENCES public.users(id),
  assigned_department UUID REFERENCES public.departments(id),
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  resolution_notes TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Complaint Images Table
CREATE TABLE IF NOT EXISTS public.complaint_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Complaint Comments Table
CREATE TABLE IF NOT EXISTS public.complaint_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id),
  comment TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  budget DECIMAL(15, 2),
  contractor TEXT,
  funding_source TEXT,
  status project_status DEFAULT 'planned',
  completion_percentage INTEGER DEFAULT 0,
  start_date DATE,
  end_date DATE,
  department_id UUID REFERENCES public.departments(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Images Table
CREATE TABLE IF NOT EXISTS public.project_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Updates Table
CREATE TABLE IF NOT EXISTS public.project_updates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  completion_percentage INTEGER,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- News Table
CREATE TABLE IF NOT EXISTS public.news (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  category TEXT NOT NULL,
  author_id UUID REFERENCES public.users(id),
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events Table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  image_url TEXT,
  category TEXT,
  organizer TEXT,
  contact_info TEXT,
  registration_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents Table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  downloads INTEGER DEFAULT 0,
  uploaded_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT,
  read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ADDITIONAL FEATURE TABLES
-- ============================================================================

-- Activity Log Table
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

-- System Settings Table
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

-- Newsletter Subscribers Table
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

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_complaints_user_id ON public.complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON public.complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_reference ON public.complaints(reference_number);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_news_published ON public.news(published);
CREATE INDEX IF NOT EXISTS idx_news_category ON public.news(category);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON public.activity_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON public.activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON public.system_settings(key);
CREATE INDEX IF NOT EXISTS idx_system_settings_category ON public.system_settings(category);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES - USERS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Staff can view all users" ON public.users;

CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Staff can view all users"
  ON public.users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('municipal_staff', 'department_head', 'municipal_manager', 'super_admin')
    )
  );

-- ============================================================================
-- RLS POLICIES - COMPLAINTS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Admin and staff can view all complaints" ON public.complaints;
DROP POLICY IF EXISTS "Users can view own complaints" ON public.complaints;
DROP POLICY IF EXISTS "Anyone can create complaints" ON public.complaints;
DROP POLICY IF EXISTS "Admin and staff can update complaints" ON public.complaints;
DROP POLICY IF EXISTS "Super admin can delete complaints" ON public.complaints;

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

CREATE POLICY "Users can view own complaints"
  ON public.complaints FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create complaints"
  ON public.complaints FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

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

-- ============================================================================
-- RLS POLICIES - COMPLAINT IMAGES
-- ============================================================================

DROP POLICY IF EXISTS "Admin and staff can view all complaint images" ON public.complaint_images;
DROP POLICY IF EXISTS "Users can view own complaint images" ON public.complaint_images;
DROP POLICY IF EXISTS "Anyone can insert complaint images" ON public.complaint_images;

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

CREATE POLICY "Anyone can insert complaint images"
  ON public.complaint_images FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- ============================================================================
-- RLS POLICIES - COMPLAINT COMMENTS
-- ============================================================================

DROP POLICY IF EXISTS "Admin and staff can view all comments" ON public.complaint_comments;
DROP POLICY IF EXISTS "Users can view own complaint comments" ON public.complaint_comments;
DROP POLICY IF EXISTS "Admin and staff can insert comments" ON public.complaint_comments;

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
-- RLS POLICIES - OTHER TABLES
-- ============================================================================

-- News: Anyone can view published
DROP POLICY IF EXISTS "Anyone can view published news" ON public.news;
CREATE POLICY "Anyone can view published news"
  ON public.news FOR SELECT
  USING (published = TRUE);

-- Projects: Anyone can view
DROP POLICY IF EXISTS "Anyone can view projects" ON public.projects;
CREATE POLICY "Anyone can view projects"
  ON public.projects FOR SELECT
  USING (TRUE);

-- Notifications: Users see their own
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

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

-- System Settings: Staff can manage, public can view public settings
DROP POLICY IF EXISTS "Anyone can view public settings" ON public.system_settings;
DROP POLICY IF EXISTS "Staff can manage all settings" ON public.system_settings;

CREATE POLICY "Anyone can view public settings"
  ON public.system_settings FOR SELECT
  USING (is_public = TRUE);

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
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_complaints_updated_at ON public.complaints;
CREATE TRIGGER update_complaints_updated_at
  BEFORE UPDATE ON public.complaints
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_news_updated_at ON public.news;
CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_system_settings_updated_at ON public.system_settings;
CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SETUP COMPLETE
-- ============================================================================

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Database setup complete!';
  RAISE NOTICE '📋 Next steps:';
  RAISE NOTICE '   1. Run create_admin.sql to create your admin user';
  RAISE NOTICE '   2. Optionally run seed_data.sql for test data';
  RAISE NOTICE '   3. Start your backend and frontend servers';
END $$;
