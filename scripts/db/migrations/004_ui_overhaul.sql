-- 004_ui_overhaul.sql
-- Phase 1: Database Schema Updates for UI/UX Overhaul
-- This migration adds new tables and columns as defined in UI_OVERHAUL_PLAN.md

-- =============================================================================
-- SECTION 1: Create new enum types
-- =============================================================================

-- Hero animation types
CREATE TYPE hero_animation_type AS ENUM ('fade_up', 'typewriter', 'slide_in');

-- Button text mode
CREATE TYPE button_text_mode_type AS ENUM ('predefined', 'custom', 'category');

-- Stats display mode
CREATE TYPE stats_display_mode_type AS ENUM ('counters', 'icons', 'categories', 'hybrid');

-- =============================================================================
-- SECTION 2: Modify site_settings table
-- =============================================================================

-- Add new columns to site_settings
ALTER TABLE site_settings
ADD COLUMN hero_animation_type hero_animation_type NOT NULL DEFAULT 'fade_up',
ADD COLUMN hero_intro_duration INTEGER NOT NULL DEFAULT 5000,
ADD COLUMN hero_video_duration INTEGER NOT NULL DEFAULT 5000,
ADD COLUMN profile_picture_locations TEXT[] NOT NULL DEFAULT '{nav,about,footer,contact}',
ADD COLUMN stats_display_mode stats_display_mode_type NOT NULL DEFAULT 'hybrid',
ADD COLUMN stats_counters_enabled BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN stats_icons_enabled BOOLEAN NOT NULL DEFAULT true;

-- Add constraints for duration values
ALTER TABLE site_settings
ADD CONSTRAINT hero_intro_duration_range CHECK (hero_intro_duration >= 3000 AND hero_intro_duration <= 10000),
ADD CONSTRAINT hero_video_duration_range CHECK (hero_video_duration >= 3000 AND hero_video_duration <= 10000);

-- Drop the active_layout column (layout system being removed)
ALTER TABLE site_settings DROP COLUMN IF EXISTS active_layout;

-- Drop the layout_type enum if it exists
DROP TYPE IF EXISTS layout_type CASCADE;

-- =============================================================================
-- SECTION 3: Modify projects table
-- =============================================================================

-- Add new columns to projects
ALTER TABLE projects
ADD COLUMN video_preview_start INTEGER NOT NULL DEFAULT 0,
ADD COLUMN video_preview_end INTEGER NOT NULL DEFAULT 5,
ADD COLUMN button_text TEXT,
ADD COLUMN button_text_mode button_text_mode_type NOT NULL DEFAULT 'predefined',
ADD COLUMN project_category_id UUID,
ADD COLUMN show_in_hero_carousel BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN hero_display_order INTEGER NOT NULL DEFAULT 0;

-- Add constraint for video preview range (must be 5 seconds)
ALTER TABLE projects
ADD CONSTRAINT video_preview_range CHECK (video_preview_end - video_preview_start = 5);

-- Add index for hero carousel queries
CREATE INDEX idx_projects_hero_carousel ON projects(show_in_hero_carousel, hero_display_order) WHERE show_in_hero_carousel = true;

-- =============================================================================
-- SECTION 4: Create color_palettes table
-- =============================================================================

CREATE TABLE color_palettes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  is_system BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create updated_at trigger
CREATE TRIGGER update_color_palettes_updated_at
  BEFORE UPDATE ON color_palettes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add indexes
CREATE INDEX idx_color_palettes_active ON color_palettes(is_active);
CREATE INDEX idx_color_palettes_system ON color_palettes(is_system);

COMMENT ON TABLE color_palettes IS 'Color palettes for theme customization';

-- =============================================================================
-- SECTION 5: Create color_combinations table
-- =============================================================================

CREATE TABLE color_combinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  palette_id UUID NOT NULL REFERENCES color_palettes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  primary_color TEXT NOT NULL,
  secondary_color TEXT NOT NULL,
  accent_color TEXT NOT NULL,
  background_dark TEXT NOT NULL,
  background_light TEXT NOT NULL,
  surface_dark TEXT NOT NULL,
  surface_light TEXT NOT NULL,
  text_primary_dark TEXT NOT NULL,
  text_primary_light TEXT NOT NULL,
  text_secondary_dark TEXT NOT NULL,
  text_secondary_light TEXT NOT NULL,
  border_dark TEXT NOT NULL,
  border_light TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(palette_id, name)
);

