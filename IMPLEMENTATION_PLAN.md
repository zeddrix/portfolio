# Zeddrix Portfolio - Comprehensive Implementation Plan

## Project Overview

Build a modern, dynamic SvelteKit portfolio with:

- Three switchable layouts (Modern Case Study, Single-Page Scrolling, Bento Grid)
- Seven color palettes (Cyber Blue, Neon Nights, Sunset Ember, Forest Zen, Monochrome Pro, Purple Haze, Ocean Deep)
- Visitors can switch layouts and color palettes in real-time
- Custom admin panel for content management and setting defaults
- Dark/light mode support (default: dark)
- Smooth scroll animations with fade-in effects
- Full control over content without rebuilding

## Tech Stack

- **Frontend Framework**: SvelteKit (Svelte 4)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Media Storage & Optimization**: Cloudinary (images, videos, GIFs)
- **UI Library**: shadcn-svelte (admin panel)
- **Styling**: Tailwind CSS
- **Animations**: Svelte transitions + Motion One
- **Deployment**: Vercel

---

## Phase 1: Project Setup & Foundation

### 1.1 Initialize SvelteKit Project

- Create new SvelteKit project with TypeScript
- Configure for Svelte 4 (ensure not using Svelte 5)
- Set up project structure with proper folder organization
- Configure svelte.config.js for adapter-auto (Vercel deployment)

### 1.2 Install Core Dependencies

- Install Tailwind CSS and configure with SvelteKit
- Install shadcn-svelte for admin UI components
- Install Supabase client library
- Install animation library (Motion One - lightweight, modern API)
- Install form handling library (superforms recommended for SvelteKit)
- Install Zod for schema validation
- Install Cloudinary SDK for all media handling (images, videos, GIFs)

### 1.3 Environment Configuration

- Create .env file for environment variables
- Set up Supabase project and get credentials (URL, anon key, service role key)
- Set up Cloudinary account and get API credentials
- Configure environment variables for local development
- Add .env to .gitignore

### 1.4 Tailwind & Design System Setup

- Configure Tailwind to use CSS custom properties for dynamic theming
- Set up dark mode configuration (class-based strategy with data-theme attribute)
- Configure Tailwind to reference CSS variables for all theme colors
- Set up custom fonts (if needed)
- Configure responsive breakpoints
- Create base CSS reset and global styles
- Prepare structure for 7 color palettes with CSS custom properties

---

## Phase 2: Database Schema & Supabase Configuration

### 2.1 Design Database Schema

#### Tables to Create:

**site_settings**

- id (uuid, primary key)
- active_layout (enum: 'case_study', 'single_page', 'bento_grid')
- active_palette (enum: 'cyber_blue', 'neon_nights', 'sunset_ember', 'forest_zen', 'monochrome_pro', 'purple_haze', 'ocean_deep')
- theme_mode (enum: 'dark', 'light')
- maintenance_mode (boolean)
- created_at (timestamp)
- updated_at (timestamp)

**profile**

- id (uuid, primary key)
- full_name (text)
- tagline (text)
- bio (text)
- email (text)
- phone (text, nullable)
- linkedin_url (text, nullable)
- github_url (text, nullable)
- website_url (text, nullable)
- profile_image_url (text, nullable)
- profile_image_cloudinary_id (text, nullable)
- location (text, nullable)
- available_for_work (boolean)
- created_at (timestamp)
- updated_at (timestamp)

**skills**

- id (uuid, primary key)
- category (enum: 'programming', 'frontend', 'backend', 'devops', 'tools')
- name (text)
- icon_url (text, nullable)
- badge_url (text, nullable)
- proficiency_level (integer, 1-5)
- display_order (integer)
- is_featured (boolean)
- created_at (timestamp)

**projects**

- id (uuid, primary key)
- title (text)
- slug (text, unique)
- short_description (text)
- full_description (text)
- challenge (text, nullable)
- solution (text, nullable)
- tech_stack (text array)
- project_url (text, nullable)
- github_url (text, nullable)
- featured_image_url (text)
- featured_image_cloudinary_id (text)
- gallery_images (jsonb array of {url, cloudinary_id, media_type: 'image'|'video'|'gif'})
- demo_video_url (text, nullable)
- demo_video_cloudinary_id (text, nullable)
- is_featured (boolean)
- display_order (integer)
- metrics (jsonb, nullable - for case study stats)
- created_at (timestamp)
- updated_at (timestamp)
- published (boolean)

**certifications**

- id (uuid, primary key)
- title (text)
- issuer (text)
- issue_date (date)
- expiry_date (date, nullable)
- credential_url (text, nullable)
- credential_id (text, nullable)
- display_order (integer)
- created_at (timestamp)

**experiences**

- id (uuid, primary key)
- company (text)
- position (text)
- description (text)
- start_date (date)
- end_date (date, nullable)
- is_current (boolean)
- location (text, nullable)
- display_order (integer)
- created_at (timestamp)

**social_links**

- id (uuid, primary key)
- platform (text)
- url (text)
- icon_name (text)
- display_order (integer)
- is_visible (boolean)
- created_at (timestamp)

**admin_users**

- id (uuid, primary key, references auth.users)
- email (text)
- role (enum: 'admin', 'editor')
- created_at (timestamp)

### 2.2 Create Database Tables in Supabase

- Write SQL migration scripts for all tables
- Execute migrations in Supabase SQL editor
- Verify all tables are created with correct schema

### 2.3 Configure Row Level Security (RLS)

- Enable RLS on all tables
- Create policies for public read access on published content
- Create policies for authenticated admin write access
- Create policy to restrict admin_users table to authenticated users only
- Test RLS policies to ensure security

### 2.4 Seed Initial Data

- Insert default row in site_settings (layout: case_study, palette: cyber_blue, theme: dark)
- Insert your personal profile data
- Insert initial projects from draft markdown
- Insert skills from draft markdown
- Insert certifications reference
- Insert social links

---

## Phase 3: Authentication System

### 3.1 Supabase Auth Configuration

- Configure Supabase Auth settings (email provider)
- Set up email templates for authentication
- Configure redirect URLs for local and production
- Decide on authentication method (magic link or email/password - recommend email/password for admin)

### 3.2 Authentication Utilities

- Create Supabase client helper for server-side
- Create Supabase client helper for client-side
- Create authentication store in Svelte for user state
- Create session management utilities

### 3.3 Protected Routes Middleware

- Create hooks.server.ts for server-side auth checks
- Implement route protection for /admin routes
- Create redirect logic for unauthenticated users
- Set up proper error handling for auth failures

### 3.4 Admin User Setup

- Create first admin user in Supabase Auth
- Insert admin user into admin_users table
- Test authentication flow
- Create logout functionality

---

## Phase 4: Core Layout System Architecture

### 4.1 Layout Detection & Store

- Create Svelte store for active layout state
- Create function to fetch default layout from site_settings (admin-set default)
- Check localStorage for visitor's layout preference (overrides default)
- Implement layout store subscriber for real-time updates
- Create layout constants/enums matching database values ('case_study', 'single_page', 'bento_grid')
- Persist visitor's layout choice to localStorage
- Load visitor's preference on page load, fallback to admin's default layout

### 4.2 Layout Component Structure

