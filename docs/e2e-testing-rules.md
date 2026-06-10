# E2E Testing Rules

This project follows ATDD — E2E acceptance tests define expected user-visible behavior before production changes.

## Core Philosophy

**Test REAL user journeys, not element existence.** Every E2E test must simulate what a user actually does — clicking, scrolling to interact, navigating — and verify meaningful outcomes (page navigated, layout changed, filter applied, content updated). If a test only checks that an element is visible without user action, it belongs in a unit test or should not exist.

## Mandatory Rules

### 1. Every test must have multiple user actions AND verify an outcome

At least **2 user actions** (click, scroll-to-interact, navigate, submit) and at least **1 meaningful outcome** (URL changed, section in viewport, layout mode swapped, filter state changed, error/404 shown).

### 2. Use `data-testid` selectors for structure and primary actions

Use helpers in [`tests/e2e/fixtures/selectors.ts`](../tests/e2e/fixtures/selectors.ts). Avoid unscoped `getByText()` that matches multiple elements. Role-based selectors are OK when scoped to a `data-testid` container.

### 3. Complete UI state verification for layout modes

When testing preview settings or filters, verify the **full mode change** — not just one element. Example: switching to case-study layout must hide `work-featured-grid` and show `case-study-*` cards.

### 4. State isolation with `beforeEach` localStorage reset

Layout and preview specs that depend on localStorage MUST reset in `beforeEach` via `resetPortfolioLocalStorage()` in [`tests/e2e/fixtures/test-helpers.ts`](../tests/e2e/fixtures/test-helpers.ts).

### 5. Consolidated test files by feature domain

Group tests by domain folder, not one file per assertion:

- `tests/e2e/home/` — hero, nav, work, carousel, tools, preview settings
- `tests/e2e/projects/` — routing, images, slug matrix
- `tests/e2e/seo/` — navigation-driven SEO, sitemap/robots
- `tests/e2e/content/` — tools/capability integrity, band images
- `tests/e2e/contact/` — contact and footer
- `tests/e2e/journeys/` — cross-section golden paths only

Do not create a new file for fewer than 3 tests unless no domain file exists.

### 6. No duplicate coverage across files

Each behavior has one canonical home. Journeys cover happy-path cross-section flows; focused specs cover edge cases and branches without repeating the same end-to-end outcome.

### 7. Journey vs focused split

- **Focused:** single domain, specific branches (filters, layout modes, 404, slug matrix)
- **Journeys:** `journey-*.e2e.test.ts` — multi-section flows (home → work → project → back)

Run journeys: `pnpm test:e2e:journeys`

### 8. Static-site SEO split

Deep home `<head>` assertions (JSON-LD shape, default og:image, favicon) belong in [`src/lib/data/seo.test.ts`](../src/lib/data/seo.test.ts). E2E SEO tests navigate to a page first, then assert canonical/title/description changed.

### 9. Mobile navigation out of scope

[`SiteHeader.svelte`](../src/lib/components/SiteHeader.svelte) hides primary nav below `sm` with no hamburger menu. E2E runs at Desktop Chrome (≥640px). Mobile nav E2E requires new production UI first.

### 10. Deterministic waits only

Do **not** use `page.waitForTimeout()`.

| Instead of                  | Use                                                             |
| --------------------------- | --------------------------------------------------------------- |
| Fixed delay after click     | `expect(locator).toBeVisible()` / `toBeInViewport()`            |
| Carousel image auto-advance | `waitForCarouselImageChange()` or click `carousel-control-next` |
| List/filter refresh         | `expect.poll()`                                                 |
| Navigation after click      | `Promise.all([page.waitForURL(...), click()])`                  |

Helpers: [`tests/e2e/fixtures/test-helpers.ts`](../tests/e2e/fixtures/test-helpers.ts)

**Gate:** `rg 'waitForTimeout' tests/e2e` must return zero matches.

## Banned Patterns

### Page title only (no user action)

```typescript
// BAD
test("homepage title", async ({ page }) => {
  await page.goto(PAGES_HOME_PATH);
  await expect(page).toHaveTitle(/Portfolio/);
});
```

### Visibility-only with no action

```typescript
// BAD
test("hero visible", async ({ page }) => {
  await page.goto(PAGES_HOME_PATH);
  await expect(page.getByTestId("hero-section")).toBeVisible();
});
```

### Static head meta on home without navigation

```typescript
// BAD for E2E — use seo.test.ts
await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', ...);
```

### CSS / computed style checks

Use [`tests/visual/`](../tests/visual/) for screenshot comparison.

### localStorage reads as sole assertion

Implementation detail — test via UI persistence after reload instead.

## Required Patterns

### Multi-step journey

```typescript
test("filter personal → open Queue → detail metadata", async ({ page }) => {
  await page.goto(PAGES_HOME_PATH);
  await scrollToTestId(page, "work-section");
  await page.getByTestId("work-filter-personal").click();
  await Promise.all([
    page.waitForURL("**/projects/queue"),
    page.getByTestId("project-link-queue").click(),
  ]);
  await expect(page.getByTestId("project-detail-title")).toContainText("Queue");
});
```

### Preview settings flow

Use `openPreviewSettings()`, `setWorkLayout()`, `setCapabilityLayout()` from test-helpers — never inline duplicate open-panel clicks across files.

### Carousel interaction

Use `carousel-control-next` / `carousel-control-prev` on [`FeaturedProjectCarousel.svelte`](../src/lib/components/FeaturedProjectCarousel.svelte), or `scrollCarouselToCard()` helper.

## Prevention Rules

Before any E2E test is done:

- Does every `test()` have ≥2 user actions?
- Does every `test()` verify an outcome beyond visibility?
- Could this be a unit test instead?
- Is there already a test navigating to the same page? Merge assertions.
- Is coverage listed in [`docs/e2e-flow-coverage-matrix.md`](e2e-flow-coverage-matrix.md)?

## Test Organization

### File naming

- E2E: `*.e2e.test.ts`
- Group by domain folder (see rule 5)

### Commands

| Script                          | Purpose                          |
| ------------------------------- | -------------------------------- |
| `pnpm test:e2e`                 | All behavior E2E                 |
| `pnpm test:e2e:journeys`        | Journey specs only               |
| `pnpm test:e2e:home`            | Home domain                      |
| `pnpm test:e2e:projects`        | Project domain                   |
| `pnpm test:e2e:seo`             | SEO domain                       |
| `pnpm test:e2e:preflight`       | Server health                    |
| `pnpm test:e2e:generate-matrix` | Regenerate coverage matrix       |
| `pnpm screenshots`              | Visual capture (`tests/visual/`) |

### Worker count

Default `workers: 1`. Override: `PW_WORKERS=2 pnpm test:e2e:one -- tests/e2e/home/home-work-section.e2e.test.ts`

Pass Playwright CLI options **before** the test path.

### Local-only policy

E2E is run locally via `pnpm test:e2e`. `pnpm quality` runs format, lint, and svelte-check — not E2E.

## Selector policy

Required `data-testid` for:

- Main sections: hero, work, about, tools strip, approach, contact, footer
- Primary CTAs and nav links
- Project cards, carousel controls, preview settings options
- Project detail hero, gallery, links, back link
- 404 state

Do not select by Tailwind class names.

## Coverage matrix

Every spec file must appear in [`docs/e2e-flow-coverage-matrix.md`](e2e-flow-coverage-matrix.md). Regenerate with `pnpm test:e2e:generate-matrix`. Unit gate: `tests/unit/docs/e2e-flow-coverage-matrix.unit.test.ts`.
