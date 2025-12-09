# UI/UX Overhaul Implementation Plan

## Overview

Complete redesign inspired by Squarespace's modern aesthetic with full admin flexibility.

---

## Design Reference Images

All design inspiration images are located in the `inspo/` directory. AI agents implementing this plan should view these images to understand the visual direction.

### Hero Section

- ![Hero Reference 1](inspo/1.%20hero%201.png) - Full-screen video background with centered text "A website makes it real" and CTA button
- ![Hero Reference 2](inspo/1.%20hero%202.png) - Video carousel transition with bottom thumbnail strip
- ![Hero Reference 3](inspo/1.%20hero%203.png) - Another video carousel state showing different project
- ![Hero Reference 4](inspo/1.%20hero%204.png) - Video carousel with thumbnail carousel synced movement

### Stats Section (replaces "Join entrepreneurs")

- ![Stats Reference](inspo/2.%20join%20entreprenuers%20section.png) - Large animated counters: "14M+", "$36B+", "200+" with labels below. **Adapt for:** Years Experience, Projects Completed, Technologies

### Development Process Section (replaces "Grow your business")

- ![Process Reference](inspo/3.%20grow%20your%20business%20section.png) - Horizontal tabs/carousel with category cards. **Adapt for:** Discovery → Design → Develop → Deploy steps

### Project Deliverables Section (replaces "Everything you need")

- ![Deliverables Reference](inspo/4.%20everything%20you%20need%20in%20one%20platform%20section.png) - Card grid with icon, title, description per card. Hover effects with arrows

### AI Showcase Section (replaces "Getting started with AI")

- ![AI Reference](inspo/5.%20getting%20started%20with%20AI.png) - Two-card layout with images/videos. **Adapt for:** Productivity stats on left, AI tools grid on right

### Domain/CTA Section

- ![Domain Reference](inspo/6.%20find%20perfect%20domain%20section.png) - Dark section with search bar and user avatars. **Adapt for:** Contact CTA or call-to-action section

### Interactive Showcase

- ![Interactive Reference](inspo/7.%20interactive%20showcase.png) - Floating cards with 3D perspective, mouse-responsive parallax movement. Mix of website screenshots

### Footer

- ![Footer Reference](inspo/8.%20footer.png) - Multi-column footer with logo, navigation links, social icons

---

## Phase 1: Database Schema Updates ✅

### 1.1 Site Settings Table - Add Columns ✅

| Column                      | Type    | Default                    | Description                                  |
| --------------------------- | ------- | -------------------------- | -------------------------------------------- |
| `hero_animation_type`       | TEXT    | 'fade_up'                  | Options: fade_up, typewriter, slide_in       |
| `hero_intro_duration`       | INTEGER | 5000                       | Milliseconds for intro display               |
| `hero_video_duration`       | INTEGER | 5000                       | Milliseconds per video in carousel           |
| `profile_picture_locations` | TEXT[]  | {nav,about,footer,contact} | Where profile picture appears                |
| `stats_display_mode`        | TEXT    | 'hybrid'                   | Options: counters, icons, categories, hybrid |
| `stats_counters_enabled`    | BOOLEAN | true                       | Show/hide stat counters                      |
| `stats_icons_enabled`       | BOOLEAN | true                       | Show/hide tech icons                         |

### 1.2 Site Settings Table - Remove Columns ✅

- Drop `active_layout` column

### 1.3 Projects Table - Add Columns ✅

| Column                  | Type    | Default      | Description                             |
| ----------------------- | ------- | ------------ | --------------------------------------- |
| `video_preview_start`   | INTEGER | 0            | Start time in seconds for 5-sec preview |
| `video_preview_end`     | INTEGER | 5            | End time in seconds for preview         |
| `button_text`           | TEXT    | NULL         | Custom button text                      |
| `button_text_mode`      | TEXT    | 'predefined' | Options: predefined, custom, category   |
| `project_category`      | TEXT    | NULL         | Category for category-based button text |
| `show_in_hero_carousel` | BOOLEAN | false        | Show in hero video carousel             |
| `hero_display_order`    | INTEGER | 0            | Order in hero carousel                  |