-- Create updated_at trigger
CREATE TRIGGER update_color_combinations_updated_at
  BEFORE UPDATE ON color_combinations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add indexes
CREATE INDEX idx_color_combinations_palette ON color_combinations(palette_id);
CREATE INDEX idx_color_combinations_default ON color_combinations(palette_id, is_default);
CREATE INDEX idx_color_combinations_display_order ON color_combinations(display_order);

COMMENT ON TABLE color_combinations IS 'Color combinations within palettes for two-color schemes';

-- =============================================================================
-- SECTION 6: Create project_categories table
-- =============================================================================

CREATE TABLE project_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  default_button_text TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add index
CREATE INDEX idx_project_categories_display_order ON project_categories(display_order);

COMMENT ON TABLE project_categories IS 'Project categories with default button text';

-- Add foreign key to projects table
ALTER TABLE projects
ADD CONSTRAINT fk_projects_category FOREIGN KEY (project_category_id) REFERENCES project_categories(id) ON DELETE SET NULL;

-- =============================================================================
-- SECTION 7: Create button_text_presets table
-- =============================================================================

CREATE TABLE button_text_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  category_id UUID REFERENCES project_categories(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add indexes
CREATE INDEX idx_button_text_presets_active ON button_text_presets(is_active);
CREATE INDEX idx_button_text_presets_display_order ON button_text_presets(display_order);
CREATE INDEX idx_button_text_presets_category ON button_text_presets(category_id);

COMMENT ON TABLE button_text_presets IS 'Predefined button text options for projects';

-- =============================================================================
-- SECTION 8: Create stats_counters table
-- =============================================================================

CREATE TABLE stats_counters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  suffix TEXT,
  icon TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create updated_at trigger
CREATE TRIGGER update_stats_counters_updated_at
  BEFORE UPDATE ON stats_counters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add indexes
CREATE INDEX idx_stats_counters_visible ON stats_counters(is_visible);
CREATE INDEX idx_stats_counters_display_order ON stats_counters(display_order);

COMMENT ON TABLE stats_counters IS 'Stats section counters with animated values';

-- =============================================================================
-- SECTION 9: Create development_process_steps table
-- =============================================================================

CREATE TABLE development_process_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create updated_at trigger
CREATE TRIGGER update_development_process_steps_updated_at
  BEFORE UPDATE ON development_process_steps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add indexes
CREATE INDEX idx_development_process_steps_visible ON development_process_steps(is_visible);
CREATE INDEX idx_development_process_steps_display_order ON development_process_steps(display_order);

COMMENT ON TABLE development_process_steps IS 'Development process steps: Discovery, Design, Develop, Deploy';

-- =============================================================================
-- SECTION 10: Create project_deliverables table
-- =============================================================================

CREATE TABLE project_deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create updated_at trigger
CREATE TRIGGER update_project_deliverables_updated_at
  BEFORE UPDATE ON project_deliverables
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add indexes
CREATE INDEX idx_project_deliverables_visible ON project_deliverables(is_visible);
CREATE INDEX idx_project_deliverables_display_order ON project_deliverables(display_order);

COMMENT ON TABLE project_deliverables IS 'Project deliverables cards section';

-- =============================================================================
-- SECTION 11: Create ai_tools table
-- =============================================================================

CREATE TABLE ai_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  website_url TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create updated_at trigger
CREATE TRIGGER update_ai_tools_updated_at
  BEFORE UPDATE ON ai_tools
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add indexes
CREATE INDEX idx_ai_tools_visible ON ai_tools(is_visible);
CREATE INDEX idx_ai_tools_display_order ON ai_tools(display_order);

COMMENT ON TABLE ai_tools IS 'AI tools showcase grid';

-- =============================================================================
-- SECTION 12: Create ai_productivity_stats table
-- =============================================================================

CREATE TABLE ai_productivity_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create updated_at trigger
CREATE TRIGGER update_ai_productivity_stats_updated_at
  BEFORE UPDATE ON ai_productivity_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add indexes
CREATE INDEX idx_ai_productivity_stats_visible ON ai_productivity_stats(is_visible);
CREATE INDEX idx_ai_productivity_stats_display_order ON ai_productivity_stats(display_order);

COMMENT ON TABLE ai_productivity_stats IS 'AI productivity statistics display';

-- =============================================================================
-- SECTION 13: Enable RLS on all new tables
-- =============================================================================

ALTER TABLE color_palettes ENABLE ROW LEVEL SECURITY;
ALTER TABLE color_combinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE button_text_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats_counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE development_process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_productivity_stats ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- SECTION 14: RLS Policies - Public Read Access
-- =============================================================================

-- Color Palettes - public read for active palettes
CREATE POLICY "Public can view active color palettes"
  ON color_palettes FOR SELECT
  USING (is_active = true);

-- Color Combinations - public read
CREATE POLICY "Public can view color combinations"
  ON color_combinations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM color_palettes
      WHERE color_palettes.id = color_combinations.palette_id
      AND color_palettes.is_active = true
    )
  );