- Create base layout wrapper component
- Create layout switcher component that renders active layout
- Create separate layout components:
  - CaseStudyLayout.svelte
  - SinglePageLayout.svelte
  - BentoGridLayout.svelte
- Ensure all layouts consume same data from stores
- Implement proper prop drilling or context for shared data

### 4.3 Shared Components Across Layouts

- Create reusable Hero component (adaptable to each layout)
- Create reusable ProjectCard component (different styles per layout)
- Create reusable SkillBadge component
- Create reusable ContactSection component
- Create reusable Navigation component
- Ensure components accept variant props for layout-specific styling

### 4.4 Layout-Specific Components

- Create CaseStudyCard component for Option 3
- Create BentoGridCard component for Option 4
- Create TimelineComponent for certifications/experience
- Create ScrollIndicator component for single-page layout

### 4.5 Visitor Layout Switcher (Public Site)

- Create LayoutSwitcher component for public navigation
- Display three layout options with icons (Case Study, Single-Page, Bento Grid)
- Highlight currently active layout
- Implement click handler to update layout store and localStorage
- Add smooth transition animation when switching layouts
- Position switcher in header/navigation (desktop) and menu (mobile)
- Ensure switcher is accessible and keyboard-navigable
- Add tooltips/labels for each layout option

---

## Phase 5: Theme & Color Palette System

### 5.1 Theme Store & Toggle Logic (Dark/Light Mode)

- Create Svelte store for theme state (default: dark)
- Create theme toggle function
- Persist theme preference in localStorage
- Sync theme with site_settings from database
- Apply theme data attribute to html element (data-theme="dark" or data-theme="light")

### 5.2 Color Palette Store & Switching Logic

- Create Svelte store for active color palette state
- Create function to fetch default palette from site_settings (admin-set default)
- Check localStorage for visitor's palette preference (overrides default)
- Persist visitor's palette choice to localStorage
- Load visitor's preference on page load, fallback to admin's default palette
- Apply palette data attribute to html element (data-palette="cyber_blue", etc.)
- Create palette constants/enums matching database values

### 5.3 CSS Custom Properties for All 7 Color Palettes

**Define CSS custom properties for each palette in global stylesheet:**

Create selectors for all combinations of theme (dark/light) and palette:

- `[data-theme="dark"][data-palette="cyber_blue"]`
- `[data-theme="light"][data-palette="cyber_blue"]`
- `[data-theme="dark"][data-palette="neon_nights"]`
- (... and so on for all 7 palettes × 2 themes = 14 combinations)

**Color variables to define for each combination:**

- `--color-primary` (RGB values without rgb())
- `--color-secondary` (RGB values)
- `--color-accent` (RGB values)
- `--color-background` (RGB values)
- `--color-surface` (RGB values - cards, panels)
- `--color-text-primary` (RGB values)
- `--color-text-secondary` (RGB values - muted text)
- `--color-border` (RGB values)
- `--color-success` (RGB values)
- `--color-warning` (RGB values)
- `--color-error` (RGB values)

**Example implementation structure:**

```css
[data-theme='dark'][data-palette='cyber_blue'] {
	--color-primary: 0 217 255;
	--color-secondary: 123 97 255;
	--color-accent: 255 0 110;
	--color-background: 10 14 39;
	--color-surface: 21 27 59;
	--color-text-primary: 224 231 255;
	--color-text-secondary: 148 163 184;
	--color-border: 51 65 85;
}

[data-theme='light'][data-palette='cyber_blue'] {
	--color-primary: 8 145 178;
	--color-secondary: 124 58 237;
	--color-accent: 219 39 119;
	--color-background: 248 250 252;
	--color-surface: 255 255 255;
	--color-text-primary: 30 41 59;
	--color-text-secondary: 100 116 139;
	--color-border: 226 232 240;
}
```

Repeat for all 7 palettes with their specific color values.

### 5.4 Tailwind Configuration for Dynamic Colors

- Configure Tailwind theme to reference CSS variables
- Use RGB format for alpha channel support
- Map Tailwind color classes to CSS custom properties

**Example Tailwind config:**

```javascript
module.exports = {
	theme: {
		extend: {
			colors: {
				primary: 'rgb(var(--color-primary) / <alpha-value>)',
				secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
				accent: 'rgb(var(--color-accent) / <alpha-value>)',
				background: 'rgb(var(--color-background) / <alpha-value>)',
				surface: 'rgb(var(--color-surface) / <alpha-value>)',
				'text-primary': 'rgb(var(--color-text-primary) / <alpha-value>)',
				'text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)'
			}
		}
	}
};
```

### 5.5 Theme Toggle UI

- Create theme toggle component (sun/moon icon)
- Add toggle to main navigation
- Add smooth transition between themes
- Ensure toggle is accessible

### 5.6 Color Palette Switcher UI (Public Site)

- Create ColorPaletteSwitcher component for public navigation
- Display all 7 palette options with color circle previews
- Show palette name on hover
- Highlight currently active palette
- Implement click handler to update palette store and localStorage
- Add smooth color transition animation (CSS transitions on custom properties)
- Position in header or dedicated settings panel/dropdown
- Ensure switcher is accessible and keyboard-navigable
- Group palettes visually (e.g., dropdown or grid of color circles)

**Palette Display Format:**

- Option A: Dropdown with color circle + name
- Option B: Color picker style with circles showing primary color
- Option C: Settings panel with preview cards

### 5.7 Color Transition Animations

- Add CSS transitions for smooth color palette switching
- Implement transition on all color custom properties
- Ensure animations don't cause performance issues
- Test color transitions across all components

---

## Phase 6: Animation System

### 6.1 Scroll Animation Setup

- Install and configure animation library (Motion One or GSAP)
- Create scroll observer utility for detecting elements in viewport
- Create reusable fade-in directive or component
- Create stagger animation utility for lists

### 6.2 Core Animations

- Implement fade-in-up animation for sections
- Implement slide-in animations for project cards
- Implement scale/fade animations for skill badges
- Implement smooth scroll behavior
- Create parallax effects (optional, for hero sections)

### 6.3 Layout-Specific Animations

- Case Study Layout: Full-width reveal animations
- Single Page Layout: Sequential section reveals
- Bento Grid Layout: Staggered card animations with hover effects
- Create transition animations when switching layouts

### 6.4 Performance Optimization

- Implement intersection observer for animation triggers
- Ensure animations only run when elements are visible
- Use CSS transforms for better performance
- Test animation performance on low-end devices

---

## Phase 7: Public Portfolio Frontend

### 7.1 Route Structure

- Create main route at / (portfolio home)
- Create dynamic project route at /projects/[slug]
- Create about route at /about (or part of single-page layout)
- Create contact route at /contact (or part of single-page layout)
- Set up 404 error page

### 7.2 Data Fetching Layer

- Create API routes for fetching site settings
- Create API routes for fetching profile data
- Create API routes for fetching projects (published only)
- Create API routes for fetching skills
- Create API routes for fetching certifications
- Implement proper error handling and loading states
- Use SvelteKit load functions for SSR

### 7.3 Home Page Implementation

- Implement layout switcher logic on home page
- Create layout detection on page load
- Render appropriate layout component based on site_settings
- Ensure smooth layout transitions
- Test all three layouts render correctly

### 7.4 Option 3: Case Study Layout

