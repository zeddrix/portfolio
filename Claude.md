# Claude AI Agent Guide - Zeddrix Portfolio

## Project Goal

Build a **Squarespace-quality portfolio website** using SvelteKit. We extract design tokens (colors, spacing, typography, animations) and visual references from Squarespace, then build clean, maintainable components that achieve identical visual results.

**The Approach:**

- Extract design values via Python scraper → Get colors, spacing, typography, animation timings
- Take screenshots for visual reference → See what to build
- Build clean Svelte components from scratch → Match the quality, own the code
- **Result:** Visually identical to Squarespace, but with maintainable code you control

## Tech Stack

**Portfolio:** SvelteKit + Svelte 4 + TypeScript + Tailwind CSS 4 + pnpm
**Scraper:** Python 3 + Playwright + Beautiful Soup + ColorThief

## Project Structure

```
src/
├── lib/
│   ├── components/  # Svelte components
│   └── styles/      # Design tokens
└── routes/          # Pages

scraper/
├── output/          # Extracted JSON tokens
└── screenshots/     # Visual references
```

## Current Status

✅ **Phase 1 Complete:** Environment setup done
🚧 **Phase 2 Next:** Build scraper, extract design tokens, start building components

## Key Commands

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Production build

# Code Quality
pnpm format                 # Format with Prettier
pnpm lint                   # Lint with ESLint
pnpm check                  # TypeScript type checking

# Scraper
cd scraper
source venv/bin/activate
python scraper_script.py
```

## Core Workflow

### Phase 2: Extract Design Tokens

1. Build Python scraper with Playwright
2. Navigate to Squarespace.com
3. Extract: colors, typography, spacing, borders, shadows, animations
4. Take screenshots of components
5. Save tokens to JSON in `scraper/output/`

### Phase 3: Create Design System

1. Create token modules in `src/lib/styles/` (colors.ts, typography.ts, etc.)
2. Extend Tailwind config with extracted values
3. Set up CSS custom properties

### Phase 4: Build Components

For each component (using screenshots + extracted tokens):

1. Build in `src/lib/components/`
2. Create demo route in `src/routes/components/` for testing
3. Apply design tokens
4. Test responsiveness
5. Run quality checks (format, lint, type-check)

### Phase 5: Build Portfolio Pages

Compose components into pages: Home, About, Projects, Contact

## What the Scraper Extracts

```python
# CSS values only, not code:
colors = {"primary": "#0073E6", "secondary": "#00D4AA"}
typography = {"h1": {"size": "48px", "weight": 700}}
spacing = {"sm": "8px", "md": "16px", "lg": "32px"}
animations = {"duration": "300ms", "easing": "cubic-bezier(...)"}
borders = {"radius": "8px"}
shadows = {"card": "0 2px 8px rgba(0,0,0,0.1)"}
```

## Component Priority

**P1 Foundation:** Button, Card, Container, Grid
**P2 Navigation:** Header, Nav, MobileMenu
**P3 Content:** Hero, Section, Feature, Carousel
**P4 Forms:** Input, Textarea, Select, Checkbox, Form
**P5 Feedback:** Modal, Toast, Loading

## Code Standards

**Required:**

- TypeScript strict mode, no implicit `any`
- All component props typed
- Prettier formatted, ESLint clean
- Svelte 4 syntax only (NOT Svelte 5)
- Read files before editing
- Test in demo routes before integrating

**Styling:**

- Tailwind CSS classes primarily
- Design tokens in `src/lib/styles/`
- Mobile-first responsive design

## Success = Squarespace Quality

**Visually:** Identical look - same colors, spacing, animations, polish
**Technically:** Clean code, fully typed, maintainable, no errors
**Legally:** 100% your code, no copyright issues

## Quick Start for New Session

1. Read this file
2. Check [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) for detailed steps
3. Review recent commits
4. Run `pnpm check` to verify
5. Continue with current phase

---

**Portfolio Owner:** Zeddrix
**Main Branch:** `main`
**Commit:** After each phase completion