### 1.4 New Table: `color_palettes` ✅

| Column         | Type        | Description                       |
| -------------- | ----------- | --------------------------------- |
| `id`           | UUID        | Primary key                       |
| `name`         | TEXT        | Unique identifier                 |
| `display_name` | TEXT        | Human-readable name               |
| `description`  | TEXT        | Optional description              |
| `is_system`    | BOOLEAN     | System palettes cannot be deleted |
| `is_active`    | BOOLEAN     | Whether palette is available      |
| `created_at`   | TIMESTAMPTZ | Creation timestamp                |
| `updated_at`   | TIMESTAMPTZ | Update timestamp                  |

### 1.5 New Table: `color_combinations` ✅

| Column                 | Type        | Description                     |
| ---------------------- | ----------- | ------------------------------- |
| `id`                   | UUID        | Primary key                     |
| `palette_id`           | UUID        | Foreign key to color_palettes   |
| `name`                 | TEXT        | Combination name                |
| `is_default`           | BOOLEAN     | Default combination for palette |
| `primary_color`        | TEXT        | Hex value                       |
| `secondary_color`      | TEXT        | Hex value                       |
| `accent_color`         | TEXT        | Hex value                       |
| `background_dark`      | TEXT        | Dark mode background            |
| `background_light`     | TEXT        | Light mode background           |
| `surface_dark`         | TEXT        | Dark mode surface               |
| `surface_light`        | TEXT        | Light mode surface              |
| `text_primary_dark`    | TEXT        | Dark mode primary text          |
| `text_primary_light`   | TEXT        | Light mode primary text         |
| `text_secondary_dark`  | TEXT        | Dark mode secondary text        |
| `text_secondary_light` | TEXT        | Light mode secondary text       |
| `border_dark`          | TEXT        | Dark mode border                |
| `border_light`         | TEXT        | Light mode border               |
| `display_order`        | INTEGER     | Display order                   |
| `created_at`           | TIMESTAMPTZ | Creation timestamp              |
| `updated_at`           | TIMESTAMPTZ | Update timestamp                |

### 1.6 New Table: `button_text_presets` ✅

| Column          | Type    | Description                  |
| --------------- | ------- | ---------------------------- |
| `id`            | UUID    | Primary key                  |
| `text`          | TEXT    | Button text value            |
| `category`      | TEXT    | Optional associated category |
| `is_active`     | BOOLEAN | Whether preset is active     |
| `display_order` | INTEGER | Display order                |

### 1.7 New Table: `project_categories` ✅

| Column                | Type    | Description                      |
| --------------------- | ------- | -------------------------------- |
| `id`                  | UUID    | Primary key                      |
| `name`                | TEXT    | Unique identifier                |
| `display_name`        | TEXT    | Human-readable name              |
| `default_button_text` | TEXT    | Default button text for category |
| `display_order`       | INTEGER | Display order                    |

### 1.8 New Table: `stats_counters` ✅

| Column          | Type    | Description              |
| --------------- | ------- | ------------------------ |
| `id`            | UUID    | Primary key              |
| `label`         | TEXT    | Counter label            |
| `value`         | TEXT    | Counter value            |
| `icon`          | TEXT    | Optional icon identifier |
| `is_visible`    | BOOLEAN | Visibility toggle        |
| `display_order` | INTEGER | Display order            |

### 1.9 New Table: `development_process_steps` ✅

| Column          | Type    | Description       |
| --------------- | ------- | ----------------- |
| `id`            | UUID    | Primary key       |
| `title`         | TEXT    | Step title        |
| `description`   | TEXT    | Step description  |
| `icon`          | TEXT    | Optional icon     |
| `display_order` | INTEGER | Display order     |
| `is_visible`    | BOOLEAN | Visibility toggle |

### 1.10 New Table: `project_deliverables` ✅

| Column          | Type    | Description             |
| --------------- | ------- | ----------------------- |
| `id`            | UUID    | Primary key             |
| `title`         | TEXT    | Deliverable title       |
| `description`   | TEXT    | Deliverable description |
| `icon`          | TEXT    | Optional icon           |
| `display_order` | INTEGER | Display order           |
| `is_visible`    | BOOLEAN | Visibility toggle       |