- Create full-width hero section with typewriter effect
- Implement featured projects section with full-width cards
- Create detailed case study view with challenge/solution/tech sections
- Add read more / expand functionality
- Implement smooth scroll between case studies
- Create footer with contact info and social links

### 7.5 Option 1: Single-Page Scrolling Layout

- Create hero section with scroll indicator
- Create about section with fade-in animations
- Create projects grid with hover effects
- Create skills section with badge display
- Create contact form section
- Implement smooth scroll navigation
- Add fixed header with section navigation

### 7.6 Option 4: Bento Grid Layout

- Create bento grid container with responsive columns
- Implement different sized cards (hero, skills, projects, etc.)
- Add glassmorphism effects to cards
- Create hover states with expansion/details reveal
- Ensure responsive grid breakpoints
- Add interactive elements to grid cards

### 7.7 Project Detail Page

- Create dynamic route for individual projects
- Fetch project by slug
- Display full project details with gallery
- Show related projects
- Add breadcrumb navigation
- Implement metadata for SEO

### 7.8 Navigation & Header

- Create responsive navigation component
- Implement hamburger menu for mobile
- Add smooth scroll to sections (for single-page layout)
- Add theme toggle to header (dark/light mode)
- Add layout switcher component to header (3 layout options)
- Add color palette switcher component to header (7 palette options)
- Ensure all controls (theme, layout, palette) are visible and accessible
- Position controls appropriately (right side of header recommended)
- Organize controls in a logical grouping (e.g., theme + palette in one group, layout separate)
- Ensure header works across all layouts
- Mobile: Group controls in hamburger menu or dedicated settings icon

### 7.9 Footer Component

- Create footer with social links
- Add contact information
- Add copyright and credits
- Ensure footer adapts to all layouts

---

## Phase 8: Admin Panel - Core Structure

### 8.1 Admin Route Structure

- Create /admin route (dashboard)
- Create /admin/login route (authentication page)
- Create /admin/profile route (edit profile)
- Create /admin/projects route (list projects)
- Create /admin/projects/new route (create project)
- Create /admin/projects/[id]/edit route (edit project)
- Create /admin/skills route (manage skills)
- Create /admin/certifications route (manage certifications)
- Create /admin/settings route (site settings & layout switcher)
- Protect all /admin routes with authentication middleware

### 8.2 Admin Layout & Navigation

- Create admin layout wrapper with sidebar navigation
- Implement responsive admin navigation
- Add logout button
- Create breadcrumb component for admin pages
- Add user profile dropdown in admin header

### 8.3 Admin Dashboard

- Create dashboard overview page
- Display total projects count
- Display total skills count
- Show active default layout indicator
- Show active default color palette indicator
- Show current default theme (dark/light)
- Add quick actions (create project, change layout, change palette, etc.)
- Display recent activity or last updated items

---

## Phase 9: Admin Panel - Site Settings

### 9.1 Default Layout Setting (Admin)

- Create layout selector UI component with three options
- Display preview thumbnails for each layout
- Implement active default layout highlighting
- Create update function to change active_layout in site_settings (sets site-wide default)
- Add confirmation dialog before changing default layout
- Show success/error notifications after update
- Add explanation text: "This sets the default layout for new visitors. Visitors can switch layouts themselves."
- Display analytics: show which layout visitors prefer (future enhancement)

### 9.2 Default Color Palette Setting (Admin)

- Create color palette selector UI component with all 7 options
- Display color previews for each palette (show primary, secondary, accent colors)
- Show palette names: Cyber Blue, Neon Nights, Sunset Ember, Forest Zen, Monochrome Pro, Purple Haze, Ocean Deep
- Implement active default palette highlighting
- Create update function to change active_palette in site_settings (sets site-wide default)
- Add confirmation dialog before changing default palette
- Show success/error notifications after update
- Add explanation text: "This sets the default color palette for new visitors. Visitors can switch palettes themselves."
- Include live preview: show how colors look on sample components
- Display analytics: show which palettes visitors prefer (future enhancement)

### 9.3 Theme Settings (Dark/Light Mode)

- Create theme preference toggle in admin settings
- Add option to set default theme for visitors (dark or light)
- Implement theme preview
- Save theme setting to site_settings table
- Add explanation text: "This sets the default theme for new visitors."

### 9.4 Maintenance Mode

- Add maintenance mode toggle in settings
- Create maintenance page for public site
- Redirect public routes to maintenance page when enabled
- Allow admin routes to bypass maintenance mode

### 9.5 General Settings

- Create form for site metadata (title, description for SEO)
- Add fields for availability status
- Add fields for contact preferences
- Implement settings save functionality with validation

---

## Phase 10: Admin Panel - Profile Management

### 10.1 Profile Edit Form

- Create form with all profile fields
- Implement form validation with Zod schema
- Add profile image upload with preview
- Implement Cloudinary integration for image upload
- Create image cropping/resizing functionality
- Add save functionality with optimistic updates
- Show success/error notifications

### 10.2 Social Links Management

- Create list view of social links
- Add create/edit/delete functionality for social links
- Implement drag-and-drop reordering
- Add toggle for link visibility
- Save display order to database

---

## Phase 11: Admin Panel - Projects Management

### 11.1 Projects List View

- Create table/grid view of all projects
- Display project thumbnail, title, status (published/draft)
- Add search/filter functionality
- Implement sorting (by date, by order)
- Add quick actions (edit, delete, toggle published)
- Implement drag-and-drop reordering for display_order

### 11.2 Create/Edit Project Form

- Create comprehensive project form with all fields
- Add title, slug (auto-generate from title), descriptions
- Add rich text editor for full_description, challenge, solution
- Implement featured image upload with Cloudinary
- Add gallery images upload (multiple images)
- Create tech stack input (tags/chips component)
- Add project URL and GitHub URL fields
- Add featured toggle checkbox
- Add published toggle
- Implement form validation
- Create save draft functionality
- Create publish functionality

### 11.3 Rich Text Editor Integration

- Choose and install rich text editor (TipTap or similar)
- Configure editor for project descriptions
- Add formatting options (bold, italic, lists, links)
- Add code block support (for technical details)
- Ensure editor output sanitization

### 11.4 Image Upload & Management

- Create image upload component
- Integrate with Cloudinary for upload
- Display upload progress
- Store Cloudinary public_id and generate URL
- Implement image preview
- Add delete image functionality
- Handle gallery images (multiple uploads)
- Implement image reordering in gallery

### 11.5 Project Deletion

- Add delete confirmation dialog
- Implement soft delete or hard delete (decide based on preference)
- Delete associated images from Cloudinary
- Show success notification
- Redirect after deletion

---

## Phase 12: Admin Panel - Skills Management

### 12.1 Skills List View

- Create categorized view of skills (group by category)
- Display skill name, category, proficiency, featured status
- Add quick edit functionality
- Implement drag-and-drop reordering within categories
- Add create/delete actions

### 12.2 Create/Edit Skills Form

- Create skill form with name, category, proficiency fields
- Add icon/badge URL fields (optional)
- Add featured toggle
- Add category selector dropdown
- Implement validation
- Save functionality

### 12.3 Skills Categories Management

- Create ability to add/edit skill categories
- Ensure categories sync with database enum or separate table
- Add category icons (optional)

