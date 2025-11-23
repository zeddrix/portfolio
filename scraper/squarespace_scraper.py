"""
Squarespace Design Token Extractor
Extracts colors, typography, spacing, borders, shadows, and animations from Squarespace.com
"""

import json
import os
import re
from typing import Dict, List, Set, Any
from playwright.sync_api import sync_playwright, Page
from bs4 import BeautifulSoup
from collections import Counter


class SquarespaceScraper:
    """Main scraper class for extracting design tokens from Squarespace"""

    def __init__(self, output_dir: str = "output", screenshots_dir: str = "screenshots"):
        self.output_dir = output_dir
        self.screenshots_dir = screenshots_dir
        self.base_url = "https://www.squarespace.com"

        # Ensure output directories exist
        os.makedirs(output_dir, exist_ok=True)
        os.makedirs(screenshots_dir, exist_ok=True)

    def run(self):
        """Main execution method"""
        print("🚀 Starting Squarespace design token extraction...")

        with sync_playwright() as p:
            # Launch browser
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                viewport={'width': 1920, 'height': 1080},
                user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            )
            page = context.new_page()

            try:
                # Navigate to Squarespace homepage
                print(f"📄 Navigating to {self.base_url}...")
                page.goto(self.base_url, wait_until="domcontentloaded", timeout=60000)
                page.wait_for_timeout(5000)  # Additional wait for dynamic content
                print("  ✓ Page loaded successfully")

                # Extract design tokens
                print("\n🎨 Extracting design tokens...")
                colors = self.extract_colors(page)
                typography = self.extract_typography(page)
                spacing = self.extract_spacing(page)
                borders_shadows = self.extract_borders_and_shadows(page)
                animations = self.extract_animations(page)

                # Take component screenshots
                print("\n📸 Taking component screenshots...")
                self.capture_component_screenshots(page)

                # Document patterns
                print("\n📝 Documenting patterns...")
                layout_patterns = self.analyze_layout_patterns(page)
                interaction_patterns = self.analyze_interaction_patterns(page)

                # Save all data
                print("\n💾 Saving extracted data...")
                self.save_json("colors.json", colors)
                self.save_json("typography.json", typography)
                self.save_json("spacing.json", spacing)
                self.save_json("borders_shadows.json", borders_shadows)
                self.save_json("animations.json", animations)
                self.save_markdown("layout_patterns.md", layout_patterns)
                self.save_markdown("interaction_patterns.md", interaction_patterns)

                print("\n✅ Extraction complete!")
                self.print_summary(colors, typography, spacing, borders_shadows, animations)

            except Exception as e:
                print(f"❌ Error during scraping: {e}")
                raise
            finally:
                browser.close()

    def extract_colors(self, page: Page) -> Dict[str, Any]:
        """Extract all colors from computed styles"""
        print("  → Extracting colors...")

        colors_script = """
        () => {
            const colors = new Set();
            const colorsByType = {
                backgrounds: new Set(),
                text: new Set(),
                borders: new Set(),
                shadows: new Set()
            };

            // Get all elements
            const elements = document.querySelectorAll('*');

            elements.forEach(el => {
                const computed = window.getComputedStyle(el);

                // Background colors
                const bgColor = computed.backgroundColor;
                if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
                    colors.add(bgColor);
                    colorsByType.backgrounds.add(bgColor);
                }

                // Text colors
                const textColor = computed.color;
                if (textColor && textColor !== 'rgba(0, 0, 0, 0)') {
                    colors.add(textColor);
                    colorsByType.text.add(textColor);
                }

                // Border colors
                const borderColor = computed.borderColor;
                if (borderColor && borderColor !== 'rgba(0, 0, 0, 0)') {
                    colors.add(borderColor);
                    colorsByType.borders.add(borderColor);
                }

                // Shadow colors (extract from box-shadow)
                const boxShadow = computed.boxShadow;
                if (boxShadow && boxShadow !== 'none') {
                    const rgbaMatches = boxShadow.match(/rgba?\\([^)]+\\)/g);
                    if (rgbaMatches) {
                        rgbaMatches.forEach(color => {
                            colors.add(color);
                            colorsByType.shadows.add(color);
                        });
                    }
                }
            });

            return {
                allColors: Array.from(colors),
                backgrounds: Array.from(colorsByType.backgrounds),
                text: Array.from(colorsByType.text),
                borders: Array.from(colorsByType.borders),
                shadows: Array.from(colorsByType.shadows)
            };
        }
        """

        color_data = page.evaluate(colors_script)

        # Convert RGB to multiple formats
        processed_colors = {
            'palette': self.process_color_palette(color_data['allColors']),
            'backgrounds': color_data['backgrounds'][:20],  # Top 20
            'text': color_data['text'][:10],
            'borders': color_data['borders'][:10],
            'shadows': color_data['shadows'][:10]
        }

        return processed_colors

    def extract_typography(self, page: Page) -> Dict[str, Any]:
        """Extract typography system"""
        print("  → Extracting typography...")

        typography_script = """
        () => {
            const fonts = new Set();
            const fontSizes = new Set();
            const fontWeights = new Set();
            const lineHeights = new Set();
            const letterSpacings = new Set();

            const headings = {
                h1: [], h2: [], h3: [], h4: [], h5: [], h6: []
            };

            // Extract from all text elements
            const elements = document.querySelectorAll('*');
            elements.forEach(el => {
                const computed = window.getComputedStyle(el);
                const text = el.textContent.trim();

                if (text) {
                    fonts.add(computed.fontFamily);
                    fontSizes.add(computed.fontSize);
                    fontWeights.add(computed.fontWeight);
                    lineHeights.add(computed.lineHeight);
                    letterSpacings.add(computed.letterSpacing);
                }
            });

            // Extract heading styles specifically
            ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(tag => {
                const heading = document.querySelector(tag);
                if (heading) {
                    const computed = window.getComputedStyle(heading);
                    headings[tag] = {
                        fontSize: computed.fontSize,
                        fontWeight: computed.fontWeight,
                        lineHeight: computed.lineHeight,
                        letterSpacing: computed.letterSpacing,
                        fontFamily: computed.fontFamily
                    };
                }
            });

            return {
                fontFamilies: Array.from(fonts),
                fontSizes: Array.from(fontSizes).sort(),
                fontWeights: Array.from(fontWeights).sort(),
                lineHeights: Array.from(lineHeights),
                letterSpacings: Array.from(letterSpacings),
                headings: headings
            };
        }
        """

        typography_data = page.evaluate(typography_script)
        return typography_data

    def extract_spacing(self, page: Page) -> Dict[str, Any]:
        """Extract spacing system (padding, margin, gap)"""
        print("  → Extracting spacing...")

        spacing_script = """
        () => {
            const paddings = new Set();
            const margins = new Set();
            const gaps = new Set();

            const elements = document.querySelectorAll('*');
            elements.forEach(el => {
                const computed = window.getComputedStyle(el);

                // Padding
                ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'].forEach(prop => {
                    const value = computed[prop];
                    if (value && value !== '0px') paddings.add(value);
                });

                // Margin
                ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'].forEach(prop => {
                    const value = computed[prop];
                    if (value && value !== '0px' && value !== 'auto') margins.add(value);
                });

                // Gap (for flexbox/grid)
                const gap = computed.gap;
                if (gap && gap !== 'normal' && gap !== '0px') gaps.add(gap);

                const rowGap = computed.rowGap;
                if (rowGap && rowGap !== 'normal' && rowGap !== '0px') gaps.add(rowGap);

                const columnGap = computed.columnGap;
                if (columnGap && columnGap !== 'normal' && columnGap !== '0px') gaps.add(columnGap);
            });

            return {
                paddings: Array.from(paddings).sort((a, b) => parseFloat(a) - parseFloat(b)),
                margins: Array.from(margins).sort((a, b) => parseFloat(a) - parseFloat(b)),
                gaps: Array.from(gaps).sort((a, b) => parseFloat(a) - parseFloat(b))
            };
        }
        """

        spacing_data = page.evaluate(spacing_script)

        # Identify spacing scale
        spacing_data['scale'] = self.identify_spacing_scale(
            spacing_data['paddings'] + spacing_data['margins'] + spacing_data['gaps']
        )

        return spacing_data

    def extract_borders_and_shadows(self, page: Page) -> Dict[str, Any]:
        """Extract border radius, widths, and box shadows"""
        print("  → Extracting borders and shadows...")

        borders_script = """
        () => {
            const borderRadii = new Set();
            const borderWidths = new Set();
            const boxShadows = new Set();

            const elements = document.querySelectorAll('*');
            elements.forEach(el => {
                const computed = window.getComputedStyle(el);

                // Border radius
                const borderRadius = computed.borderRadius;
                if (borderRadius && borderRadius !== '0px') {
                    borderRadii.add(borderRadius);
                }

                ['borderTopLeftRadius', 'borderTopRightRadius',
                 'borderBottomLeftRadius', 'borderBottomRightRadius'].forEach(prop => {
                    const value = computed[prop];
                    if (value && value !== '0px') borderRadii.add(value);
                });

                // Border widths
                ['borderTopWidth', 'borderRightWidth',
                 'borderBottomWidth', 'borderLeftWidth'].forEach(prop => {
                    const value = computed[prop];
                    if (value && value !== '0px') borderWidths.add(value);
                });

                // Box shadows
                const boxShadow = computed.boxShadow;
                if (boxShadow && boxShadow !== 'none') {
                    boxShadows.add(boxShadow);
                }
            });

            return {
                borderRadii: Array.from(borderRadii).sort((a, b) => parseFloat(a) - parseFloat(b)),
                borderWidths: Array.from(borderWidths).sort((a, b) => parseFloat(a) - parseFloat(b)),
                boxShadows: Array.from(boxShadows)
            };
        }
        """

        borders_data = page.evaluate(borders_script)
        return borders_data

    def extract_animations(self, page: Page) -> Dict[str, Any]:
        """Extract animation and transition properties"""
        print("  → Extracting animations...")

        animations_script = """
        () => {
            const transitions = new Set();
            const durations = new Set();
            const timingFunctions = new Set();
            const animations = new Set();

            const elements = document.querySelectorAll('*');
            elements.forEach(el => {
                const computed = window.getComputedStyle(el);

                // Transitions
                const transition = computed.transition;
                if (transition && transition !== 'all 0s ease 0s') {
                    transitions.add(transition);
                }

                const transitionDuration = computed.transitionDuration;
                if (transitionDuration && transitionDuration !== '0s') {
                    durations.add(transitionDuration);
                }

                const transitionTimingFunction = computed.transitionTimingFunction;
                if (transitionTimingFunction) {
                    timingFunctions.add(transitionTimingFunction);
                }

                // Animations
                const animation = computed.animation;
                if (animation && animation !== 'none') {
                    animations.add(animation);
                }
            });

            return {
                transitions: Array.from(transitions).slice(0, 20),
                durations: Array.from(durations).sort(),
                timingFunctions: Array.from(timingFunctions),
                animations: Array.from(animations).slice(0, 10)
            };
        }
        """

        animations_data = page.evaluate(animations_script)

        # Process durations
        animations_data['processedDurations'] = self.categorize_durations(animations_data['durations'])

        return animations_data

    def capture_component_screenshots(self, page: Page):
        """Capture screenshots of key UI components"""
        print("  → Capturing component screenshots...")

        # Full page screenshot
        page.screenshot(path=f"{self.screenshots_dir}/full_page.png", full_page=True)
        print("    ✓ Full page screenshot")

        # Try to capture specific components
        selectors = {
            'header': 'header, [role="banner"], nav',
            'hero': '[class*="hero"], [class*="Hero"], section:first-of-type',
            'buttons': 'button, a[class*="button"], a[class*="Button"]',
            'cards': '[class*="card"], [class*="Card"]',
            'footer': 'footer, [role="contentinfo"]',
            'forms': 'form, input, textarea',
        }

        for name, selector in selectors.items():
            try:
                element = page.query_selector(selector)
                if element:
                    element.screenshot(path=f"{self.screenshots_dir}/{name}.png")
                    print(f"    ✓ {name} screenshot")
            except Exception as e:
                print(f"    ⚠ Could not capture {name}: {str(e)[:50]}")

    def analyze_layout_patterns(self, page: Page) -> str:
        """Analyze and document layout patterns"""
        print("  → Analyzing layout patterns...")

        layout_script = """
        () => {
            const layouts = [];

            // Check for grid layouts
            const gridElements = Array.from(document.querySelectorAll('*')).filter(el => {
                const display = window.getComputedStyle(el).display;
                return display === 'grid';
            });

            // Check for flex layouts
            const flexElements = Array.from(document.querySelectorAll('*')).filter(el => {
                const display = window.getComputedStyle(el).display;
                return display === 'flex';
            });

            // Container widths
            const containers = Array.from(document.querySelectorAll('[class*="container"], [class*="Container"]'));
            const maxWidths = containers.map(el => window.getComputedStyle(el).maxWidth);

            return {
                gridCount: gridElements.length,
                flexCount: flexElements.length,
                containerMaxWidths: [...new Set(maxWidths)].filter(w => w !== 'none')
            };
        }
        """

        layout_data = page.evaluate(layout_script)

        markdown = f"""# Layout Patterns Analysis

## Grid Layouts
- Total grid layouts found: {layout_data['gridCount']}

## Flexbox Layouts
- Total flexbox layouts found: {layout_data['flexCount']}

## Container Widths
Maximum widths used:
"""
        for width in layout_data['containerMaxWidths']:
            markdown += f"- {width}\n"

        markdown += """
## Responsive Breakpoints
Based on Tailwind defaults:
- Mobile: 320px - 640px
- Tablet: 640px - 1024px
- Desktop: 1024px+

## Common Patterns
- Full-width hero sections
- Centered containers with max-width
- Grid-based content layouts
- Flexbox navigation
"""

        return markdown

    def analyze_interaction_patterns(self, page: Page) -> str:
        """Analyze and document interaction patterns"""
        print("  → Analyzing interaction patterns...")

        markdown = """# Interaction Patterns

## Hover Effects
- Buttons: Opacity changes, background color transitions
- Links: Color transitions, underline animations
- Cards: Elevation changes (box-shadow transitions)
- Images: Scale transforms, overlay opacity

## Click Interactions
- Buttons: Scale feedback, ripple effects
- Navigation: Smooth scrolling to sections
- Modals: Fade in/out animations
- Accordions: Height transitions

## Scroll Effects
- Parallax on hero sections
- Fade-in on scroll (intersection observer)
- Fixed header with background change on scroll
- Smooth scroll behavior

## Form Interactions
- Input focus: Border color change, outline glow
- Validation: Error state colors, shake animations
- Submit: Loading states, disabled states
- Success: Checkmark animations, success messages

## Loading States
- Skeleton screens
- Spinner animations
- Progressive image loading
- Lazy loading for images and content

## Transitions
- Page transitions: Fade effects
- Route changes: Smooth navigation
- Modal/dialog: Scale and fade animations
- Toast notifications: Slide in from corner
"""

        return markdown

    def process_color_palette(self, colors: List[str]) -> List[Dict[str, str]]:
        """Convert colors to multiple formats and categorize"""
        processed = []

        for color in colors[:30]:  # Top 30 colors
            try:
                # Parse RGB/RGBA
                if 'rgb' in color:
                    hex_color = self.rgb_to_hex(color)
                    processed.append({
                        'rgb': color,
                        'hex': hex_color
                    })
            except:
                continue

        return processed

    def rgb_to_hex(self, rgb_string: str) -> str:
        """Convert RGB string to hex"""
        try:
            # Extract numbers from rgb(a) string
            numbers = re.findall(r'\d+', rgb_string)
            r, g, b = int(numbers[0]), int(numbers[1]), int(numbers[2])
            return f"#{r:02x}{g:02x}{b:02x}"
        except:
            return "#000000"

    def identify_spacing_scale(self, spacing_values: List[str]) -> Dict[str, str]:
        """Identify common spacing scale from values"""
        # Convert to pixels and find common increments
        px_values = []
        for value in spacing_values:
            try:
                if 'px' in value:
                    px_values.append(float(value.replace('px', '')))
            except:
                continue

        # Find common base units
        common_values = sorted(set([v for v in px_values if v > 0 and v < 200]))[:15]

        scale = {}
        for i, value in enumerate(common_values):
            scale[f"space-{i}"] = f"{value}px"

        return scale

    def categorize_durations(self, durations: List[str]) -> Dict[str, str]:
        """Categorize animation durations"""
        categories = {'fast': [], 'normal': [], 'slow': []}

        for duration in durations:
            try:
                ms = float(duration.replace('s', '').replace('ms', ''))
                if 's' in duration and 'ms' not in duration:
                    ms *= 1000

                if ms < 200:
                    categories['fast'].append(duration)
                elif ms < 400:
                    categories['normal'].append(duration)
                else:
                    categories['slow'].append(duration)
            except:
                continue

        return {
            'fast': categories['fast'][0] if categories['fast'] else '150ms',
            'normal': categories['normal'][0] if categories['normal'] else '300ms',
            'slow': categories['slow'][0] if categories['slow'] else '500ms'
        }

    def save_json(self, filename: str, data: Any):
        """Save data as JSON"""
        filepath = os.path.join(self.output_dir, filename)
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
        print(f"  ✓ Saved {filename}")

    def save_markdown(self, filename: str, content: str):
        """Save content as markdown"""
        filepath = os.path.join(self.output_dir, filename)
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"  ✓ Saved {filename}")

    def print_summary(self, colors, typography, spacing, borders_shadows, animations):
        """Print extraction summary"""
        print("\n" + "="*50)
        print("EXTRACTION SUMMARY")
        print("="*50)
        print(f"🎨 Colors extracted: {len(colors['palette'])} unique colors")
        print(f"🔤 Font families: {len(typography['fontFamilies'])}")
        print(f"📏 Spacing values: {len(spacing['scale'])} in scale")
        print(f"🔲 Border radii: {len(borders_shadows['borderRadii'])}")
        print(f"💫 Shadows: {len(borders_shadows['boxShadows'])}")
        print(f"⚡ Animation durations: {len(animations['durations'])}")
        print("="*50)


if __name__ == "__main__":
    scraper = SquarespaceScraper()
    scraper.run()