### 1.11 New Table: `ai_tools` ✅

| Column          | Type    | Description          |
| --------------- | ------- | -------------------- |
| `id`            | UUID    | Primary key          |
| `name`          | TEXT    | Tool name            |
| `description`   | TEXT    | Optional description |
| `icon_url`      | TEXT    | Tool logo URL        |
| `website_url`   | TEXT    | Tool website         |
| `display_order` | INTEGER | Display order        |
| `is_visible`    | BOOLEAN | Visibility toggle    |

### 1.12 New Table: `ai_productivity_stats` ✅

| Column          | Type    | Description          |
| --------------- | ------- | -------------------- |
| `id`            | UUID    | Primary key          |
| `label`         | TEXT    | Stat label           |
| `value`         | TEXT    | Stat value           |
| `description`   | TEXT    | Optional description |
| `display_order` | INTEGER | Display order        |
| `is_visible`    | BOOLEAN | Visibility toggle    |

### 1.13 Seed Data ✅

#### System Color Palettes

- Migrate existing 7 palettes as system palettes
- Add 2-3 color combinations per palette with different two-color schemes

#### Button Text Presets

- "Explore", "Be amazed", "What's this!?", "Discover", "See more", "View project", "Check it out", "Dive in"

#### Project Categories

- Web Application, Automation, Bot, Tool, API, Full Stack
- Each with default button text

#### Development Process Steps

- Discovery: "Understanding your needs and goals"
- Design: "Creating intuitive user experiences"
- Develop: "Building robust, scalable solutions"
- Deploy: "Launching and maintaining your project"

#### Project Deliverables

- Clean, maintainable code
- Comprehensive documentation
- Deployment & hosting setup
- Ongoing support & maintenance

#### AI Tools

- Claude, GitHub Copilot, ChatGPT, Cursor

#### AI Productivity Stats

- "3x Faster Development"
- "50% Less Bugs"
- "24/7 AI Assistance"

### 1.14 RLS Policies ✅

- Public read for visible items in all new tables
- Admin write access for all new tables

---

## Phase 2: Hero Section Redesign

### 2.1 Hero Intro State (First 5 seconds)

#### Left Half Content

- Text: "Hi! I'm Zeddrix Fabian, a full-stack web developer."
- Quote: "The key to efficiency is to work smart, not hard."
- Each element has its own animation with staggered delays

#### Right Half Content

- Profile picture (medium-sized, head to waist)

#### Animation System

- Three animation types selectable in admin:
  - `fade_up`: Elements fade in while moving upward (DEFAULT)
  - `typewriter`: Text types out character by character
  - `slide_in`: Elements slide in from different directions
- Animated background matching current theme

### 2.2 Hero Video Carousel State (After intro)

#### Main Video Display

- Full-width video background
- Smooth transition from intro state
- Play only the selected 5-second segment (video_preview_start to video_preview_end)
- Loop within the segment
- Muted autoplay
- Auto-advance to next video after configured duration

#### Overlay Content

- Project title (replaces "A website makes it real")
- Dynamic CTA button with configurable text per project
- Gradient overlay for text readability

#### Bottom Thumbnail Carousel

- Horizontal scrollable thumbnail strip
- Syncs with main video transitions (moves left to right on video change)
- Highlight active video thumbnail
- Click to navigate to specific video
- Auto-scroll to keep active thumbnail visible

#### Button Behavior

- Clicking button redirects to project detail page
- Project detail page shows full video (not just 5-second preview)

### 2.3 Video Timeline Scrubber (Admin Component)

#### Features

- Video player with custom controls
- Visual timeline showing full video duration
- Draggable start/end markers for 5-second segment selection
- Preview playback of selected segment
- Display current selection times
- Thumbnail strip along timeline
- Snap-to-second functionality
- Validation to ensure exactly 5-second segment

---

## Phase 3: Theme System Overhaul

### 3.1 Two-Color Combinations Per Palette

#### Requirements

- Each palette has MANY fixed color combination options
- Admin can customize existing combinations
- Admin can add new combinations to any palette
- Each combination defines primary + secondary + accent colors
- Each combination has dark and light mode variants

