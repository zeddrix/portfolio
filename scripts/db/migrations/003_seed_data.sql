-- 003_seed_data.sql
-- Phase 2.4: Seed initial data
-- Inserts default site settings and placeholder data

-- =============================================================================
-- SECTION 1: Site Settings (Default Configuration)
-- =============================================================================

-- Insert default site settings
INSERT INTO site_settings (
  active_layout,
  active_palette,
  theme_mode,
  maintenance_mode
) VALUES (
  'case_study',      -- Default layout
  'cyber_blue',      -- Default color palette
  'dark',            -- Default theme
  false              -- Maintenance mode off
)
ON CONFLICT DO NOTHING;

-- =============================================================================
-- SECTION 2: Profile (Initial Personal Data)
-- =============================================================================

-- Insert initial profile data
-- NOTE: Replace these placeholder values with actual personal information
INSERT INTO profile (
  full_name,
  tagline,
  bio,
  email,
  phone,
  linkedin_url,
  github_url,
  website_url,
  location,
  available_for_work
) VALUES (
  'Zeddrix',
  'Full Stack Developer & Software Engineer',
  'Passionate software engineer with expertise in building modern web applications. Specialized in TypeScript, SvelteKit, and cloud technologies.',
  'contact@zeddrix.com',
  NULL,
  'https://linkedin.com/in/zeddrix',
  'https://github.com/zeddrix',
  'https://zeddrix.com',
  'Philippines',
  true
)
ON CONFLICT DO NOTHING;

-- =============================================================================
-- SECTION 3: Skills (Sample Technical Skills)
-- =============================================================================

-- Frontend skills
INSERT INTO skills (category, name, proficiency_level, display_order, is_featured) VALUES
  ('frontend', 'TypeScript', 5, 1, true),
  ('frontend', 'SvelteKit', 5, 2, true),
  ('frontend', 'Tailwind CSS', 5, 3, true),
  ('frontend', 'HTML5', 5, 4, false),
  ('frontend', 'CSS3', 5, 5, false)
ON CONFLICT DO NOTHING;

-- Backend skills
INSERT INTO skills (category, name, proficiency_level, display_order, is_featured) VALUES
  ('backend', 'Node.js', 4, 6, true),
  ('backend', 'PostgreSQL', 4, 7, true),
  ('backend', 'Supabase', 4, 8, false),
  ('backend', 'REST APIs', 5, 9, false)
ON CONFLICT DO NOTHING;

-- Programming languages
INSERT INTO skills (category, name, proficiency_level, display_order, is_featured) VALUES
  ('programming', 'JavaScript', 5, 10, true),
  ('programming', 'TypeScript', 5, 11, true),
  ('programming', 'Python', 3, 12, false)
ON CONFLICT DO NOTHING;

-- DevOps & Tools
INSERT INTO skills (category, name, proficiency_level, display_order, is_featured) VALUES
  ('devops', 'Git', 5, 13, false),
  ('devops', 'Vercel', 4, 14, false),
  ('devops', 'Docker', 3, 15, false),
  ('tools', 'VS Code', 5, 16, false),
  ('tools', 'Figma', 4, 17, false)
ON CONFLICT DO NOTHING;

-- =============================================================================
-- SECTION 4: Social Links
-- =============================================================================

-- Insert social media links
INSERT INTO social_links (platform, url, icon_name, display_order, is_visible) VALUES
  ('GitHub', 'https://github.com/zeddrix', 'github', 1, true),
  ('LinkedIn', 'https://linkedin.com/in/zeddrix', 'linkedin', 2, true),
  ('Twitter', 'https://twitter.com/zeddrix', 'twitter', 3, true),
  ('Email', 'mailto:contact@zeddrix.com', 'mail', 4, true)
ON CONFLICT DO NOTHING;

-- =============================================================================
-- SECTION 5: Sample Project (Optional - demonstrates structure)
-- =============================================================================

-- Insert a sample project to demonstrate the structure
-- This can be deleted/replaced with actual projects later
INSERT INTO projects (
  title,
  slug,
  short_description,
  full_description,
  challenge,
  solution,
  tech_stack,
  featured_image_url,
  featured_image_cloudinary_id,
  gallery_images,
  is_featured,
  display_order,
  published
) VALUES (
  'Portfolio Website',
  'portfolio-website',
  'Modern, dynamic portfolio with multiple layouts and color themes',
  'Built a comprehensive portfolio system with SvelteKit featuring three switchable layouts, seven color palettes, and a custom admin panel for content management.',
  'Create a portfolio that stands out while showcasing technical skills and providing a unique user experience.',
  'Implemented a dynamic theming system with CSS custom properties, multiple layout options, and integrated Supabase for backend and Cloudinary for media optimization.',
  ARRAY['SvelteKit', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Cloudinary'],
  'https://placeholder.com/800x600',  -- Replace with actual Cloudinary URL
  'sample_placeholder_id',             -- Replace with actual Cloudinary ID
  '[]'::jsonb,                         -- Empty gallery for now
  true,
  1,
  false  -- Not published yet - will publish when project is complete
)
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- SECTION 6: Sample Certification (Optional)
-- =============================================================================

-- Insert a sample certification to demonstrate the structure
INSERT INTO certifications (
  title,
  issuer,
  issue_date,
  credential_url,
  display_order
) VALUES (
  'Full Stack Development Certification',
  'Tech Academy',
  '2024-01-15',
  'https://example.com/cert/12345',
  1
)
ON CONFLICT DO NOTHING;

-- =============================================================================
-- SECTION 7: Sample Experience (Optional)
-- =============================================================================

-- Insert a sample work experience to demonstrate the structure
INSERT INTO experiences (
  company,
  position,
  description,
  start_date,
  end_date,
  is_current,
  location,
  display_order
) VALUES (
  'Tech Company',
  'Full Stack Developer',
  'Developed and maintained web applications using modern technologies including SvelteKit, TypeScript, and PostgreSQL.',
  '2023-01-01',
  NULL,
  true,
  'Remote',
  1
)
ON CONFLICT DO NOTHING;

-- =============================================================================
-- SUCCESS MESSAGE
-- =============================================================================

DO $$
DECLARE
  site_settings_count INTEGER;
  profile_count INTEGER;
  skills_count INTEGER;
  social_links_count INTEGER;
  projects_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO site_settings_count FROM site_settings;
  SELECT COUNT(*) INTO profile_count FROM profile;
  SELECT COUNT(*) INTO skills_count FROM skills;
  SELECT COUNT(*) INTO social_links_count FROM social_links;
  SELECT COUNT(*) INTO projects_count FROM projects;

  RAISE NOTICE 'SUCCESS: Initial data seeded successfully';
  RAISE NOTICE 'Site settings: % row(s)', site_settings_count;
  RAISE NOTICE 'Profile: % row(s)', profile_count;
  RAISE NOTICE 'Skills: % row(s)', skills_count;
  RAISE NOTICE 'Social links: % row(s)', social_links_count;
  RAISE NOTICE 'Projects: % row(s)', projects_count;
  RAISE NOTICE '';
  RAISE NOTICE 'NOTE: Sample data inserted. Update with actual personal information.';
END $$;