-- Project Categories - public read
CREATE POLICY "Public can view project categories"
  ON project_categories FOR SELECT
  USING (true);

-- Button Text Presets - public read for active presets
CREATE POLICY "Public can view active button text presets"
  ON button_text_presets FOR SELECT
  USING (is_active = true);

-- Stats Counters - public read for visible counters
CREATE POLICY "Public can view visible stats counters"
  ON stats_counters FOR SELECT
  USING (is_visible = true);

-- Development Process Steps - public read for visible steps
CREATE POLICY "Public can view visible development process steps"
  ON development_process_steps FOR SELECT
  USING (is_visible = true);

-- Project Deliverables - public read for visible deliverables
CREATE POLICY "Public can view visible project deliverables"
  ON project_deliverables FOR SELECT
  USING (is_visible = true);

-- AI Tools - public read for visible tools
CREATE POLICY "Public can view visible AI tools"
  ON ai_tools FOR SELECT
  USING (is_visible = true);

-- AI Productivity Stats - public read for visible stats
CREATE POLICY "Public can view visible AI productivity stats"
  ON ai_productivity_stats FOR SELECT
  USING (is_visible = true);

-- =============================================================================
-- SECTION 15: RLS Policies - Admin Write Access
-- =============================================================================

-- Color Palettes - admin full access
CREATE POLICY "Admins can manage color palettes"
  ON color_palettes FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Color Combinations - admin full access
CREATE POLICY "Admins can manage color combinations"
  ON color_combinations FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Project Categories - admin full access
CREATE POLICY "Admins can manage project categories"
  ON project_categories FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Button Text Presets - admin full access
CREATE POLICY "Admins can manage button text presets"
  ON button_text_presets FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Stats Counters - admin full access
CREATE POLICY "Admins can manage stats counters"
  ON stats_counters FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Development Process Steps - admin full access
CREATE POLICY "Admins can manage development process steps"
  ON development_process_steps FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Project Deliverables - admin full access
CREATE POLICY "Admins can manage project deliverables"
  ON project_deliverables FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- AI Tools - admin full access
CREATE POLICY "Admins can manage AI tools"
  ON ai_tools FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- AI Productivity Stats - admin full access
CREATE POLICY "Admins can manage AI productivity stats"
  ON ai_productivity_stats FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- =============================================================================
-- SECTION 16: Seed Data - Color Palettes (System)
-- =============================================================================

INSERT INTO color_palettes (name, display_name, description, is_system, is_active) VALUES
('cyber_blue', 'Cyber Blue', 'Cool blues with tech vibes', true, true),
('neon_nights', 'Neon Nights', 'Vibrant neon colors for a bold look', true, true),
('sunset_ember', 'Sunset Ember', 'Warm orange and red tones', true, true),
('forest_zen', 'Forest Zen', 'Natural greens for a calming feel', true, true),
('monochrome_pro', 'Monochrome Pro', 'Clean black and white aesthetic', true, true),
('purple_haze', 'Purple Haze', 'Rich purples with mystical vibes', true, true),
('ocean_deep', 'Ocean Deep', 'Deep blues with oceanic feel', true, true);

-- =============================================================================
-- SECTION 17: Seed Data - Color Combinations
-- =============================================================================

-- Cyber Blue combinations
INSERT INTO color_combinations (palette_id, name, is_default, primary_color, secondary_color, accent_color, background_dark, background_light, surface_dark, surface_light, text_primary_dark, text_primary_light, text_secondary_dark, text_secondary_light, border_dark, border_light, display_order)
SELECT id, 'Classic', true, '#00d4ff', '#0099cc', '#00ffff', '#0a0a0f', '#f8fafc', '#12121a', '#ffffff', '#ffffff', '#0f172a', '#94a3b8', '#64748b', '#1e293b', '#e2e8f0', 1
FROM color_palettes WHERE name = 'cyber_blue';

