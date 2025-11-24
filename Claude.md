# Claude AI Agent Guide - Zeddrix Portfolio

## Project Goal

Build a **custom portfolio website** using SvelteKit with a clean, ground-up approach. Two-page structure: main landing page and project details pages.

## Tech Stack

**Framework:** SvelteKit + Svelte 4 + TypeScript + Tailwind CSS 4 + pnpm

## Project Structure

```
src/
├── lib/
│   ├── assets/          # Static assets
│   └── index.ts         # Lib exports
└── routes/
    ├── +layout.svelte   # Root layout
    └── +page.svelte     # Home page
```

## Key Commands

```bash
# Development
pnpm dev                    # Start dev server (http://localhost:3212)
pnpm build                  # Production build

# Database Migrations
pnpm db:verify              # Verify database connection only
pnpm db:migrate             # Run all database migrations

# Code Quality - RUN BEFORE EVERY COMMIT
pnpm quality                # Run ALL checks (format + lint + type-check)
pnpm format                 # Format with Prettier
pnpm format:check           # Check formatting without modifying
pnpm lint                   # Lint with ESLint
pnpm lint:fix               # Lint and auto-fix issues
pnpm check                  # TypeScript type checking
pnpm check:watch            # Watch mode for type checking
```

## Mandatory Workflow

### CRITICAL: Before ANY Commit

**ALWAYS run quality checks after AI agent work:**

```bash
pnpm quality
```

This command runs:

1. Prettier formatting
2. ESLint linting
3. TypeScript type checking

**If any errors occur, FIX them before committing.**

### Pre-Commit Hook

A pre-commit hook is configured at `.husky/pre-commit` that automatically:

- Formats and lints staged files with Prettier and ESLint
- Runs full type checking on the entire codebase
- **Blocks commits if any errors are found**

## Code Quality Standards

### Mandatory Rules (Zero Tolerance)

**CRITICAL - These rules are enforced by pre-commit hooks:**

1. **NEVER use `any` type**

   ```typescript
   // ❌ WRONG - Never do this
   export let items: any[] = [];

   // ✅ CORRECT - Use generics or specific types
   export let items: T[] = [];
   export let items: string[] = [];
   ```

2. **NEVER use eslint-disable comments**

   ```typescript
   // ❌ WRONG - Never do this
   // eslint-disable-next-line no-undef
   window.setTimeout(() => {}, 1000);

   // ✅ CORRECT - Fix the underlying issue
   setTimeout(() => {}, 1000);
   ```

3. **ALWAYS run `pnpm quality` after AI agent work and before committing**

### Critical Enforcement

**The codebase must be 100% free of:**

- ❌ ANY `any` types (use proper types, generics, or unknown)
- ❌ ANY eslint-disable comments (fix the underlying issue instead)
- ❌ Type assertions without proper justification
- ❌ Implicit any types (strict mode enforces this)

**If you find `any` or eslint-disable:**

1. Stop immediately
2. Fix it with proper types
3. Run `pnpm quality` to verify
4. Never commit code with these violations

### Type Safety Standards

**Required:**

- TypeScript strict mode enabled (no implicit `any`)
- All component props must be explicitly typed
- All function parameters and returns must be typed
- All event handlers must have proper event types (MouseEvent, KeyboardEvent, etc.)
- Use proper types for browser APIs:

  ```typescript
  // ✅ Timers
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let intervalId: ReturnType<typeof setInterval> | undefined;

  // ✅ Browser globals work automatically
  window.addEventListener('scroll', handleScroll);
  document.body.style.overflow = 'hidden';
  setTimeout(() => {}, 1000);
  ```

**Generic Components:**

```typescript
// ✅ Use generics for reusable components
<script lang="ts" generics="T">
  export let items: T[] = [] as T[];
</script>
```

**Common Type Patterns:**

```typescript
// ✅ Event handlers
function handleClick(event: MouseEvent) {}
function handleKeydown(event: KeyboardEvent) {}
function handleSubmit(event: SubmitEvent) {}

// ✅ Form elements
const input: HTMLInputElement | null = null;
const form: HTMLFormElement | null = null;

// ✅ Unknown instead of any
function parseJson(str: string): unknown {
	return JSON.parse(str);
}
// Then use type guards to narrow
```

### Code Standards

**Required:**

- Prettier formatted, ESLint clean, type-check passing (zero errors, zero warnings)
- Svelte 4 syntax only (NOT Svelte 5)
- Read files before editing to understand context
- Fix all accessibility warnings from svelte-check
- No `any` types or eslint-disable comments anywhere

**Styling:**

- Tailwind CSS classes primarily
- Mobile-first responsive design
- Custom design tokens as needed in Tailwind config