#### Color Combination Structure

- Primary color
- Secondary color
- Accent color
- Background (dark/light)
- Surface (dark/light)
- Text primary (dark/light)
- Text secondary (dark/light)
- Border (dark/light)

### 3.2 Dynamic CSS Variable Injection

#### Implementation

- Remove hardcoded palette CSS from app.css
- Create utility to dynamically inject CSS variables
- Apply variables on theme/palette/combination change
- Support real-time switching without page reload

### 3.3 Remove Layout System

#### Files to Delete

- `src/lib/stores/layout.ts`
- `src/lib/components/layouts/LayoutWrapper.svelte`
- `src/lib/components/layouts/SinglePageLayout.svelte`
- `src/lib/components/layouts/CaseStudyLayout.svelte`
- `src/lib/components/layouts/BentoGridLayout.svelte`
- `src/lib/components/admin/LayoutSelector.svelte`

#### Cleanup

- Remove all layoutStore imports and usages
- Remove layout-related CSS classes
- Update main page to single unified layout

---

## Phase 4: New Content Sections

### 4.1 Stats & Skills Section (Hybrid - Default)

#### Stats Counters

- Animated counting up animation on scroll
- Configurable via admin (label, value, icon)
- Responsive grid layout

#### Tech Stack Grid

- Grid of technology icons with hover effects
- Show proficiency level on hover
- Group by category option
- Pull from existing skills table

#### Display Mode Options (Admin Selectable)

- Counters Only
- Icons Only
- Categories
- Hybrid (DEFAULT) - Counters on top, tech icons below

### 4.2 Development Process Section

#### Layout

- Horizontal timeline/steps on desktop
- Vertical timeline on mobile
- Four steps: Discovery → Design → Develop → Deploy

#### Features

- Icon for each step
- Description text on hover/click
- Animated connectors between steps
- Scroll-triggered animations

### 4.3 Project Deliverables Section

#### Layout

- Card-based grid similar to Squarespace "Everything you need"
- Responsive: 1 col mobile, 2 col tablet, 4 col desktop

#### Card Content

- Icon
- Title
- Description
- Hover effects with subtle animations

### 4.4 AI Showcase Section

#### Layout

- Two-column layout

#### Left Column: Productivity Stats

- Large animated stat displays
- "3x Faster Development", "50% Less Bugs", etc.
- Counting animation on scroll into view

#### Right Column: AI Tools Grid

- Grid of AI tool cards
- Logo, name, brief description
- Link to tool website
- Hover animations

### 4.5 Interactive Project Showcase

#### Features

- Floating cards effect (mouse-responsive)
- Mix of project screenshots and tech logos
- Parallax movement based on cursor position
- 3D perspective transform
- Performance optimized (throttled mouse events)
- Fallback for mobile (touch-based or static)

### 4.6 Profile Picture Placement

#### Configurable Locations (All enabled by default)

- Navigation header (small circular)
- About section
- Footer
- Contact section

#### Component

- Reusable ProfilePicture component
- Props: size (sm, md, lg, xl), shape (circle, rounded)
- Lazy loading with blur placeholder

### 4.7 Main Page Section Order

1. Navigation
2. Hero (intro + video carousel)
3. Stats & Skills (hybrid)
4. Development Process
5. Project Deliverables
6. AI Showcase
7. Interactive Showcase
8. Contact Section
9. Footer

---

## Phase 5: Admin Panel Updates

### 5.1 Hero Settings Page

#### Fields

- Animation type selector (Fade Up, Typewriter, Slide In) with live preview
- Intro duration slider (3-10 seconds)
- Video carousel duration slider (3-10 seconds per video)

### 5.2 Profile Display Settings Page

#### Fields

- Checkbox group for profile picture locations:
  - Navigation header
  - About section
  - Footer
  - Contact section
- All checked by default
- Live preview showing where picture will appear

### 5.3 Stats Section Settings Page

#### Fields

- Display mode selector (Counters Only, Icons Only, Categories, Hybrid)
- Toggle for counters visibility
- Toggle for tech icons visibility
- CRUD for stats counters with drag-and-drop reordering

