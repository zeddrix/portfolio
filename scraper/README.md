# Design Analysis Scraper

This directory contains Python scripts using Playwright for analyzing and extracting design patterns from Squarespace.com.

## Tech Stack

- **Python 3.13+**
- **Playwright** - Browser automation for navigating and analyzing pages
- **Beautiful Soup 4** - HTML parsing and data extraction
- **ColorThief** - Dominant color extraction from images
- **Pillow** - Image processing and analysis

## Setup

### First Time Setup

1. Ensure Python 3.x is installed:

   ```bash
   python3 --version
   ```

2. Create and activate virtual environment:

   ```bash
   cd scraper
   python3 -m venv venv
   source venv/bin/activate  # On macOS/Linux
   # or on Windows: venv\Scripts\activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Install Playwright browsers:

   ```bash
   playwright install chromium
   ```

### Running Scripts

Always activate the virtual environment first:

```bash
cd scraper
source venv/bin/activate
python script_name.py
```

## Directory Structure

- `venv/` - Python virtual environment (not committed to git)
- `output/` - JSON files containing extracted design tokens
- `screenshots/` - Reference screenshots of UI components and patterns
- `requirements.txt` - Python package dependencies

## What Will Be Extracted (Phase 2)

Scripts will be added in Phase 2 of the implementation plan to extract:

- **Color palettes** - Primary, secondary, accent colors
- **Typography tokens** - Font families, sizes, weights, line heights
- **Spacing systems** - Margin, padding, gap values
- **Border and shadow definitions** - Border radius, box shadows
- **Animation patterns** - Transition timings, easing functions
- **Component patterns** - Screenshots and specs for common UI components
- **Layout patterns** - Grid systems, container widths, breakpoints
- **Interaction patterns** - Hover states, scroll effects, micro-interactions

## Output Format

All extracted data will be saved as JSON files in the `output/` directory. These JSON files will be consumed by the TypeScript/SvelteKit application to create design tokens and Tailwind configuration.