**Component Structure:**

```svelte
<script lang="ts">
	// 1. Imports
	import { onMount } from 'svelte';

	// 2. Props (exports)
	export let prop: string;

	// 3. Internal state
	let state: boolean = false;

	// 4. Functions
	function handler(event: MouseEvent) {}

	// 5. Lifecycle
	onMount(() => {});

	// 6. Reactive statements
	$: computed = prop + 'value';
</script>

<!-- 7. Template --><div>Content</div>
```

## Database Workflow

### Running Migrations

**IMPORTANT: Database verification is built-in and automatic.**

The migration system includes safety checks that:

- ✅ Verify connection to the correct Supabase database
- ✅ Check for Supabase-specific schemas before running migrations
- ✅ Display connection information for manual verification
- ✅ Exit immediately if verification fails

### Commands

1. **Verify Database Connection** (without running migrations):

   ```bash
   pnpm db:verify
   ```

2. **Run All Migrations** (with automatic verification):
   ```bash
   pnpm db:migrate
   ```

### Migration Files

Located in `scripts/db/migrations/`:

- `001_initial_schema.sql` - Creates all tables, types, and indexes
- `002_rls_policies.sql` - Sets up Row Level Security policies
- `003_seed_data.sql` - Inserts initial/sample data

Migrations run in order and include built-in verification.

### Database Schema

**Tables:**

- `site_settings` - Global site configuration (layout, palette, theme)
- `profile` - Personal profile information
- `skills` - Technical skills with proficiency levels
- `projects` - Portfolio projects with rich media (images, videos, GIFs)
- `certifications` - Professional certifications
- `experiences` - Work experience history
- `social_links` - Social media and external links
- `admin_users` - Admin user roles and permissions

**Security:**

- All tables have Row Level Security (RLS) enabled
- Public users: Read access to published content only
- Admin users: Full CRUD access via `is_admin()` helper function
- Authentication required for all admin operations

### Environment Variables

Required in `.env`:

```bash
# Supabase
PUBLIC_SUPABASE_URL=          # Your Supabase project URL
PUBLIC_SUPABASE_ANON_KEY=     # Public/anonymous key
PUBLIC_SUPABASE_SERVICE_ROLE_KEY=  # Service role key (server-side only!)
POSTGRES_URL=                 # Direct PostgreSQL connection (for migrations)
SUPABASE_DB_PASSWORD=         # Database password

# Cloudinary
CLOUDINARY_CLOUD_NAME=        # Your Cloudinary cloud name
CLOUDINARY_API_KEY=           # API key
CLOUDINARY_API_SECRET=        # API secret (keep private!)
PUBLIC_CLOUDINARY_CLOUD_NAME= # Public cloud name (for frontend)
CLOUDINARY_URL=               # Full Cloudinary URL
```

### After Initial Migration

1. **Update seed data** with your personal information
   - Edit `scripts/db/migrations/003_seed_data.sql`
   - Update profile, skills, social links
   - Re-run: `pnpm db:migrate`

2. **Create admin user** in Supabase Dashboard
   - Go to Authentication > Users
   - Create user with your email
   - Copy the User ID (UUID)

3. **Add admin user to database**:
   ```sql
   INSERT INTO admin_users (id, email, role)
   VALUES ('your-user-uuid', 'your-email@example.com', 'admin');
   ```

### Detailed Documentation

See [scripts/db/README.md](scripts/db/README.md) for:

- Complete migration documentation
- Safety features and verification details
- Troubleshooting guide
- How to add new migrations

## Git Workflow

### Committing Changes

When the user asks to commit:

1. Run `git status` to see all changes
2. Run `git diff` to see modifications
3. Run `git log --oneline -10` to see commit message style
4. Analyze changes and draft appropriate commit message
5. Add files and create commit with detailed message
6. Run `git status` after commit to verify

**Commit Message Format:**

```
Brief summary of changes (imperative mood)

Detailed explanation of what changed and why.
Can span multiple paragraphs if needed.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

## Quick Start for New AI Agent Session

1. Read this file
2. Check [README.md](README.md) for project overview
3. Review recent commits: `git log --oneline -10`
4. Run `pnpm check` to verify current state
5. Continue with assigned task

## Success Criteria

**Technically:**

- Clean code, fully typed, maintainable, no errors
- All quality checks pass (`pnpm quality`)
- Pre-commit hooks pass without issues

**Visually:**

- Custom design built from scratch
- Mobile-first responsive
- Accessible and performant

---

**Portfolio Owner:** Zeddrix
**Main Branch:** `main`
**Workflow:** Quality checks → Commit → Push
