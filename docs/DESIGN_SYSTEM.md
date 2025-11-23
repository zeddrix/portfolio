# Design System Documentation

## Overview

This design system provides a comprehensive set of design tokens, components, and guidelines for building a Squarespace-quality portfolio website. All design values are defined as TypeScript constants and integrated with Tailwind CSS for consistent, maintainable styling.

## Quick Reference

### File Structure

```
src/lib/styles/
├── colors.ts       # Color palette and semantic colors
├── typography.ts   # Font families, sizes, weights, line heights
├── spacing.ts      # Spacing scale, container widths, breakpoints
├── animations.ts   # Durations, easings, transitions, keyframes
└── borders.ts      # Border radius, widths, shadows, focus rings
```

### Design Token Modules

All design tokens are exported as TypeScript constants with full type safety. Import them in your components:

```typescript
import { primary, neutral } from '$lib/styles/colors';
import { fontSizes, fontWeights } from '$lib/styles/typography';
import { spacing } from '$lib/styles/spacing';
```

---

## Color System

### Color Palette

The color system is organized into five categories:

#### 1. Primary Colors

**Purpose:** Brand identity, primary CTAs, interactive elements, links

- **primary-50 to primary-900:** Blue scale from lightest to darkest
- **Main brand color:** `primary-500` (#0ea5e9)
- **Hover state:** `primary-600` (#0284c7)

**Tailwind Usage:**

```html
<button class="bg-primary-500 hover:bg-primary-600">Click me</button>
```

#### 2. Neutral Colors

**Purpose:** UI elements, borders, backgrounds, text hierarchy

- **neutral-0:** Pure white (#ffffff) - used for clean backgrounds
- **neutral-50 to neutral-200:** Light grays for backgrounds and subtle borders
- **neutral-300 to neutral-500:** Mid-tone grays for disabled states and secondary text
- **neutral-600 to neutral-950:** Dark grays for text and strong borders

**Tailwind Usage:**

```html
<div class="bg-neutral-50 border border-neutral-200 text-neutral-900">Content</div>
```

#### 3. Semantic Colors

**Purpose:** Feedback states, alerts, validation

- **Success:** Green (#10b981) - success messages, confirmations
- **Error:** Red (#ef4444) - errors, validation failures
- **Warning:** Amber (#f59e0b) - warnings, cautions
- **Info:** Blue (#3b82f6) - informational messages

Each semantic color includes light and dark variants.

**Tailwind Usage:**

```html
<div class="bg-success-light text-success-dark border border-success">Success message</div>
```

#### 4. Background Colors

**Purpose:** Page and section backgrounds

- **bg-primary:** White backgrounds
- **bg-secondary:** Very light gray for subtle sections
- **bg-tertiary:** Light gray for distinct sections
- **bg-dark:** Near-black for dark sections

#### 5. Text Colors

**Purpose:** Typography with appropriate contrast ratios

- **text-primary:** Main body text (near-black)
- **text-secondary:** Secondary text (medium gray)
- **text-tertiary:** Tertiary text (light gray)
- **text-disabled:** Disabled state text
- **text-inverse:** White text for dark backgrounds
- **text-link/text-link-hover:** Link colors

---

## Typography System

### Font Families

**Sans Serif (Primary):** Inter with system font fallbacks

- Used for headings, body text, and UI elements
- Clean, modern, highly readable

**Monospace:** JetBrains Mono with code font fallbacks

- Used for code blocks and technical content

**Tailwind Usage:**

```html
<p class="font-sans">Regular text</p>
<code class="font-mono">Code snippet</code>
```

### Font Size Scale

Mobile-first responsive scale with consistent line heights:

| Size | Base (Mobile) | Desktop | Line Height | Usage                |
| ---- | ------------- | ------- | ----------- | -------------------- |
| xs   | 12px          | -       | 16px        | Captions, small text |
| sm   | 14px          | -       | 20px        | Small body text      |
| base | 16px          | -       | 24px        | Default body text    |
| lg   | 18px          | -       | 28px        | Large body text      |
| xl   | 20px          | 24px    | 28px        | Small headings       |
| 2xl  | 24px          | 30px    | 32px        | H5, H6               |
| 3xl  | 30px          | 36px    | 36px        | H4                   |
| 4xl  | 36px          | 48px    | 40px        | H3                   |
| 5xl  | 48px          | 60px    | Tight       | H2                   |
| 6xl  | 60px          | 72px    | Tight       | H1, Hero headings    |

**Tailwind Usage:**

```html
<h1 class="text-5xl font-bold">Main Heading</h1>
<p class="text-base">Body text with perfect line height</p>
```

### Font Weights

- **thin:** 100
- **extralight:** 200
- **light:** 300
- **normal:** 400 (default)
- **medium:** 500
- **semibold:** 600 (headings)
- **bold:** 700 (strong emphasis)
- **extrabold:** 800
- **black:** 900

### Typography Presets

Pre-configured combinations for common text elements:

- **h1-h6:** Heading styles with appropriate size, weight, and spacing
- **body/bodyLarge/bodySmall:** Body text variations
- **caption:** Small captions with wide letter spacing
- **overline:** Uppercase labels
- **button:** Button text styling
- **link:** Link text styling

---

## Spacing System

### Base Unit System

All spacing uses a **4px base unit** for consistency and predictability.

### Spacing Scale

| Token | Pixels | Rem  | Usage                       |
| ----- | ------ | ---- | --------------------------- |
| 0     | 0px    | 0rem | No spacing                  |
| 1     | 4px    | 0.25 | Fine adjustments            |
| 2     | 8px    | 0.5  | Small gaps                  |
| 3     | 12px   | 0.75 | Compact spacing             |
| 4     | 16px   | 1    | Standard element spacing    |
| 6     | 24px   | 1.5  | Medium element spacing      |
| 8     | 32px   | 2    | Large element spacing       |
| 12    | 48px   | 3    | Section spacing (small)     |
| 16    | 64px   | 4    | Section spacing (medium)    |
| 24    | 96px   | 6    | Section spacing (large)     |
| 32+   | 128px+ | 8+   | Hero spacing, large layouts |

**Tailwind Usage:**

```html
<div class="p-4 mb-8 gap-6">
	<!-- padding: 16px, margin-bottom: 32px, gap: 24px -->
</div>
```

### Common Spacing Patterns

Predefined patterns for consistency:

**Buttons:**

- Small: x: 12px, y: 8px
- Medium: x: 16px, y: 8px
- Large: x: 24px, y: 12px

**Cards:**

- Small: 16px
- Medium: 24px
- Large: 32px

**Sections:**

- Small: y: 48px, x: 16px
- Medium: y: 64px, x: 24px
- Large: y: 96px, x: 32px

### Container Widths

- **sm:** 640px
- **md:** 768px
- **lg:** 1024px
- **xl:** 1280px
- **2xl:** 1536px

### Breakpoints

- **sm:** 640px (small tablets)
- **md:** 768px (tablets)
- **lg:** 1024px (desktop)
- **xl:** 1280px (large desktop)
- **2xl:** 1536px (extra large)

---

## Animation System

### Durations

- **instant:** 0ms - No animation
- **fast:** 150ms - Micro-interactions (hover, focus)
- **normal:** 300ms - Standard transitions
- **slow:** 500ms - Complex animations
- **slower:** 700ms - Page transitions

**Tailwind Usage:**

```html
<div class="transition-all duration-fast hover:scale-105">Hover me</div>
```

### Easing Functions

- **linear:** Constant speed (loading spinners)
- **easeIn:** Accelerating (elements leaving)
- **easeOut:** Decelerating (elements entering)
- **easeInOut:** Smooth both ways
- **spring:** Bouncy, energetic
- **smooth:** Very polished (Squarespace-style)

**Tailwind Usage:**

```html
<div class="transition-transform duration-normal ease-smooth">Smooth transition</div>
```

### Pre-configured Transitions

Common combinations for specific use cases:

- **buttonHover:** Fast color and transform
- **cardHover:** Medium transform and shadow
- **fadeIn/fadeOut:** Opacity transitions
- **slideIn/slideOut:** Transform and opacity
- **modalEnter/modalExit:** Modal animations
- **inputFocus:** Focus state transitions

### Keyframe Animations

Built-in animations available via Tailwind:

```html
<div class="animate-fade-in">Fade in on mount</div>
<div class="animate-slide-in-up">Slide in from bottom</div>
<div class="animate-spin">Loading spinner</div>
<div class="animate-pulse">Pulsing element</div>
```

Available animations:

- fade-in, fade-out
- slide-in-up, slide-in-down, slide-in-left, slide-in-right
- scale-in, scale-out
- spin, pulse, bounce

---

## Borders & Shadows

### Border Widths

- **0:** No border
- **1:** 1px (default)
- **2:** 2px (prominent)
- **4:** 4px (very prominent)
- **8:** 8px (decorative)

### Border Radius

- **none:** 0px - Sharp corners
- **sm:** 2px - Subtle rounding (inputs, buttons)
- **md:** 6px - Standard rounding (cards, modals)
- **lg:** 8px - Prominent rounding (large cards)
- **xl:** 12px - Very rounded
- **2xl:** 16px - Highly rounded
- **3xl:** 24px - Extremely rounded
- **full:** 9999px - Perfect circles

**Tailwind Usage:**

```html
<button class="rounded-md">Rounded button</button>
<div class="rounded-lg">Rounded card</div>
```

### Box Shadows

Elevation system with layered, realistic shadows:

- **xs:** Minimal (subtle hover states)
- **sm:** Small (cards at rest)
- **md:** Medium (dropdowns, popovers)
- **lg:** Large (modals, dialogs)
- **xl:** Extra large (notifications)
- **2xl:** Maximum (prominent overlays)
- **inner:** Inset shadow (pressed states)

**Tailwind Usage:**

```html
<div class="shadow-md hover:shadow-lg">Card with elevation</div>
```

### Focus Rings

Accessible focus indicators for keyboard navigation:

- **Default:** 2px blue outline, 2px offset
- **Error:** 2px red outline
- **Success:** 2px green outline

All interactive elements have focus-visible styles applied automatically via global CSS.

---

## Usage Guidelines

### 1. Component Styling

Use Tailwind classes for layout and responsive design:

```html
<div class="flex flex-col gap-4 p-6 bg-neutral-50 rounded-lg shadow-sm">
	<h2 class="text-2xl font-semibold text-primary-700">Component Title</h2>
	<p class="text-base text-neutral-700">Component description text.</p>
</div>
```

### 2. Custom CSS with Design Tokens

Use CSS custom properties for dynamic values:

```css
.custom-component {
	background-color: var(--color-neutral-50);
	padding: var(--spacing-unit * 4);
	border-radius: var(--radius-md);
	box-shadow: var(--shadow-sm);
	transition: all var(--duration-normal) var(--ease-out);
}
```

### 3. TypeScript Imports

Import design tokens directly in your Svelte components:

```typescript
import { primary } from '$lib/styles/colors';
import { spacing } from '$lib/styles/spacing';

const buttonStyle = `
  background: ${primary[500].hex};
  padding: ${spacing[2].rem} ${spacing[4].rem};
`;
```

### 4. Responsive Design

Mobile-first approach with Tailwind breakpoints:

```html
<div class="text-base md:text-lg lg:text-xl">
	<!-- 16px mobile, 18px tablet, 20px desktop -->
</div>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
	<!-- 1 column mobile, 2 columns tablet, 3 columns desktop -->
</div>
```

### 5. Accessibility

- All interactive elements have focus-visible styles
- Color contrast ratios meet WCAG AA standards
- Use semantic HTML elements
- Provide appropriate ARIA labels
- Use .sr-only class for screen-reader-only text

---

## Best Practices

### Do's

✅ Use design tokens instead of hardcoded values
✅ Follow the spacing scale consistently
✅ Use semantic color names (success, error, etc.)
✅ Maintain mobile-first responsive approach
✅ Test keyboard navigation and focus states
✅ Use pre-configured typography presets when possible

### Don'ts

❌ Don't use arbitrary values in Tailwind (e.g., `w-[342px]`)
❌ Don't mix CSS units (stick to rem for spacing)
❌ Don't skip accessibility considerations
❌ Don't override design tokens without reason
❌ Don't use color values directly (use tokens)
❌ Don't create one-off spacing values

---

## Component Patterns

### Card Component Pattern

```html
<div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-normal">
	<h3 class="text-xl font-semibold mb-2">Card Title</h3>
	<p class="text-neutral-700">Card content goes here.</p>
</div>
```

### Button Component Pattern

```html
<button
	class="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors duration-fast font-medium"
>
	Click Me
</button>
```

### Input Component Pattern

```html
<div class="flex flex-col gap-1">
	<label class="text-sm font-medium text-neutral-700">Label</label>
	<input
		class="px-3 py-2 border border-neutral-300 rounded-md focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition-all duration-fast"
		type="text"
	/>
</div>
```

---

## Future Enhancements

Potential additions to the design system:

- Dark mode color variants
- Additional animation presets
- Icon system integration
- Component-specific design patterns
- Motion design guidelines
- Illustration style guide
- Accessibility testing checklist

---

## Resources

- **Tailwind CSS Documentation:** https://tailwindcss.com/docs
- **Svelte Documentation:** https://svelte.dev/docs
- **WCAG Accessibility Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **Color Contrast Checker:** https://webaim.org/resources/contrastchecker/

---

**Last Updated:** Phase 3 - Design System Creation
**Version:** 1.0.0
