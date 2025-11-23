# Claude AI Agent Guide - Zeddrix Portfolio

## Project Summary

This is a **personal portfolio website** built with SvelteKit, inspired by the UI/UX quality of Squarespace.com. We extract design inspiration and tokens (not actual code) from Squarespace to inform our own custom-built components.

## Critical Understanding

**We are NOT cloning Squarespace.** We are:

- Extracting design values (colors, spacing, timing) for inspiration
- Taking screenshots for visual reference
- Building our own clean, maintainable Svelte components from scratch
- Achieving similar quality level with our own implementation

## Tech Stack

### Portfolio Website

- **Framework**: SvelteKit with Svelte 4 (NOT Svelte 5)
- **Language**: TypeScript (strict mode)
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS 4 with custom design tokens
- **Code Quality**: Prettier, ESLint

### Design Analysis Tool (Separate)

- **Language**: Python 3.x
- **Automation**: Playwright for Python
- **Parsing**: Beautiful Soup 4
- **Output**: JSON files → consumed by TypeScript

## Project Structure

```
zeddrix-portfolio/
├── src/
│   ├── lib/
│   │   ├── components/     # Reusable Svelte components
│   │   └── styles/         # Design tokens (colors, typography, spacing)
│   ├── routes/             # SvelteKit pages
│   └── app.css             # Global styles
├── scraper/                # Python scripts for design analysis
│   ├── output/             # Extracted JSON design tokens
│   ├── screenshots/        # Reference images
│   └── requirements.txt    # Python dependencies
├── static/                 # Static assets
├── IMPLEMENTATION_PLAN.md  # Detailed phase-by-phase plan
└── package.json
```

## Current Status

**Phase 1: COMPLETE** ✅

- SvelteKit project initialized
- TypeScript, Prettier, ESLint configured
- Tailwind CSS 4 integrated
- Playwright installed (Python environment set up)
- Directory structure created

**Phase 2: NOT STARTED**

- No scraping scripts written yet
- No design tokens extracted yet
- No components built yet

## Key Commands

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Production build
pnpm preview                # Preview production build

# Code Quality
pnpm format                 # Format with Prettier
pnpm format:check           # Check formatting
pnpm lint                   # Lint with ESLint
pnpm lint:fix               # Fix linting issues
pnpm check                  # TypeScript + Svelte type checking

# Scraper (Python)
cd scraper
source venv/bin/activate    # Activate Python virtual environment
python scraper_script.py    # Run scraper (when created)
```

## Important Files

- [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) - Complete phase-by-phase implementation guide
- [package.json](package.json) - Dependencies and scripts
- [tailwind.config.js](tailwind.config.js) - Tailwind configuration
- [tsconfig.json](tsconfig.json) - TypeScript configuration
- [scraper/requirements.txt](scraper/requirements.txt) - Python dependencies

## Design Philosophy

### Component Development

1. **Read before writing** - Always read existing files before modifying
2. **Prefer editing over creating** - Extend existing components when possible
3. **TypeScript interfaces required** - All component props must be typed
4. **Svelte 4 syntax only** - Do NOT use Svelte 5 features
5. **Test in demo routes** - Create `/routes/components/*` pages to test components in isolation

### Code Quality Standards

- All code must pass Prettier formatting
- All code must pass ESLint validation
- All TypeScript must compile without errors (strict mode)
- No implicit `any` types allowed
- Keep components simple and focused

### Styling Approach

- Use Tailwind CSS classes primarily
- Define design tokens in `src/lib/styles/`
- Extend Tailwind theme in `tailwind.config.js`
- Use CSS custom properties for runtime dynamic values
- Follow mobile-first responsive design

## Implementation Workflow

When building new features, follow this order:

1. **Extract design tokens** (if needed via scraper)
2. **Create design token modules** in `src/lib/styles/`
3. **Update Tailwind config** with tokens
4. **Build components** in `src/lib/components/`
5. **Create demo routes** in `src/routes/components/` for testing
6. **Test responsiveness** at all breakpoints
7. **Run code quality checks** (format, lint, type-check)
8. **Integrate into portfolio pages**

## Scraper Usage (Phase 2)

When creating scraper scripts:

1. **Navigate to Squarespace.com** with Playwright
2. **Extract computed styles** - Not source code, just CSS values
3. **Save design tokens** to JSON in `scraper/output/`
4. **Take screenshots** for visual reference in `scraper/screenshots/`
5. **Document patterns** in markdown

Extract these types of values:

- Colors: Hex, RGB, HSL values
- Typography: Font families, sizes, weights, line heights
- Spacing: Padding, margin, gap values (build a scale)
- Borders: Radius values, widths
- Shadows: Box shadow definitions
- Animations: Transition durations, easing functions, keyframe specs

## Component Architecture

### Foundation Components (Priority 1)

- Button (variants: primary, secondary, outline, ghost)
- Card (with header, body, footer slots)
- Container (responsive max-widths)
- Grid (responsive columns)

### Navigation Components (Priority 2)

- Header (sticky, scroll behavior)
- Nav (desktop horizontal menu)
- MobileMenu (slide-in mobile navigation)

### Content Components (Priority 3)

- Hero (full-width sections with CTAs)
- Section (consistent vertical spacing)
- Feature (icon + title + description)
- Carousel (image slider with controls)

### Form Components (Priority 4)

- Input, Textarea, Select, Checkbox
- Form (wrapper with validation)

### Feedback Components (Priority 5)

- Modal (overlay with focus trap)
- Toast (notification system)
- Loading (spinner/indicator)

## Portfolio Pages

After components are built:

1. **Home** (`/`) - Hero, featured work, about preview
2. **About** (`/about`) - Introduction, skills, experience
3. **Projects** (`/projects`) - Project grid/list
4. **Contact** (`/contact`) - Contact form and info

## Git Workflow

- Main branch: `main`
- Currently on: `main`
- Commit after each major phase completion
- Use descriptive commit messages

## Anti-Patterns to Avoid

❌ **Don't** try to copy Squarespace's minified production code
❌ **Don't** use Svelte 5 syntax (runes, etc.)
❌ **Don't** create files without reading similar files first
❌ **Don't** skip TypeScript types
❌ **Don't** over-engineer simple solutions
❌ **Don't** add features not explicitly requested
❌ **Don't** commit without running format/lint checks

## Success Criteria

### Technical

- TypeScript compiles without errors
- ESLint passes with no warnings
- Prettier formatting consistent
- Build completes successfully

### Design

- Professional, polished UI
- Smooth animations
- Responsive across devices
- Consistent visual language

### Code Quality

- Components are reusable
- Code is readable and maintainable
- Proper separation of concerns
- Clear documentation

## Quick Start for New Claude Session

1. Read this file (Claude.md)
2. Check [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) for current phase
3. Review recent commits to understand progress
4. Check `package.json` for available scripts
5. Run `pnpm check` to verify everything compiles
6. Proceed with next phase tasks

## Contact & Portfolio Context

This portfolio is for **Zeddrix** - update content and personal information accordingly when implementing portfolio pages.
