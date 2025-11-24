-- 001_initial_schema.sql
-- Phase 2.1 & 2.2: Create all database tables for Zeddrix Portfolio
-- This migration creates the complete schema as defined in IMPLEMENTATION_PLAN.md

-- =============================================================================
-- SECTION 1: Drop existing tables (if any) - for clean migrations during development
-- =============================================================================
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS social_links CASCADE;
DROP TABLE IF EXISTS experiences CASCADE;
DROP TABLE IF EXISTS certifications CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS profile CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS layout_type CASCADE;
DROP TYPE IF EXISTS palette_type CASCADE;
DROP TYPE IF EXISTS theme_mode_type CASCADE;
DROP TYPE IF EXISTS skill_category_type CASCADE;
DROP TYPE IF EXISTS admin_role_type CASCADE;

-- =============================================================================
-- SECTION 2: Create custom types (enums)
-- =============================================================================

-- Layout options
CREATE TYPE layout_type AS ENUM ('case_study', 'single_page', 'bento_grid');

-- Color palette options
CREATE TYPE palette_type AS ENUM (
  'cyber_blue',
  'neon_nights',
  'sunset_ember',
  'forest_zen',
  'monochrome_pro',
  'purple_haze',
  'ocean_deep'
);

-- Theme mode
CREATE TYPE theme_mode_type AS ENUM ('dark', 'light');

-- Skill categories
CREATE TYPE skill_category_type AS ENUM (
  'programming',
  'frontend',
  'backend',
  'devops',
  'tools'
);

-- Admin roles
CREATE TYPE admin_role_type AS ENUM ('admin', 'editor');

-- =============================================================================
-- SECTION 3: Create tables
-- =============================================================================

-- Site Settings Table
-- Stores global site configuration including default layout, palette, and theme
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  active_layout layout_type NOT NULL DEFAULT 'case_study',
  active_palette palette_type NOT NULL DEFAULT 'cyber_blue',
  theme_mode theme_mode_type NOT NULL DEFAULT 'dark',
  maintenance_mode BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Profile Table
-- Stores personal information and bio
CREATE TABLE profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  bio TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  website_url TEXT,
  profile_image_url TEXT,
  profile_image_cloudinary_id TEXT,
  location TEXT,
  available_for_work BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Skills Table
-- Stores technical skills with categories and proficiency levels
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category skill_category_type NOT NULL,
  name TEXT NOT NULL,
  icon_url TEXT,
  badge_url TEXT,
  proficiency_level INTEGER NOT NULL CHECK (proficiency_level >= 1 AND proficiency_level <= 5),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Projects Table
-- Stores portfolio projects with rich media support
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  challenge TEXT,
  solution TEXT,
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  project_url TEXT,
  github_url TEXT,
  featured_image_url TEXT NOT NULL,
  featured_image_cloudinary_id TEXT NOT NULL,
  gallery_images JSONB NOT NULL DEFAULT '[]', -- Array of {url, cloudinary_id, media_type}
  demo_video_url TEXT,
  demo_video_cloudinary_id TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  metrics JSONB, -- For case study statistics
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Certifications Table
-- Stores professional certifications and credentials
CREATE TABLE certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  credential_url TEXT,
  credential_id TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Experiences Table
-- Stores work experience and employment history
CREATE TABLE experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  description TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN NOT NULL DEFAULT false,
  location TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Social Links Table
-- Stores social media and external profile links
CREATE TABLE social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Admin Users Table
-- Stores admin user roles and permissions
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role admin_role_type NOT NULL DEFAULT 'editor',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- SECTION 4: Create indexes for performance
-- =============================================================================

-- Projects indexes
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_published ON projects(published);
CREATE INDEX idx_projects_featured ON projects(is_featured);
CREATE INDEX idx_projects_display_order ON projects(display_order);

-- Skills indexes
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_featured ON skills(is_featured);
CREATE INDEX idx_skills_display_order ON skills(display_order);

-- Social links indexes
CREATE INDEX idx_social_links_visible ON social_links(is_visible);
CREATE INDEX idx_social_links_display_order ON social_links(display_order);

-- Experiences indexes
CREATE INDEX idx_experiences_current ON experiences(is_current);
CREATE INDEX idx_experiences_display_order ON experiences(display_order);

-- Certifications indexes
CREATE INDEX idx_certifications_display_order ON certifications(display_order);

-- =============================================================================
-- SECTION 5: Create updated_at triggers
-- =============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profile_updated_at
  BEFORE UPDATE ON profile
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- SECTION 6: Add helpful comments to tables
-- =============================================================================

COMMENT ON TABLE site_settings IS 'Global site configuration including default layout, color palette, and theme';
COMMENT ON TABLE profile IS 'Personal profile information and bio';
COMMENT ON TABLE skills IS 'Technical skills with categories and proficiency levels';
COMMENT ON TABLE projects IS 'Portfolio projects with rich media support (images, videos, GIFs)';
COMMENT ON TABLE certifications IS 'Professional certifications and credentials';
COMMENT ON TABLE experiences IS 'Work experience and employment history';
COMMENT ON TABLE social_links IS 'Social media and external profile links';
COMMENT ON TABLE admin_users IS 'Admin users with role-based access control';

-- =============================================================================
-- SUCCESS MESSAGE
-- =============================================================================

DO $$
BEGIN
  RAISE NOTICE 'SUCCESS: Initial schema created successfully';
  RAISE NOTICE 'Tables created: site_settings, profile, skills, projects, certifications, experiences, social_links, admin_users';
END $$;