INSERT INTO color_combinations (palette_id, name, is_default, primary_color, secondary_color, accent_color, background_dark, background_light, surface_dark, surface_light, text_primary_dark, text_primary_light, text_secondary_dark, text_secondary_light, border_dark, border_light, display_order)
SELECT id, 'Electric', false, '#00ffff', '#00d4ff', '#66ffff', '#050510', '#f0f9ff', '#0a0a1a', '#e0f2fe', '#f0f9ff', '#0c4a6e', '#7dd3fc', '#38bdf8', '#0e7490', '#bae6fd', 2
FROM color_palettes WHERE name = 'cyber_blue';

-- Neon Nights combinations
INSERT INTO color_combinations (palette_id, name, is_default, primary_color, secondary_color, accent_color, background_dark, background_light, surface_dark, surface_light, text_primary_dark, text_primary_light, text_secondary_dark, text_secondary_light, border_dark, border_light, display_order)
SELECT id, 'Classic', true, '#ff00ff', '#cc00cc', '#ff66ff', '#0a0008', '#fdf4ff', '#120010', '#fae8ff', '#ffffff', '#4a044e', '#d946ef', '#a855f7', '#86198f', '#f0abfc', 1
FROM color_palettes WHERE name = 'neon_nights';

INSERT INTO color_combinations (palette_id, name, is_default, primary_color, secondary_color, accent_color, background_dark, background_light, surface_dark, surface_light, text_primary_dark, text_primary_light, text_secondary_dark, text_secondary_light, border_dark, border_light, display_order)
SELECT id, 'Pink Glow', false, '#ff1493', '#ff69b4', '#ffb6c1', '#0a0005', '#fff1f2', '#150010', '#ffe4e6', '#ffffff', '#881337', '#fb7185', '#f43f5e', '#9f1239', '#fda4af', 2
FROM color_palettes WHERE name = 'neon_nights';

-- Sunset Ember combinations
INSERT INTO color_combinations (palette_id, name, is_default, primary_color, secondary_color, accent_color, background_dark, background_light, surface_dark, surface_light, text_primary_dark, text_primary_light, text_secondary_dark, text_secondary_light, border_dark, border_light, display_order)
SELECT id, 'Classic', true, '#ff6b35', '#ff8c42', '#ffa726', '#0f0805', '#fffbeb', '#1a0f08', '#fef3c7', '#ffffff', '#451a03', '#fb923c', '#f97316', '#c2410c', '#fed7aa', 1
FROM color_palettes WHERE name = 'sunset_ember';

INSERT INTO color_combinations (palette_id, name, is_default, primary_color, secondary_color, accent_color, background_dark, background_light, surface_dark, surface_light, text_primary_dark, text_primary_light, text_secondary_dark, text_secondary_light, border_dark, border_light, display_order)
SELECT id, 'Golden Hour', false, '#f59e0b', '#fbbf24', '#fcd34d', '#0f0a02', '#fefce8', '#1a1005', '#fef9c3', '#ffffff', '#422006', '#facc15', '#eab308', '#a16207', '#fde047', 2
FROM color_palettes WHERE name = 'sunset_ember';

-- Forest Zen combinations
INSERT INTO color_combinations (palette_id, name, is_default, primary_color, secondary_color, accent_color, background_dark, background_light, surface_dark, surface_light, text_primary_dark, text_primary_light, text_secondary_dark, text_secondary_light, border_dark, border_light, display_order)
SELECT id, 'Classic', true, '#22c55e', '#16a34a', '#4ade80', '#050f08', '#f0fdf4', '#0a1a10', '#dcfce7', '#ffffff', '#14532d', '#4ade80', '#22c55e', '#15803d', '#86efac', 1
FROM color_palettes WHERE name = 'forest_zen';

INSERT INTO color_combinations (palette_id, name, is_default, primary_color, secondary_color, accent_color, background_dark, background_light, surface_dark, surface_light, text_primary_dark, text_primary_light, text_secondary_dark, text_secondary_light, border_dark, border_light, display_order)
SELECT id, 'Mint Fresh', false, '#10b981', '#34d399', '#6ee7b7', '#021a12', '#ecfdf5', '#052e22', '#d1fae5', '#ffffff', '#064e3b', '#34d399', '#10b981', '#047857', '#6ee7b7', 2
FROM color_palettes WHERE name = 'forest_zen';