---

## Phase 13: Admin Panel - Certifications & Experience

### 13.1 Certifications Management

- Create list view of certifications
- Add create/edit/delete functionality
- Create form with title, issuer, dates, credential URL
- Implement date pickers
- Add reordering capability
- Save functionality

### 13.2 Experience Management

- Create timeline view of work experiences
- Add create/edit/delete functionality
- Create form with company, position, dates, description
- Add current position toggle (sets end_date to null)
- Implement date pickers
- Add reordering capability

---

## Phase 14: Media Optimization & Cloudinary Integration

### 14.1 Cloudinary Setup

- Configure Cloudinary SDK with credentials (cloud_name, api_key, api_secret)
- Create upload utility functions for images, videos, and GIFs
- Implement image transformations (resize, crop, format)
- Set up automatic format optimization (WebP, AVIF for images)
- Configure video transcoding and optimization
- Set up GIF-to-video conversion for better performance
- Configure responsive transformations for all media types

### 14.2 Media Upload Flow

- Create unified upload component for admin panel (images, videos, GIFs)
- Implement direct upload to Cloudinary from browser with progress tracking
- Store Cloudinary public_id and resource_type in database
- Implement video upload with format detection and optimization
- Handle GIF uploads with automatic conversion to optimized video format
- Generate optimized URLs for different screen sizes and formats
- Implement media type validation and size limits

### 14.3 Video & GIF Optimization

- Configure Cloudinary video transformations (quality, format, bitrate)
- Set up adaptive bitrate streaming for videos (HLS/DASH)
- Convert large GIFs to MP4/WebM for 90%+ size reduction
- Generate video thumbnails/posters automatically
- Implement video player component with controls
- Add lazy loading for videos below the fold
- Test video playback across browsers

### 14.4 Media Display on Frontend

- Create responsive image component with srcset
- Create video player component with autoplay/loop options
- Implement blur-up/placeholder loading effect for images
- Add video poster images with lazy loading
- Ensure all media uses optimized formats
- Test loading performance for mixed media galleries

---

## Phase 15: Forms & Validation

### 15.1 Form Handling Setup

- Install and configure superforms for SvelteKit
- Create Zod schemas for all forms (profile, projects, skills, etc.)
- Implement server-side validation
- Implement client-side validation with real-time feedback

### 15.2 Contact Form (Public Site)

- Create contact form component
- Add fields: name, email, message
- Implement spam protection (honeypot or reCAPTCHA)
- Create API endpoint to handle form submission
- Send email notification (use Supabase Edge Functions or third-party service)
- Show success/error messages
- Add form validation

---

## Phase 16: SEO & Meta Tags

### 16.1 Meta Tags Setup

- Create meta tag component for dynamic metadata
- Add Open Graph tags for social sharing
- Add Twitter Card tags
- Implement dynamic meta tags based on page content
- Add canonical URLs

### 16.2 Project-Specific SEO

- Generate SEO-friendly slugs for projects
- Add meta descriptions from project short_description
- Add og:image using project featured_image
- Implement structured data (JSON-LD) for projects

### 16.3 Sitemap & Robots.txt

- Generate dynamic sitemap.xml
- Create robots.txt
- Submit sitemap to Google Search Console

---

## Phase 17: Performance Optimization

### 17.1 Code Splitting & Lazy Loading

- Ensure proper code splitting in SvelteKit
- Lazy load admin panel routes
- Lazy load heavy components (rich text editor, etc.)
- Implement dynamic imports where appropriate

### 17.2 Image Optimization

- Use Cloudinary transformations for responsive images
- Implement lazy loading for images below fold
- Add blur-up placeholders
- Use WebP/AVIF formats with fallbacks

### 17.3 Caching Strategy

- Implement SvelteKit page caching
- Cache Supabase queries where appropriate
- Add Cache-Control headers for static assets
- Implement stale-while-revalidate strategy

### 17.4 Bundle Size Optimization

- Analyze bundle size
- Remove unused dependencies
- Optimize animation library imports (tree-shaking)
- Minify production builds

---

## Phase 18: Responsive Design & Mobile Optimization

### 18.1 Mobile-First Responsive Design

- Ensure all layouts are mobile-responsive
- Test breakpoints (mobile, tablet, desktop, wide)
- Optimize touch interactions for mobile
- Ensure admin panel is mobile-friendly

### 18.2 Navigation for Mobile

- Implement hamburger menu
- Create mobile-friendly navigation drawer
- Ensure smooth animations on mobile
- Test touch gestures

### 18.3 Performance on Mobile

- Test on real mobile devices
- Optimize image sizes for mobile
- Reduce animation complexity on low-end devices
- Test on slow network connections

---

## Phase 19: Testing & Quality Assurance

### 19.1 Manual Testing

- Test all three layouts on public site
- Test layout switching in admin panel
- Test dark/light mode toggle
- Test all admin CRUD operations
- Test image uploads
- Test form validations
- Test authentication flow
- Test responsive design on multiple devices
- Test cross-browser compatibility (Chrome, Firefox, Safari)

### 19.2 Security Testing

- Test RLS policies in Supabase
- Test authentication protection on admin routes
- Test file upload security
- Ensure no sensitive data exposure
- Test for XSS vulnerabilities in rich text editor
- Verify environment variables are not exposed

### 19.3 Performance Testing

- Run Lighthouse audits
- Test page load times
- Test Time to Interactive (TTI)
- Optimize Core Web Vitals
- Test on slow network (3G simulation)

### 19.4 Accessibility Testing

- Ensure keyboard navigation works
- Test with screen readers
- Check color contrast ratios
- Add proper ARIA labels
- Ensure all interactive elements are accessible

---

## Phase 20: Deployment & Production Setup

### 20.1 Environment Configuration

- Set up production environment variables in Vercel
- Configure Supabase production URLs
- Configure Cloudinary production credentials
- Set up proper CORS policies

### 20.2 Vercel Deployment

- Connect GitHub repository to Vercel
- Configure build settings for SvelteKit
- Set up automatic deployments on push to main
- Configure preview deployments for branches
- Set up custom domain (zeddrix.com)

### 20.3 Supabase Production Configuration

- Review and tighten RLS policies
- Set up database backups
- Configure email templates for production
- Review storage bucket policies
- Set up monitoring and alerts

### 20.4 Post-Deployment Verification

- Test all functionality on production
- Verify layout switching works
- Test admin panel on production
- Verify image uploads work
- Test authentication flow
- Check SSL certificate
- Test custom domain configuration
- Verify all environment variables are correct

---

## Phase 21: Documentation & Handoff

### 21.1 Admin Panel User Guide

- Create guide for using admin panel
- Document how to create/edit projects
- Document how to switch layouts
- Document image upload best practices
- Document content management workflows

### 21.2 Technical Documentation

- Document database schema
- Document API routes
- Document component architecture
- Document deployment process
- Document environment variables

### 21.3 Maintenance Guide

- Document backup procedures
- Document how to add new features
- Document troubleshooting common issues
- Document how to update dependencies

---

## Phase 22: Future Enhancements (Optional)

### 22.1 Analytics Integration

- Integrate Google Analytics or Plausible
- Track page views
- Track layout popularity
- Track user interactions

### 22.2 Blog System

