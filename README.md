# Zeddrix Portfolio

A clean, minimal SvelteKit portfolio website built from the ground up.

## Tech Stack

- **SvelteKit** - Full-stack framework
- **Svelte 4** - Component framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **pnpm** - Package manager

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server (http://localhost:3212)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Code Quality

This project has strict code quality standards enforced by pre-commit hooks:

### Quality Commands

```bash
# Run ALL checks (format + lint + type-check)
pnpm quality

# Format with Prettier
pnpm format

# Check formatting without modifying
pnpm format:check

# Lint with ESLint
pnpm lint

# Lint and auto-fix issues
pnpm lint:fix

# TypeScript type checking
pnpm check

# Watch mode for type checking
pnpm check:watch
```

### Pre-Commit Hook

A pre-commit hook automatically runs before each commit:

- Formats staged files with Prettier
- Lints staged files with ESLint
- Runs full TypeScript type checking
- **Blocks commit if any errors are found**

### Code Standards

**CRITICAL - Zero Tolerance:**

- ❌ NEVER use `any` type - Use specific types or generics
- ❌ NEVER use eslint-disable comments - Fix the underlying issue
- ✅ ALWAYS run `pnpm quality` before committing

**Type Safety:**

- TypeScript strict mode enabled
- All component props must be explicitly typed
- All function parameters and returns must be typed
- Use generics for reusable components

## Project Structure

```text
src/
├── lib/
│   ├── assets/          # Static assets
│   └── index.ts         # Lib exports
├── routes/
│   ├── +layout.svelte   # Root layout
│   └── +page.svelte     # Home page
├── app.html             # HTML template
├── app.d.ts             # TypeScript declarations
└── app.css              # Global styles
```

## Development

Build your portfolio with clean, maintainable code. The quality tools and pre-commit hooks ensure every commit meets high standards.

---

**Owner:** Zeddrix
**Main Branch:** `main`