-- Monochrome Pro combinations
INSERT INTO color_combinations (palette_id, name, is_default, primary_color, secondary_color, accent_color, background_dark, background_light, surface_dark, surface_light, text_primary_dark, text_primary_light, text_secondary_dark, text_secondary_light, border_dark, border_light, display_order)
SELECT id, 'Classic', true, '#ffffff', '#e5e5e5', '#a3a3a3', '#000000', '#ffffff', '#171717', '#f5f5f5', '#ffffff', '#171717', '#a3a3a3', '#525252', '#262626', '#d4d4d4', 1
FROM color_palettes WHERE name = 'monochrome_pro';

INSERT INTO color_combinations (palette_id, name, is_default, primary_color, secondary_color, accent_color, background_dark, background_light, surface_dark, surface_light, text_primary_dark, text_primary_light, text_secondary_dark, text_secondary_light, border_dark, border_light, display_order)
SELECT id, 'Soft Gray', false, '#d4d4d4', '#a3a3a3', '#737373', '#0a0a0a', '#fafafa', '#1a1a1a', '#f4f4f5', '#e5e5e5', '#27272a', '#a1a1aa', '#71717a', '#3f3f46', '#d4d4d8', 2
FROM color_palettes WHERE name = 'monochrome_pro';

-- Purple Haze combinations
INSERT INTO color_combinations (palette_id, name, is_default, primary_color, secondary_color, accent_color, background_dark, background_light, surface_dark, surface_light, text_primary_dark, text_primary_light, text_secondary_dark, text_secondary_light, border_dark, border_light, display_order)
SELECT id, 'Classic', true, '#a855f7', '#9333ea', '#c084fc', '#0a0510', '#faf5ff', '#120a1a', '#f3e8ff', '#ffffff', '#3b0764', '#c084fc', '#a855f7', '#7e22ce', '#d8b4fe', 1
FROM color_palettes WHERE name = 'purple_haze';

INSERT INTO color_combinations (palette_id, name, is_default, primary_color, secondary_color, accent_color, background_dark, background_light, surface_dark, surface_light, text_primary_dark, text_primary_light, text_secondary_dark, text_secondary_light, border_dark, border_light, display_order)
SELECT id, 'Violet Dream', false, '#8b5cf6', '#7c3aed', '#a78bfa', '#050208', '#f5f3ff', '#0c0515', '#ede9fe', '#ffffff', '#2e1065', '#a78bfa', '#8b5cf6', '#6d28d9', '#c4b5fd', 2
FROM color_palettes WHERE name = 'purple_haze';

-- Ocean Deep combinations
INSERT INTO color_combinations (palette_id, name, is_default, primary_color, secondary_color, accent_color, background_dark, background_light, surface_dark, surface_light, text_primary_dark, text_primary_light, text_secondary_dark, text_secondary_light, border_dark, border_light, display_order)
SELECT id, 'Classic', true, '#0ea5e9', '#0284c7', '#38bdf8', '#02080f', '#f0f9ff', '#051525', '#e0f2fe', '#ffffff', '#0c4a6e', '#38bdf8', '#0ea5e9', '#0369a1', '#7dd3fc', 1
FROM color_palettes WHERE name = 'ocean_deep';

INSERT INTO color_combinations (palette_id, name, is_default, primary_color, secondary_color, accent_color, background_dark, background_light, surface_dark, surface_light, text_primary_dark, text_primary_light, text_secondary_dark, text_secondary_light, border_dark, border_light, display_order)
SELECT id, 'Teal Reef', false, '#14b8a6', '#0d9488', '#2dd4bf', '#02100e', '#f0fdfa', '#05201c', '#ccfbf1', '#ffffff', '#134e4a', '#2dd4bf', '#14b8a6', '#0f766e', '#5eead4', 2
FROM color_palettes WHERE name = 'ocean_deep';

-- =============================================================================
-- SECTION 18: Seed Data - Project Categories
-- =============================================================================

INSERT INTO project_categories (name, display_name, default_button_text, display_order) VALUES
('web_application', 'Web Application', 'Explore App', 1),
('automation', 'Automation', 'See Automation', 2),
('bot', 'Bot', 'Meet the Bot', 3),
('tool', 'Tool', 'Try the Tool', 4),
('api', 'API', 'View API', 5),
('full_stack', 'Full Stack', 'Dive In', 6);

