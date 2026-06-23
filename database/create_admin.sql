-- ============================================================================
-- CREATE ADMIN USER
-- ============================================================================
-- This script creates an admin user for the Litein Municipal Board system
-- 
-- IMPORTANT: Update the email and password below before running!
-- ============================================================================

-- Step 1: Update these values with your admin credentials
DO $$
DECLARE
  admin_email TEXT := 'admin@liteinmunicipal.go.ke';  -- ⚠️ CHANGE THIS
  admin_password TEXT := 'Admin@2026';                 -- ⚠️ CHANGE THIS
  admin_full_name TEXT := 'System Administrator';
  admin_phone TEXT := '+254712345678';
  new_user_id UUID;
BEGIN
  -- Create user in auth.users (Supabase Auth)
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role
  ) VALUES (
    gen_random_uuid(),
    admin_email,
    crypt(admin_password, gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    jsonb_build_object('full_name', admin_full_name),
    false,
    'authenticated'
  )
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO new_user_id;

  -- If user was created, add to public.users
  IF new_user_id IS NOT NULL THEN
    INSERT INTO public.users (
      id,
      email,
      full_name,
      phone,
      role,
      status
    ) VALUES (
      new_user_id,
      admin_email,
      admin_full_name,
      admin_phone,
      'super_admin',
      'active'
    );
    
    RAISE NOTICE '✅ Admin user created successfully!';
    RAISE NOTICE '   Email: %', admin_email;
    RAISE NOTICE '   Role: super_admin';
    RAISE NOTICE '   You can now log in with these credentials';
  ELSE
    RAISE NOTICE '⚠️  User with this email already exists';
  END IF;
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '❌ Error creating admin user: %', SQLERRM;
END $$;