- Add blog/articles table to database
- Create blog admin CRUD
- Create blog listing page
- Create blog detail page with rich content
- Add markdown support for blog posts

### 22.3 Testimonials Section

- Add testimonials table
- Create testimonials admin CRUD
- Display testimonials on portfolio

### 22.4 Contact Form to Database

- Store contact form submissions in database
- Create admin view for submissions
- Add notification system for new submissions

### 22.5 Multi-Language Support

- Add internationalization (i18n)
- Support English and Tagalog
- Add language switcher

---

## Implementation Order & Priority

### Critical Path (MVP):

1. Phase 1: Project Setup
2. Phase 2: Database Schema
3. Phase 3: Authentication
4. Phase 4: Layout System
5. Phase 5: Theme System
6. Phase 7: Public Frontend (Option 3 first)
7. Phase 8: Admin Core
8. Phase 9: Site Settings & Layout Switcher
9. Phase 11: Projects Management
10. Phase 14: Image Integration
11. Phase 20: Deployment

### Secondary Priority:

- Phase 6: Animations
- Phase 10: Profile Management
- Phase 12: Skills Management
- Phase 13: Certifications/Experience
- Phase 16: SEO

### Polish & Optimization:

- Phase 17: Performance
- Phase 18: Responsive Design
- Phase 19: Testing
- Phase 21: Documentation

---

## Success Criteria

The portfolio is complete when:

- All three layouts are implemented and visitors can switch between them in real-time
- All seven color palettes are implemented and visitors can switch between them in real-time
- Admin can set default layout, default color palette, and manage all content without rebuilding
- Visitor layout and color palette preferences persist via localStorage
- Dark/light mode works across all layouts and color palettes
- Smooth color transitions when switching palettes
- Smooth animations work on scroll
- All media (images, videos, GIFs) are optimized and loading fast
- Videos use optimized formats with adaptive streaming
- Admin panel is secure and user-friendly
- Site is deployed and accessible at zeddrix.com
- All content from draft markdown is migrated
- Mobile responsive on all devices
- Passes Lighthouse performance audits (90+ scores)

---

## Key Technical Decisions

### Why Cloudinary for All Media Storage?

- **Superior Video Optimization**: Automatic transcoding, adaptive streaming (HLS/DASH), format optimization
- **GIF Optimization**: Converts GIFs to MP4/WebM for 90%+ size reduction while maintaining quality
- **Better Free Tier**: 25GB storage vs 1GB with Supabase Storage
- **Advanced Transformations**: On-the-fly image/video resizing, cropping, format conversion
- **CDN Performance**: Global CDN for fast media delivery worldwide
- **Automatic Optimization**: WebP/AVIF for images, optimal video codecs automatically
- **Unified Solution**: One service for all media types (images, videos, GIFs) simplifies architecture
- **Production Ready**: Battle-tested at scale, handles all portfolio media needs

### Why Custom Admin Panel over Git-based CMS?

- Real-time updates without rebuilds
- Full control over UX
- Showcases full-stack skills
- Better for frequent updates

### Why Three Layouts?

- Demonstrates advanced architecture
- Shows flexibility and planning
- Unique portfolio feature
- Can A/B test which layout performs better

### Layout Switching Flow (How It Works)

**For Visitors:**

1. First-time visitor lands on site → loads admin's default layout from site_settings
2. Visitor clicks layout switcher → updates Svelte store + saves to localStorage
3. Layout immediately changes with smooth transition
4. On next visit → checks localStorage first, uses saved preference
5. If no localStorage preference → falls back to admin's default layout

**For Admin:**

1. Admin sets default layout in admin panel settings
2. Updates site_settings.active_layout in database
3. This becomes the default for ALL new visitors
4. Existing visitors keep their personal preference (localStorage)
5. Admin can see analytics of which layouts are most popular (future enhancement)

**Technical Flow:**

```text
Page Load
  ├─ Check localStorage for 'preferred_layout'
  │   ├─ If exists → use visitor's preference
  │   └─ If not → fetch site_settings.active_layout (admin default)
  │
  └─ Render layout based on resolved preference

Layout Switch (Visitor)
  ├─ Update layoutStore (reactive)
  ├─ Save to localStorage
  └─ Trigger layout transition animation

Layout Change (Admin)
  ├─ Update site_settings.active_layout in Supabase
  └─ Only affects new visitors without saved preference
```

### Why Seven Color Palettes?

- Provides maximum personalization for visitors
- Showcases advanced CSS architecture skills
- Demonstrates understanding of design systems
- Unique feature that sets portfolio apart
- Appeals to different aesthetic preferences
- Shows attention to accessibility (Monochrome Pro for high contrast)
- Can track which palettes visitors prefer for UX insights

### Color Palette System Implementation

**Why CSS Custom Properties + Tailwind?**

- **Dynamic Switching**: Instant color changes without rebuilding
- **Performance**: No runtime CSS-in-JS overhead
- **Scalability**: Easy to add/modify palettes
- **SSR Compatible**: Works perfectly with SvelteKit
- **DX**: Use Tailwind classes, colors change automatically
- **Type Safety**: Can generate TypeScript types from palette definitions

**How It Works:**

1. Define all color palettes as CSS custom properties (14 combinations: 7 palettes × 2 themes)
2. Tailwind references these CSS variables in its config
3. Components use Tailwind classes like `bg-primary`, `text-secondary`
4. Changing `data-palette` attribute updates all colors instantly via CSS cascade
5. Smooth transitions via CSS transitions on custom properties

**Example Component Usage:**

```svelte
<!-- Component code never changes! -->
<div class="bg-surface text-text-primary border border-border">
	<h1 class="text-primary">Welcome</h1>
	<p class="text-text-secondary">Description...</p>
	<button class="bg-accent hover:bg-accent/80">Click</button>
</div>

<!-- Colors automatically match active palette! -->
```

### Color Palette Switching Flow

**For Visitors:**

1. First-time visitor lands on site → loads admin's default palette from site_settings
2. Visitor clicks color palette switcher → updates Svelte store + saves to localStorage
3. Palette immediately changes with smooth color transitions
4. On next visit → checks localStorage first, uses saved preference
5. If no localStorage preference → falls back to admin's default palette

**For Admin:**

1. Admin sets default color palette in admin panel settings
2. Updates site_settings.active_palette in database
3. This becomes the default for ALL new visitors
4. Existing visitors keep their personal preference (localStorage)
5. Admin can see analytics of which palettes are most popular (future enhancement)

**Technical Flow:**

```text
Page Load
  ├─ Check localStorage for 'preferred_palette'
  │   ├─ If exists → use visitor's preference
  │   └─ If not → fetch site_settings.active_palette (admin default)
  │
  ├─ Apply data-palette attribute to <html> element
  └─ CSS custom properties update → all colors change instantly

Palette Switch (Visitor)
  ├─ Update paletteStore (reactive)
  ├─ Save to localStorage
  ├─ Update data-palette attribute on <html>
  └─ CSS transitions smoothly animate color changes

Palette Change (Admin)
  ├─ Update site_settings.active_palette in Supabase
  └─ Only affects new visitors without saved preference
```

**Available Palettes:**