-- =============================================================================
-- SECTION 19: Seed Data - Button Text Presets
-- =============================================================================

INSERT INTO button_text_presets (text, is_active, display_order) VALUES
('Explore', true, 1),
('Be amazed', true, 2),
('What''s this!?', true, 3),
('Discover', true, 4),
('See more', true, 5),
('View project', true, 6),
('Check it out', true, 7),
('Dive in', true, 8);

-- =============================================================================
-- SECTION 20: Seed Data - Stats Counters
-- =============================================================================

INSERT INTO stats_counters (label, value, suffix, icon, is_visible, display_order) VALUES
('Years Experience', '5', '+', 'calendar', true, 1),
('Projects Completed', '50', '+', 'folder', true, 2),
('Technologies', '20', '+', 'code', true, 3);

-- =============================================================================
-- SECTION 21: Seed Data - Development Process Steps
-- =============================================================================

INSERT INTO development_process_steps (title, description, icon, is_visible, display_order) VALUES
('Discovery', 'Understanding your needs, goals, and vision to create a solid foundation for your project.', 'search', true, 1),
('Design', 'Creating intuitive user experiences and visually stunning interfaces that engage your audience.', 'palette', true, 2),
('Develop', 'Building robust, scalable solutions using modern technologies and best practices.', 'code', true, 3),
('Deploy', 'Launching your project and providing ongoing support and maintenance for long-term success.', 'rocket', true, 4);

-- =============================================================================
-- SECTION 22: Seed Data - Project Deliverables
-- =============================================================================

INSERT INTO project_deliverables (title, description, icon, is_visible, display_order) VALUES
('Clean Code', 'Well-structured, maintainable code following industry best practices and standards.', 'code-bracket', true, 1),
('Documentation', 'Comprehensive documentation for easy understanding and future maintenance.', 'document-text', true, 2),
('Deployment', 'Full deployment and hosting setup with CI/CD pipelines for seamless updates.', 'cloud-arrow-up', true, 3),
('Support', 'Ongoing support and maintenance to keep your project running smoothly.', 'wrench-screwdriver', true, 4);

-- =============================================================================
-- SECTION 23: Seed Data - AI Tools
-- =============================================================================

INSERT INTO ai_tools (name, description, icon_url, website_url, is_visible, display_order) VALUES
('Claude', 'Advanced AI assistant for coding, analysis, and creative tasks.', 'https://anthropic.com/favicon.ico', 'https://claude.ai', true, 1),
('GitHub Copilot', 'AI-powered code completion and suggestion tool.', 'https://github.githubassets.com/favicons/favicon.svg', 'https://github.com/features/copilot', true, 2),
('ChatGPT', 'Versatile AI chatbot for various tasks and conversations.', 'https://chat.openai.com/favicon.ico', 'https://chat.openai.com', true, 3),
('Cursor', 'AI-first code editor for faster development.', 'https://cursor.sh/favicon.ico', 'https://cursor.sh', true, 4);

-- =============================================================================
-- SECTION 24: Seed Data - AI Productivity Stats
-- =============================================================================

INSERT INTO ai_productivity_stats (label, value, description, is_visible, display_order) VALUES
('Faster Development', '3x', 'AI-assisted coding speeds up development significantly.', true, 1),
('Less Bugs', '50%', 'AI helps catch and prevent bugs before they reach production.', true, 2),
('AI Assistance', '24/7', 'Round-the-clock AI support for coding challenges.', true, 3);

-- =============================================================================
-- SECTION 25: Update site_settings active_palette to reference color_palettes
-- =============================================================================

-- Note: We keep the palette_type enum for now for backwards compatibility
-- Future migration can convert to foreign key reference

-- =============================================================================
-- SUCCESS MESSAGE
-- =============================================================================

DO $$
BEGIN
  RAISE NOTICE 'SUCCESS: UI Overhaul Phase 1 migration completed successfully';
  RAISE NOTICE 'Tables created: color_palettes, color_combinations, project_categories, button_text_presets, stats_counters, development_process_steps, project_deliverables, ai_tools, ai_productivity_stats';
  RAISE NOTICE 'Modified tables: site_settings (new hero/stats columns), projects (new carousel/button columns)';
  RAISE NOTICE 'RLS policies and seed data applied';
END $$;
