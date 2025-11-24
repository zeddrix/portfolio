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
  'Zeddrix Fabian',
  'Software Engineer',
  'Passionate Software Engineer with expertise in full-stack development, cloud technologies, and modern web frameworks. Committed to writing clean, efficient, and scalable code while solving complex technical challenges. Currently working at Codefrost, where we revolutionize software development through AI-powered solutions, custom SaaS products, and innovative AI integration strategies.',
  'zeddrix.fabian@codefrost.com',
  NULL,
  'https://www.linkedin.com/in/zeddrix-fabian-30a18029a/',
  'https://github.com/zeddrix',
  'https://zeddrix.com',
  'Philippines',
  true
)
ON CONFLICT DO NOTHING;

-- =============================================================================
-- SECTION 3: Skills (Technical Skills)
-- =============================================================================

-- Programming Languages
INSERT INTO skills (category, name, proficiency_level, display_order, is_featured) VALUES
  ('programming', 'JavaScript', 5, 1, true),
  ('programming', 'TypeScript', 5, 2, true),
  ('programming', 'Python', 4, 3, true)
ON CONFLICT DO NOTHING;

-- Frontend Development
INSERT INTO skills (category, name, proficiency_level, display_order, is_featured) VALUES
  ('frontend', 'React', 5, 4, true),
  ('frontend', 'Next.js', 5, 5, true),
  ('frontend', 'Angular', 4, 6, true),
  ('frontend', 'Svelte', 4, 7, true),
  ('frontend', 'SvelteKit', 5, 8, true),
  ('frontend', 'CSS3', 5, 9, false),
  ('frontend', 'Sass', 4, 10, false),
  ('frontend', 'Tailwind CSS', 5, 11, true),
  ('frontend', 'Material-UI', 4, 12, false),
  ('frontend', 'Bootstrap', 4, 13, false),
  ('frontend', 'Redux', 4, 14, false),
  ('frontend', 'Jest', 4, 15, false),
  ('frontend', 'Cypress', 4, 16, false),
  ('frontend', 'Playwright', 4, 17, false)
ON CONFLICT DO NOTHING;

-- Backend Development
INSERT INTO skills (category, name, proficiency_level, display_order, is_featured) VALUES
  ('backend', 'Node.js', 5, 18, true),
  ('backend', 'Express', 5, 19, true),
  ('backend', 'NestJS', 4, 20, true),
  ('backend', 'Django', 4, 21, false),
  ('backend', 'PostgreSQL', 5, 22, true),
  ('backend', 'MongoDB', 4, 23, false),
  ('backend', 'MySQL', 4, 24, false),
  ('backend', 'Redis', 4, 25, false),
  ('backend', 'Supabase', 5, 26, true)
ON CONFLICT DO NOTHING;

-- DevOps & Tools
INSERT INTO skills (category, name, proficiency_level, display_order, is_featured) VALUES
  ('devops', 'Docker', 4, 27, true),
  ('devops', 'Git', 5, 28, true),
  ('devops', 'GitHub', 5, 29, false)
ON CONFLICT DO NOTHING;

-- =============================================================================
-- SECTION 4: Social Links
-- =============================================================================

-- Insert social media links
INSERT INTO social_links (platform, url, icon_name, display_order, is_visible) VALUES
  ('GitHub', 'https://github.com/zeddrix', 'github', 1, true),
  ('LinkedIn', 'https://www.linkedin.com/in/zeddrix-fabian-30a18029a/', 'linkedin', 2, true),
  ('Email', 'mailto:zeddrix.fabian@codefrost.com', 'mail', 3, true),
  ('Website', 'https://zeddrix.com', 'globe', 4, true)
ON CONFLICT DO NOTHING;

-- =============================================================================
-- SECTION 5: Projects
-- =============================================================================