### 5.4 Color Palette Management

#### Palette List Page

- List all palettes (system + custom)
- Indicate active palette
- Set active palette
- Create new custom palette
- Edit custom palettes (system palettes read-only for core properties)
- Delete custom palettes

#### Palette Detail Page

- List color combinations for palette
- Add new combination
- Edit/delete combinations
- Set default combination
- Color pickers for each color field
- Live preview panel with dark/light mode toggle

#### Components

- ColorPicker: hex, RGB, HSL input with visual swatch
- PalettePreview: live preview of UI elements with colors applied

### 5.5 Button Text Management Page

#### Presets Section

- List predefined button text options
- Add/edit/delete presets
- Reorder presets

#### Categories Section

- List project categories
- Set default button text per category
- Add/edit/delete categories

### 5.6 Content Management Pages

#### Development Process Page

- CRUD for process steps
- Edit title, description, icon
- Reorder steps
- Toggle visibility

#### Project Deliverables Page

- CRUD for deliverables
- Edit title, description, icon
- Reorder items
- Toggle visibility

#### AI Showcase Page

- Two tabs: Tools and Stats
- Tools: CRUD with logo upload, website URLs
- Stats: CRUD for productivity stats

### 5.7 Project Form Updates

#### Hero Carousel Section

- Checkbox: "Show in hero carousel"
- Hero display order input
- Video timeline scrubber (visible when demo video uploaded)

#### Button Text Section

- Radio group for button text mode:
  - Predefined: Dropdown of preset options
  - Custom: Text input field
  - Category-based: Category selector
- Preview of button text

#### Project Category

- Category selector dropdown
- Option to create new category inline

### 5.8 Admin Navigation Updates

#### Settings Section Links

- Hero Settings
- Profile Display
- Stats Section
- Color Palettes
- Button Text

#### New Content Section

- Development Process
- Deliverables
- AI Showcase

### 5.9 Remove Layout Selector

- Delete LayoutSelector component
- Remove from settings pages

---

## Phase 6: Type & Schema Updates

### 6.1 Database Types

#### Add Types

- ColorPalette
- ColorCombination
- ButtonTextPreset
- ProjectCategory
- StatsCounter
- DevelopmentProcessStep
- ProjectDeliverable
- AITool
- AIProductivityStat

#### Update Types

- SiteSettings: Add hero config, profile picture locations, stats config
- Project: Add video preview fields, button text fields, hero carousel fields

#### Remove Types

- LayoutType enum and related types

### 6.2 Validation Schemas

#### Project Schema Updates

- Add video_preview_start, video_preview_end validation
- Validate end - start = 5 seconds
- Add button_text, button_text_mode validation
- Add project_category validation
- Add show_in_hero_carousel, hero_display_order validation

#### New Schemas

- Color palette creation/editing validation
- Content sections validation (stats, process steps, deliverables, AI tools/stats)

---

## Phase 7: Server Data Functions

### 7.1 New Functions

- `getColorPalettes()` - All active palettes
- `getColorCombinations(paletteId)` - Combinations for palette
- `getStatsCounters()` - Visible counters ordered
- `getDevelopmentProcessSteps()` - Visible steps ordered
- `getProjectDeliverables()` - Visible deliverables ordered
- `getAITools()` - Visible tools ordered
- `getAIProductivityStats()` - Visible stats ordered
- `getButtonTextPresets()` - Active presets ordered
- `getProjectCategories()` - All categories ordered
- `getHeroCarouselProjects()` - Projects with show_in_hero_carousel=true

### 7.2 Updated Functions

- `getSiteSettings()` - Include new fields
- `getHomePageData()` - Include all new section data
- Project queries - Include video preview and button text fields

---

## Files Summary

### New Files

#### Database

- `scripts/db/migrations/004_ui_overhaul.sql`

#### Stores

- `src/lib/stores/colorCombination.ts`

#### Utilities

- `src/lib/utils/animations.ts`
- `src/lib/utils/cssVariables.ts`
- `src/lib/actions/heroAnimations.ts`

#### Hero Components

