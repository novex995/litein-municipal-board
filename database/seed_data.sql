-- ============================================================================
-- SEED DATA FOR TESTING
-- ============================================================================
-- This script adds sample data for testing the system
-- Safe to run on development/staging environments
-- DO NOT run on production database!
-- ============================================================================

-- Insert Sample News Articles
INSERT INTO public.news (title, slug, content, excerpt, category, published, published_at) VALUES
('Litein Market Renovation Complete', 'litein-market-renovation-complete', 
 'The Litein Municipal Board is pleased to announce the successful completion of the Litein Market renovation project...', 
 'Modern facilities now available for all vendors', 
 'Development', true, NOW()),

('New Water Supply Project Launched', 'new-water-supply-project-launched',
 'The Municipal Board has launched a new water supply project to serve over 10,000 residents...', 
 'Clean water for all residents by 2027', 
 'Infrastructure', true, NOW() - INTERVAL '2 days'),

('Public Participation Forum This Friday', 'public-participation-forum-friday',
 'Join us this Friday for our monthly public participation forum at the Municipal Hall...', 
 'Your voice matters in local governance', 
 'Announcements', true, NOW() - INTERVAL '1 day')
ON CONFLICT (slug) DO NOTHING;

-- Insert Sample Activity Logs
INSERT INTO public.activity_logs (
  user_email, user_name, user_role, 
  action_type, action_description, 
  resource_type, ip_address
) VALUES
('admin@liteinmunicipal.go.ke', 'Admin User', 'super_admin', 
 'user.login', 'User logged in successfully', 
 'auth', '192.168.1.100'),

('admin@liteinmunicipal.go.ke', 'Admin User', 'super_admin', 
 'news.create', 'Created news article: Market Renovation', 
 'news', '192.168.1.100'),

('admin@liteinmunicipal.go.ke', 'Admin User', 'super_admin', 
 'complaint.update', 'Updated complaint status to In Progress', 
 'complaints', '192.168.1.100')
ON CONFLICT DO NOTHING;

-- Insert System Settings (Default Configuration)
INSERT INTO public.system_settings (key, value, category, description, data_type, is_public) VALUES
-- General Settings
('site_name', 'Litein Municipal Board', 'general', 'Name of the municipal board', 'text', true),
('site_tagline', 'Building a Better Litein', 'general', 'Site tagline or slogan', 'text', true),
('site_email', 'info@liteinmunicipal.go.ke', 'general', 'Primary contact email', 'email', true),
('site_phone', '+254712345678', 'general', 'Primary contact phone', 'text', true),
('site_address', 'Litein Town, Kericho County', 'general', 'Physical address', 'text', true),
('maintenance_mode', 'false', 'general', 'Enable maintenance mode', 'boolean', false),

-- Email Settings
('smtp_host', 'smtp.gmail.com', 'email', 'SMTP server host', 'text', false),
('smtp_port', '587', 'email', 'SMTP server port', 'number', false),
('smtp_secure', 'true', 'email', 'Use TLS/SSL', 'boolean', false),
('smtp_from_name', 'Litein Municipal Board', 'email', 'Sender name', 'text', false),

-- Security Settings
('session_timeout', '3600', 'security', 'Session timeout in seconds', 'number', false),
('max_login_attempts', '5', 'security', 'Maximum failed login attempts', 'number', false),
('password_min_length', '8', 'security', 'Minimum password length', 'number', false),

-- File Upload Settings
('max_file_size', '10485760', 'files', 'Maximum file size in bytes (10MB)', 'number', false),
('allowed_file_types', 'pdf,doc,docx,jpg,jpeg,png', 'files', 'Allowed file extensions', 'text', false)

ON CONFLICT (key) DO NOTHING;

-- Success Message
DO $$
BEGIN
  RAISE NOTICE '✅ Sample data seeded successfully!';
  RAISE NOTICE '   - 3 news articles added';
  RAISE NOTICE '   - 3 activity log entries added';
  RAISE NOTICE '   - System settings configured';
END $$;