1. **Cyber Blue** - Professional tech aesthetic (default)
2. **Neon Nights** - Vibrant and energetic
3. **Sunset Ember** - Warm and creative
4. **Forest Zen** - Calm and natural
5. **Monochrome Pro** - High contrast, minimal, accessible
6. **Purple Haze** - Modern and sophisticated
7. **Ocean Deep** - Cool and professional

### Animation Library Choice

- Motion One: Lighter bundle, modern API, recommended
- GSAP: More features, heavier, if complex animations needed

---

## Development Tips for AI Agents

### When Implementing This Plan:

1. Follow phases sequentially for dependencies
2. Test each phase before moving to next
3. Commit frequently with descriptive messages
4. Keep components small and reusable
5. Use TypeScript types from database schema
6. Validate all user inputs (client + server)
7. Handle loading and error states everywhere
8. Keep admin panel and public site styles separate
9. Use Supabase realtime subscriptions for instant admin updates
10. Optimize images before upload (client-side resize)

### Common Pitfalls to Avoid:

- Don't mix Svelte 4 and 5 syntax
- Don't forget RLS policies (security critical)
- Don't skip responsive design testing
- Don't over-engineer animations (performance)
- Don't forget to handle Cloudinary errors
- Don't expose Supabase service role key on client
- Don't forget to validate slugs are unique
- Don't skip auth checks on admin API routes
- Don't forget to test all 7 color palettes in both dark and light modes
- Don't hardcode colors - always use CSS custom properties
- Don't forget smooth transitions when switching palettes

---

## Color Palette Reference

Complete color definitions for all 7 palettes in both dark and light modes. Use these RGB values when implementing CSS custom properties.

### 1. Cyber Blue (Default)

**Dark Mode:**

