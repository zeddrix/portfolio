-- 002_rls_policies.sql
-- Phase 2.3: Configure Row Level Security (RLS) policies
-- Implements security rules for public read access and admin write access

-- =============================================================================
-- SECTION 1: Enable RLS on all tables
-- =============================================================================

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- SECTION 2: Helper function to check if user is admin
-- =============================================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- SECTION 3: Site Settings Policies
-- =============================================================================

-- Public can read site settings
CREATE POLICY "site_settings_public_read"
  ON site_settings
  FOR SELECT
  USING (true);

-- Only admins can update site settings
CREATE POLICY "site_settings_admin_update"
  ON site_settings
  FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- =============================================================================
-- SECTION 4: Profile Policies
-- =============================================================================

-- Public can read profile
CREATE POLICY "profile_public_read"
  ON profile
  FOR SELECT
  USING (true);

-- Only admins can insert profile
CREATE POLICY "profile_admin_insert"
  ON profile
  FOR INSERT
  WITH CHECK (is_admin());

-- Only admins can update profile
CREATE POLICY "profile_admin_update"
  ON profile
  FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Only admins can delete profile
CREATE POLICY "profile_admin_delete"
  ON profile
  FOR DELETE
  USING (is_admin());

-- =============================================================================
-- SECTION 5: Skills Policies
-- =============================================================================

-- Public can read skills
CREATE POLICY "skills_public_read"
  ON skills
  FOR SELECT
  USING (true);

-- Only admins can insert skills
CREATE POLICY "skills_admin_insert"
  ON skills
  FOR INSERT
  WITH CHECK (is_admin());

-- Only admins can update skills
CREATE POLICY "skills_admin_update"
  ON skills
  FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Only admins can delete skills
CREATE POLICY "skills_admin_delete"
  ON skills
  FOR DELETE
  USING (is_admin());

-- =============================================================================
-- SECTION 6: Projects Policies
-- =============================================================================

-- Public can read published projects only
CREATE POLICY "projects_public_read"
  ON projects
  FOR SELECT
  USING (published = true);

-- Admins can read all projects (published and unpublished)
CREATE POLICY "projects_admin_read"
  ON projects
  FOR SELECT
  USING (is_admin());

-- Only admins can insert projects
CREATE POLICY "projects_admin_insert"
  ON projects
  FOR INSERT
  WITH CHECK (is_admin());

-- Only admins can update projects
CREATE POLICY "projects_admin_update"
  ON projects
  FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Only admins can delete projects
CREATE POLICY "projects_admin_delete"
  ON projects
  FOR DELETE
  USING (is_admin());

-- =============================================================================
-- SECTION 7: Certifications Policies
-- =============================================================================

-- Public can read certifications
CREATE POLICY "certifications_public_read"
  ON certifications
  FOR SELECT
  USING (true);

-- Only admins can insert certifications
CREATE POLICY "certifications_admin_insert"
  ON certifications
  FOR INSERT
  WITH CHECK (is_admin());

-- Only admins can update certifications
CREATE POLICY "certifications_admin_update"
  ON certifications
  FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Only admins can delete certifications
CREATE POLICY "certifications_admin_delete"
  ON certifications
  FOR DELETE
  USING (is_admin());

-- =============================================================================
-- SECTION 8: Experiences Policies
-- =============================================================================

-- Public can read experiences
CREATE POLICY "experiences_public_read"
  ON experiences
  FOR SELECT
  USING (true);

-- Only admins can insert experiences
CREATE POLICY "experiences_admin_insert"
  ON experiences
  FOR INSERT
  WITH CHECK (is_admin());

-- Only admins can update experiences
CREATE POLICY "experiences_admin_update"
  ON experiences
  FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Only admins can delete experiences
CREATE POLICY "experiences_admin_delete"
  ON experiences
  FOR DELETE
  USING (is_admin());

-- =============================================================================
-- SECTION 9: Social Links Policies
-- =============================================================================

-- Public can read visible social links only
CREATE POLICY "social_links_public_read"
  ON social_links
  FOR SELECT
  USING (is_visible = true);

-- Admins can read all social links
CREATE POLICY "social_links_admin_read"
  ON social_links
  FOR SELECT
  USING (is_admin());

-- Only admins can insert social links
CREATE POLICY "social_links_admin_insert"
  ON social_links
  FOR INSERT
  WITH CHECK (is_admin());

-- Only admins can update social links
CREATE POLICY "social_links_admin_update"
  ON social_links
  FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Only admins can delete social links
CREATE POLICY "social_links_admin_delete"
  ON social_links
  FOR DELETE
  USING (is_admin());

-- =============================================================================
-- SECTION 10: Admin Users Policies
-- =============================================================================

-- Only authenticated users can read their own admin record
CREATE POLICY "admin_users_self_read"
  ON admin_users
  FOR SELECT
  USING (auth.uid() = id);

-- Only existing admins can insert new admin users
CREATE POLICY "admin_users_admin_insert"
  ON admin_users
  FOR INSERT
  WITH CHECK (is_admin());

-- Only existing admins can update admin users
CREATE POLICY "admin_users_admin_update"
  ON admin_users
  FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Only existing admins can delete admin users
CREATE POLICY "admin_users_admin_delete"
  ON admin_users
  FOR DELETE
  USING (is_admin());

-- =============================================================================
-- SUCCESS MESSAGE
-- =============================================================================

DO $$
BEGIN
  RAISE NOTICE 'SUCCESS: RLS policies created successfully';
  RAISE NOTICE 'All tables now have proper row level security configured';
  RAISE NOTICE 'Public users: read access to published content';
  RAISE NOTICE 'Admin users: full CRUD access to all tables';
END $$;