- `src/lib/components/hero/VideoCarousel.svelte`
- `src/lib/components/hero/CarouselThumbnails.svelte`
- `src/lib/components/hero/HeroOverlay.svelte`

#### Section Components

- `src/lib/components/sections/StatsSection.svelte`
- `src/lib/components/sections/TechStackGrid.svelte`
- `src/lib/components/sections/StatsHybrid.svelte`
- `src/lib/components/sections/DevelopmentProcess.svelte`
- `src/lib/components/sections/ProjectDeliverables.svelte`
- `src/lib/components/sections/AIShowcase.svelte`
- `src/lib/components/sections/AIToolsGrid.svelte`
- `src/lib/components/sections/ProductivityStats.svelte`
- `src/lib/components/sections/InteractiveShowcase.svelte`

#### Shared Components

- `src/lib/components/shared/ProfilePicture.svelte`

#### Admin Components

- `src/lib/components/admin/VideoTimelineScrubber.svelte`
- `src/lib/components/admin/ColorPicker.svelte`
- `src/lib/components/admin/PalettePreview.svelte`

#### Admin Routes

- `src/routes/admin/settings/hero/+page.svelte`
- `src/routes/admin/settings/hero/+page.server.ts`
- `src/routes/admin/settings/profile-display/+page.svelte`
- `src/routes/admin/settings/profile-display/+page.server.ts`
- `src/routes/admin/settings/stats/+page.svelte`
- `src/routes/admin/settings/stats/+page.server.ts`
- `src/routes/admin/stats/+page.svelte`
- `src/routes/admin/stats/+page.server.ts`
- `src/routes/admin/settings/palettes/+page.svelte`
- `src/routes/admin/settings/palettes/+page.server.ts`
- `src/routes/admin/settings/palettes/[id]/+page.svelte`
- `src/routes/admin/settings/palettes/[id]/+page.server.ts`
- `src/routes/admin/settings/button-text/+page.svelte`
- `src/routes/admin/settings/button-text/+page.server.ts`
- `src/routes/admin/content/process/+page.svelte`
- `src/routes/admin/content/process/+page.server.ts`
- `src/routes/admin/content/deliverables/+page.svelte`
- `src/routes/admin/content/deliverables/+page.server.ts`
- `src/routes/admin/content/ai-showcase/+page.svelte`
- `src/routes/admin/content/ai-showcase/+page.server.ts`

#### Schemas

- `src/lib/schemas/colorPalette.ts`
- `src/lib/schemas/contentSections.ts`

### Files to Modify

- `src/lib/types/database.ts`
- `src/lib/stores/palette.ts`
- `src/lib/server/data.ts`
- `src/app.css`
- `src/routes/+layout.svelte`
- `src/routes/+page.svelte`
- `src/lib/components/shared/Hero.svelte`
- `src/lib/components/shared/Navigation.svelte`
- `src/lib/components/shared/Footer.svelte`
- `src/lib/components/shared/ProjectCard.svelte`
- `src/lib/components/admin/ProjectForm.svelte`
- `src/routes/admin/+layout.svelte`
- `src/routes/admin/settings/+page.svelte`
- `src/lib/schemas/project.ts`
- `src/routes/projects/[slug]/+page.svelte`

### Files to Delete

- `src/lib/stores/layout.ts`
- `src/lib/components/layouts/LayoutWrapper.svelte`
- `src/lib/components/layouts/SinglePageLayout.svelte`
- `src/lib/components/layouts/CaseStudyLayout.svelte`
- `src/lib/components/layouts/BentoGridLayout.svelte`
- `src/lib/components/admin/LayoutSelector.svelte`

---

## Implementation Order

1. Database schema updates (foundation)
2. Remove layout system (clean slate)
3. Theme system overhaul (styling foundation)
4. Hero section redesign (main visual)
5. New content sections (page structure)
6. Admin panel updates (management)
7. Project enhancements (refinements)
8. Testing & verification

---

## Technical Notes

- Svelte 4 syntax only (NOT Svelte 5)
- TypeScript strict mode - no `any` types
- Run `pnpm quality` before commits
- Mobile-first responsive design
- Accessibility: ARIA labels, keyboard navigation
- Performance: Lazy load videos, throttle mouse events