-- UseDelight Chrome Extension
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
  project_url,
  is_featured,
  display_order,
  published
) VALUES (
  'UseDelight',
  'usedelight-chrome-extension',
  'Nature Wallpapers HD Video New Tab Background',
  'Transform your new tab into a stunning, safe-for-work dashboard with UseDelight—perfect for classrooms, offices, and home users. Enjoy over 1,500 high-definition motion video backgrounds featuring breathtaking scenes from oceans, beaches, mountains, forests, waterfalls, deserts, and all four seasons. Each new tab brings you a fresh, immersive view of Earth''s natural wonders, helping you relax, focus, and stay inspired throughout your day.',
  'Users needed a way to personalize their browser new tab experience with high-quality, professionally curated nature content that was appropriate for all environments.',
  'Built a Chrome extension that provides access to 1,500+ HD motion video backgrounds featuring diverse natural scenes, creating an immersive and inspiring new tab experience for users worldwide.',
  ARRAY['JavaScript', 'Chrome Extension API', 'HTML5', 'CSS3'],
  'https://res.cloudinary.com/demo/image/upload/sample.jpg',
  'placeholder-usedelight',
  '[]'::jsonb,
  'https://chromewebstore.google.com/detail/Nature%20Wallpapers%20HD%20video%20New%20Tab%20background/hehbgjdnbibkndghdlilefececadokpb',
  true,
  1,
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Bolt to GitHub Chrome Extension
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
  project_url,
  is_featured,
  display_order,
  published
) VALUES (
  'Bolt to GitHub',
  'bolt-to-github',
  'Productivity Chrome extension for GitHub workflow automation',
  'Bolt-to-GitHub is a productivity Chrome extension that streamlines the workflow of creating and syncing GitHub issues and repositories directly from the browser. Quickly capture context, create issues with prefilled metadata, and push code snippets or repository setup tasks to GitHub without switching apps—saving time for engineers and product teams.',
  'Developers needed a faster way to create GitHub issues and manage repositories without constantly switching between their browser and GitHub interface.',
  'Created a Chrome extension that integrates directly with GitHub''s API, enabling users to create issues, sync repositories, and manage tasks seamlessly from their browser with prefilled metadata and context capture.',
  ARRAY['JavaScript', 'TypeScript', 'Chrome Extension API', 'GitHub API'],
  'https://res.cloudinary.com/demo/image/upload/sample.jpg',
  'placeholder-bolt-to-github',
  '[]'::jsonb,
  'https://chromewebstore.google.com/detail/bolt-to-github/pikdepbilbnnpgdkdaaoeekgflljmame',
  true,
  2,
  true
)
ON CONFLICT (slug) DO NOTHING;

-- AnswerIQ Platform
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
  project_url,
  is_featured,
  display_order,
  published
) VALUES (
  'AnswerIQ',
  'answeriq-platform',
  'AI-Powered FAQ Generation Platform',
  'Automatically create People Also Ask-based FAQ articles that boost your store''s SEO and help customers find answers faster. AnswerIQ uses artificial intelligence to generate relevant, well-structured FAQ content that improves search engine visibility and enhances customer experience.',
  'E-commerce stores needed a way to improve SEO and provide quick answers to customer questions without manually creating extensive FAQ sections.',
  'Developed an AI-powered platform that automatically generates People Also Ask-based FAQ articles, improving SEO rankings and helping customers find answers quickly, reducing support tickets and improving conversion rates.',
  ARRAY['React', 'Node.js', 'AI/ML', 'PostgreSQL', 'TypeScript'],
  'https://res.cloudinary.com/demo/image/upload/sample.jpg',
  'placeholder-answeriq',
  '[]'::jsonb,
  NULL,
  true,
  3,
  true
)
ON CONFLICT (slug) DO NOTHING;

-- TrulyHappy App
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
  project_url,
  is_featured,
  display_order,
  published
) VALUES (
  'TrulyHappy',
  'trulyhappy-app',
  'Personalized Wellness and Happiness Guidance',
  'TrulyHappy provides personalized guidance, adapting to your needs for a more fulfilling and joyful life. The app combines wellness tracking, personalized recommendations, and adaptive content to help users achieve their happiness and wellness goals.',
  'People needed a personalized wellness platform that could adapt to their unique needs and provide actionable guidance for improving their mental and emotional wellbeing.',
  'Built a comprehensive wellness platform that uses personalization algorithms to deliver tailored guidance, combining wellness tracking, adaptive recommendations, and evidence-based practices to help users achieve lasting happiness and fulfillment.',
  ARRAY['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'],
  'https://res.cloudinary.com/demo/image/upload/sample.jpg',
  'placeholder-trulyhappy',
  '[]'::jsonb,
  'https://trulyhappy.app/',
  true,
  4,
  true
)
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- SECTION 6: Certifications
-- =============================================================================

-- Note: Certifications are available on LinkedIn profile
-- No seed data added here as certifications will be managed via admin panel

-- =============================================================================
-- SECTION 7: Work Experience
-- =============================================================================

-- Codefrost - Current position
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
  'Codefrost',
  'Software Engineer',
  'Working on revolutionary software development solutions including AI-powered development tools and consulting, custom SaaS product development and white-labeling, innovative AI integration strategies, Progressive Web Apps (PWAs), and full-stack development services. Combining decades of experience with cutting-edge AI tools to deliver exceptional software solutions. Contributing to AI-Driven Coder to share expertise and empower developers worldwide.',
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