- Primary: `0 217 255` (#00D9FF - Cyan Blue)
- Secondary: `123 97 255` (#7B61FF - Purple)
- Accent: `255 0 110` (#FF006E - Hot Pink)
- Background: `10 14 39` (#0A0E27 - Deep Navy)
- Surface: `21 27 59` (#151B3B - Navy Blue)
- Text Primary: `224 231 255` (#E0E7FF - Light Lavender)
- Text Secondary: `148 163 184` (#94A3B8 - Slate 400)
- Border: `51 65 85` (#334155 - Slate 700)

**Light Mode:**

- Primary: `8 145 178` (#0891B2 - Cyan 600)
- Secondary: `124 58 237` (#7C3AED - Violet 600)
- Accent: `219 39 119` (#DB2777 - Pink 600)
- Background: `248 250 252` (#F8FAFC - Slate 50)
- Surface: `255 255 255` (#FFFFFF - White)
- Text Primary: `30 41 59` (#1E293B - Slate 800)
- Text Secondary: `100 116 139` (#64748B - Slate 600)
- Border: `226 232 240` (#E2E8F0 - Slate 200)

### 2. Neon Nights

**Dark Mode:**

- Primary: `0 255 163` (#00FFA3 - Neon Green)
- Secondary: `255 0 255` (#FF00FF - Neon Magenta)
- Accent: `0 255 255` (#00FFFF - Neon Cyan)
- Background: `13 13 13` (#0D0D0D - Almost Black)
- Surface: `26 26 26` (#1A1A1A - Dark Gray)
- Text Primary: `240 240 240` (#F0F0F0 - Off White)
- Text Secondary: `163 163 163` (#A3A3A3 - Neutral 400)
- Border: `64 64 64` (#404040 - Neutral 700)

**Light Mode:**

- Primary: `16 185 129` (#10B981 - Emerald 500)
- Secondary: `236 72 153` (#EC4899 - Pink 500)
- Accent: `6 182 212` (#06B6D4 - Cyan 500)
- Background: `250 250 250` (#FAFAFA - Gray 50)
- Surface: `255 255 255` (#FFFFFF - White)
- Text Primary: `10 10 10` (#0A0A0A - Near Black)
- Text Secondary: `115 115 115` (#737373 - Neutral 500)
- Border: `229 229 229` (#E5E5E5 - Neutral 200)

### 3. Sunset Ember

**Dark Mode:**

- Primary: `255 107 53` (#FF6B35 - Vibrant Orange)
- Secondary: `247 147 30` (#F7931E - Golden Orange)
- Accent: `255 210 63` (#FFD23F - Warm Yellow)
- Background: `28 25 23` (#1C1917 - Warm Black)
- Surface: `45 42 39` (#2D2A27 - Dark Brown)
- Text Primary: `254 243 226` (#FEF3E2 - Cream)
- Text Secondary: `214 211 209` (#D6D3D1 - Stone 300)
- Border: `68 64 60` (#44403C - Stone 700)

**Light Mode:**

- Primary: `234 88 12` (#EA580C - Orange 600)
- Secondary: `217 119 6` (#D97706 - Amber 600)
- Accent: `202 138 4` (#CA8A04 - Yellow 600)
- Background: `255 251 235` (#FFFBEB - Amber 50)
- Surface: `255 255 255` (#FFFFFF - White)
- Text Primary: `41 37 36` (#292524 - Stone 800)
- Text Secondary: `120 113 108` (#78716C - Stone 500)
- Border: `254 243 199` (#FEF3C7 - Amber 100)

### 4. Forest Zen

**Dark Mode:**

- Primary: `16 185 129` (#10B981 - Emerald)
- Secondary: `5 150 105` (#059669 - Teal)
- Accent: `110 231 183` (#6EE7B7 - Mint)
- Background: `15 27 19` (#0F1B13 - Forest Black)
- Surface: `26 41 32` (#1A2920 - Dark Forest)
- Text Primary: `209 250 229` (#D1FAE5 - Mint Cream)
- Text Secondary: `167 243 208` (#A7F3D0 - Emerald 200)
- Border: `6 78 59` (#064E3B - Emerald 900)

**Light Mode:**

- Primary: `5 150 105` (#059669 - Emerald 600)
- Secondary: `13 148 136` (#0D9488 - Teal 600)
- Accent: `20 184 166` (#14B8A6 - Teal 500)
- Background: `240 253 244` (#F0FDF4 - Green 50)
- Surface: `255 255 255` (#FFFFFF - White)
- Text Primary: `6 78 59` (#064E3B - Emerald 900)
- Text Secondary: `4 120 87` (#047857 - Emerald 700)
- Border: `209 250 229` (#D1FAE5 - Emerald 100)

### 5. Monochrome Pro

**Dark Mode:**

- Primary: `255 255 255` (#FFFFFF - Pure White)
- Secondary: `163 163 163` (#A3A3A3 - Neutral 400)
- Accent: `82 82 82` (#525252 - Neutral 600)
- Background: `0 0 0` (#000000 - Pure Black)
- Surface: `23 23 23` (#171717 - Neutral 900)
- Text Primary: `250 250 250` (#FAFAFA - Neutral 50)
- Text Secondary: `163 163 163` (#A3A3A3 - Neutral 400)
- Border: `64 64 64` (#404040 - Neutral 700)

**Light Mode:**

- Primary: `0 0 0` (#000000 - Pure Black)
- Secondary: `82 82 82` (#525252 - Neutral 600)
- Accent: `115 115 115` (#737373 - Neutral 500)
- Background: `255 255 255` (#FFFFFF - Pure White)
- Surface: `245 245 245` (#F5F5F5 - Neutral 100)
- Text Primary: `10 10 10` (#0A0A0A - Near Black)
- Text Secondary: `115 115 115` (#737373 - Neutral 500)
- Border: `212 212 212` (#D4D4D4 - Neutral 300)

### 6. Purple Haze

**Dark Mode:**

- Primary: `167 139 250` (#A78BFA - Violet 400)
- Secondary: `192 132 252` (#C084FC - Purple 400)
- Accent: `232 121 249` (#E879F9 - Fuchsia 400)
- Background: `30 27 46` (#1E1B2E - Deep Purple)
- Surface: `45 38 64` (#2D2640 - Dark Purple)
- Text Primary: `243 232 255` (#F3E8FF - Purple 50)
- Text Secondary: `196 181 253` (#C4B5FD - Violet 300)
- Border: `76 29 149` (#4C1D95 - Violet 900)

**Light Mode:**

- Primary: `124 58 237` (#7C3AED - Violet 600)
- Secondary: `147 51 234` (#9333EA - Purple 600)
- Accent: `192 38 211` (#C026D3 - Fuchsia 600)
- Background: `250 245 255` (#FAF5FF - Purple 50)
- Surface: `255 255 255` (#FFFFFF - White)
- Text Primary: `76 29 149` (#4C1D95 - Violet 900)
- Text Secondary: `109 40 217` (#6D28D9 - Violet 700)
- Border: `233 213 255` (#E9D5FF - Purple 200)

### 7. Ocean Deep

**Dark Mode:**

- Primary: `6 182 212` (#06B6D4 - Cyan 500)
- Secondary: `14 165 233` (#0EA5E9 - Sky 500)
- Accent: `59 130 246` (#3B82F6 - Blue 500)
- Background: `12 24 33` (#0C1821 - Ocean Black)
- Surface: `26 47 58` (#1A2F3A - Deep Ocean)
- Text Primary: `224 242 254` (#E0F2FE - Sky 100)
- Text Secondary: `125 211 252` (#7DD3FC - Sky 300)
- Border: `8 47 73` (#082F49 - Sky 950)

**Light Mode:**

- Primary: `2 132 199` (#0284C7 - Sky 600)
- Secondary: `3 105 161` (#0369A1 - Sky 700)
- Accent: `37 99 235` (#2563EB - Blue 600)
- Background: `240 249 255` (#F0F9FF - Sky 50)
- Surface: `255 255 255` (#FFFFFF - White)
- Text Primary: `8 47 73` (#082F49 - Sky 950)
- Text Secondary: `7 89 133` (#075985 - Sky 900)
- Border: `224 242 254` (#E0F2FE - Sky 100)

### Implementation Notes for Color Palettes:

1. **RGB Format**: Values are in space-separated RGB format (e.g., `0 217 255`) for Tailwind's alpha channel support
2. **Success/Warning/Error Colors**: Add these consistently across all palettes based on the palette's color temperature
3. **Accessibility**: Ensure sufficient contrast ratios (WCAG AA minimum) for all text/background combinations
4. **Testing**: Test each palette in both themes across all layouts
5. **Adjustments**: Fine-tune colors based on actual usage and accessibility requirements

---

## Estimated Complexity

- **Total Development Time**: 80-120 hours for full implementation
- **MVP Time**: 40-50 hours
- **Lines of Code Estimate**: 8,000-12,000 lines
- **Components**: ~50-70 components
- **API Routes**: ~15-20 routes
- **Database Tables**: 9 tables

---

## Final Notes

This is an ambitious, production-ready portfolio system with advanced features. The dynamic layout switching is a unique selling point that demonstrates architectural thinking and planning ahead. The custom admin panel showcases full-stack capabilities while maintaining complete ownership of the codebase.

The implementation is structured to be AI-agent-friendly with clear phases, actionable items, and no ambiguity. Each phase can be tackled independently with clear success criteria.

Ready to build something impressive! 🚀

---

## Implementation Progress Tracker

### ✅ Phase 1: Project Setup & Foundation - COMPLETE

- SvelteKit project initialized with TypeScript
- Tailwind CSS 4 configured
- Core dependencies installed (Supabase, Zod, superforms, Motion, Cloudinary)
- Environment variables configured
- Project structure established

### ✅ Phase 2: Database Schema & Supabase Configuration - COMPLETE

- All 9 database tables created (site_settings, profile, skills, projects, certifications, experiences, social_links, admin_users)
- Row Level Security (RLS) policies configured
- Database migration scripts implemented
- Initial seed data inserted
- Verification complete

### ✅ Phase 3: Authentication System - COMPLETE

**Completion Date:** November 24, 2025

**Implemented Components:**

1. **Supabase Client Helpers**
   - Server-side client: `src/lib/server/supabase.ts`
   - Client-side client: `src/lib/supabase.ts`

2. **Authentication Store**
   - Reactive auth store: `src/lib/stores/auth.ts`
   - Session state management
   - Auth state change listeners

3. **Session Management**
   - Session utilities: `src/lib/server/session.ts`
   - Helper functions: getSession, isAuthenticated, isAdmin, requireAuth, requireAdmin

4. **Protected Routes Middleware**
   - Server hooks: `src/hooks.server.ts`
   - Route protection for `/admin/*` routes
   - Automatic redirects for unauthenticated users
   - Type definitions updated in `src/app.d.ts`

5. **Login & Logout**
   - Login page: `src/routes/admin/login/+page.svelte`
   - Admin dashboard: `src/routes/admin/+page.svelte`
   - Logout functionality integrated

**Quality Checks:** ✅ All passed (Prettier, ESLint, TypeScript, svelte-check)

**Next Steps:** Phase 5 - Theme & Color Palette System

### ✅ Phase 4: Core Layout System Architecture - COMPLETE

**Completion Date:** November 24, 2025

**Implemented Components:**

1. **Layout Store & Types**
   - Layout store with localStorage persistence: `src/lib/stores/layout.ts`
   - Layout type definitions: `src/lib/types/layout.ts`
   - Timeline type definitions: `src/lib/types/timeline.ts`

2. **Layout Components**
   - Base layout wrapper: `src/lib/components/layouts/LayoutWrapper.svelte`
   - Case Study Layout: `src/lib/components/layouts/CaseStudyLayout.svelte`
   - Single Page Layout: `src/lib/components/layouts/SinglePageLayout.svelte`
   - Bento Grid Layout: `src/lib/components/layouts/BentoGridLayout.svelte`

3. **Shared Components**
   - Navigation: `src/lib/components/shared/Navigation.svelte`
   - Hero: `src/lib/components/shared/Hero.svelte`
   - ProjectCard: `src/lib/components/shared/ProjectCard.svelte`
   - SkillBadge: `src/lib/components/shared/SkillBadge.svelte`
   - ContactSection: `src/lib/components/shared/ContactSection.svelte`
   - TimelineComponent: `src/lib/components/shared/TimelineComponent.svelte`
   - ScrollIndicator: `src/lib/components/shared/ScrollIndicator.svelte`
   - LayoutSwitcher: `src/lib/components/shared/LayoutSwitcher.svelte`

4. **Layout-Specific Components**
   - CaseStudyCard: `src/lib/components/layouts/CaseStudyCard.svelte`
   - BentoGridCard: `src/lib/components/layouts/BentoGridCard.svelte`

5. **Integration**
   - Main page updated to use LayoutWrapper
   - Root layout configured with default theme attributes
   - All three layouts functional with mock data

**Known Issues:**

- Tailwind CSS 4 `@apply` directive warnings for certain utility classes
- These are cosmetic warnings that don't affect functionality
- Will be resolved in Phase 5 by refactoring CSS approach or adding @reference directives

**Features Completed:**

- ✅ Layout switching functionality via LayoutSwitcher component
- ✅ LocalStorage persistence of layout preference
- ✅ Three distinct layouts (Case Study, Single Page, Bento Grid)
- ✅ Responsive navigation with mobile hamburger menu
- ✅ Reusable component architecture with variant support
- ✅ Type-safe component props and stores

### ✅ Phase 5: Theme & Color Palette System - COMPLETE

**Completion Date:** November 24, 2025

**Implemented Components:**

1. **Theme Store (Dark/Light Mode)**
   - Theme store with localStorage persistence: `src/lib/stores/theme.ts`
   - Support for 'dark' and 'light' themes
   - Auto-initialization on page load
   - Theme toggle functionality with persistence

2. **Color Palette Store**
   - Palette store with localStorage persistence: `src/lib/stores/palette.ts`
   - Support for all 7 color palettes (Cyber Blue, Neon Nights, Sunset Ember, Forest Zen, Monochrome Pro, Purple Haze, Ocean Deep)
   - Type-safe palette definitions with metadata
   - Auto-initialization on page load
   - Palette switching with persistence

3. **CSS Custom Properties System**
   - Complete color system in `src/app.css`
   - All 7 palettes × 2 themes = 14 color combinations
   - RGB format for alpha channel support
   - Smooth color transitions (300ms ease)
   - Variables: primary, secondary, accent, background, surface, text-primary, text-secondary, border, success, warning, error

4. **Tailwind Configuration**
   - Dynamic color system in `tailwind.config.js`
   - All colors reference CSS custom properties
   - Full alpha channel support via RGB format
   - Custom colors: primary, secondary, accent, background, surface, text-primary, text-secondary, border, success, warning, error

5. **UI Components**
   - ThemeToggle component: `src/lib/components/shared/ThemeToggle.svelte`
     - Sun/moon icons for dark/light mode
     - Accessible with keyboard support
     - Focus states and ARIA labels
   - ColorPaletteSwitcher component: `src/lib/components/shared/ColorPaletteSwitcher.svelte`
     - Dropdown with all 7 palette options
     - Color preview circles
     - Palette descriptions
     - Active indicator
     - Click-outside to close

6. **Navigation Integration**
   - Updated Navigation component: `src/lib/components/shared/Navigation.svelte`
   - Desktop: Controls grouped in header (Layout | Theme + Palette)
   - Mobile: Organized in hamburger menu with labels
   - Visual separation with border between layout and theme controls

7. **Root Layout Integration**
   - Updated `src/routes/+layout.svelte`
   - Auto-initialization of theme and palette stores
   - Proper store synchronization on page load

**Additional Improvements:**

- **Fixed Tailwind CSS 4 @apply Issues** (from Phase 4)
  - Removed all `@apply` directives from component `<style>` blocks
  - Converted to inline Tailwind classes in all 12 affected components
  - Minimal `<style>` blocks preserved only for keyframes and complex selectors
  - Zero build errors, zero type errors, only 1 minor warning

**Features Completed:**

- ✅ Dark/light theme switching with localStorage persistence
- ✅ 7 color palettes with smooth transitions
- ✅ CSS custom properties for dynamic theming
- ✅ Tailwind integration with alpha channel support
- ✅ ThemeToggle component with icons
- ✅ ColorPaletteSwitcher dropdown with previews
- ✅ Navigation integration (desktop + mobile)
- ✅ Auto-initialization on page load
- ✅ Type-safe stores and components
- ✅ Accessible UI controls
- ✅ Quality checks passing (Prettier, ESLint, TypeScript)
- ✅ Fixed all Tailwind CSS 4 @apply compatibility issues

**Color Palettes Available:**

1. **Cyber Blue** (Default) - Professional tech aesthetic
2. **Neon Nights** - Vibrant and energetic
3. **Sunset Ember** - Warm and creative
4. **Forest Zen** - Calm and natural
5. **Monochrome Pro** - High contrast, minimal
6. **Purple Haze** - Modern and sophisticated
7. **Ocean Deep** - Cool and professional

**Quality Checks:** ✅ All passed (0 errors, 1 minor unused prop warning)

**Next Steps:** Phase 7 - Public Portfolio Frontend

### ✅ Phase 6: Animation System - COMPLETE

**Completion Date:** November 24, 2025

**Implemented Components:**

1. **Animation Library Integration**
   - Installed Motion One animation library
   - Lightweight, modern API with excellent performance

2. **Animation Utilities** (`src/lib/utils/animations.ts`)
   - Scroll observer for viewport detection
   - Predefined animation keyframes: fadeInUp, fadeIn, slideInLeft, slideInRight, scaleIn
   - Animation configuration presets (default, fast, slow)
   - Stagger animation support for lists
   - Smooth scroll functionality
   - Parallax scroll effects
   - Layout transition animations

3. **Svelte Actions** (`src/lib/actions/animate.ts`)
   - `animate_on_scroll` - Animates elements when they enter viewport
   - `parallax` - Adds parallax scroll effects
   - `stagger_children` - Animates child elements with stagger delay
   - `smooth_scroll` - Smooth scrolling for anchor links
   - Type-safe with customizable parameters

4. **Component Animations**
   - **Hero Component**: Staggered fade-in animations for text elements with smooth scroll buttons
   - **ProjectCard**: Fade-in-up animation on scroll
   - **SkillBadge**: Scale-in animation on scroll
   - **CaseStudyCard**: Fade-in-up with slide transition for expandable content
   - **BentoGridCard**: Scale-in animation with hover effects
   - **SinglePageLayout**: Animated section headers with scroll-triggered reveals
   - **LayoutWrapper**: Smooth fade transitions when switching between layouts

5. **Global Enhancements**
   - Added smooth scroll behavior to HTML element
   - Intersection Observer for performance-optimized animations
   - All animations trigger only when elements are visible
   - Animations run once by default (configurable)

**Features Completed:**

- ✅ Scroll-triggered animations with intersection observer
- ✅ Fade-in, slide-in, and scale animations
- ✅ Stagger animations for lists
- ✅ Smooth scrolling for navigation
- ✅ Layout transition animations
- ✅ Parallax scroll effects
- ✅ Performance-optimized (animations only when visible)
- ✅ Customizable animation parameters (duration, delay, threshold)
- ✅ Type-safe Svelte actions
- ✅ All animations integrated into existing components

**Animation Performance:**

- Uses Intersection Observer API for efficient viewport detection
- CSS transforms for smooth 60fps animations
- Lazy animation initialization (only animates visible elements)
- RequestAnimationFrame for smooth parallax

**Quality Checks:** ✅ All passed (0 errors, 1 minor warning)

**Next Steps:** Phase 7 - Public Portfolio Frontend

### ⏳ Phase 7: Public Portfolio Frontend - PENDING

### ⏳ Phase 8-22: Remaining Phases - PENDING
