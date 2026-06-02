# E2E Testing Rules

## Scope

These rules apply to all files under `tests/e2e`.

## Mandatory standards

1. Write acceptance tests first (red) before production changes.
2. Use Given/When/Then scenario naming or comments for readability.
3. Every scenario must include at least two user actions and one meaningful outcome assertion.
4. Use stable selectors (`data-testid`) for page structure and key actions.
5. Prefer role-based selectors for accessibility checks (`getByRole`) where practical.
6. Do not use brittle waits such as `waitForTimeout`.
7. Use deterministic state setup and avoid test order dependency.
8. Keep each scenario independent and runnable in isolation.

## Selector policy

- Required `data-testid` for:
  - Main sections (hero, projects, skills, contact, footer)
  - Primary CTAs
  - Project cards
  - Project detail hero/gallery
- Do not select by Tailwind class names.

## Wait policy

- Allowed:
  - `expect(locator).toBeVisible()`
  - `locator.waitFor({ state: 'visible' })`
  - `page.waitForURL(...)`
- Not allowed:
  - Fixed sleeps/timeouts.

## Visual vs behavior tests

- `tests/visual` is for screenshots/comparison.
- `tests/e2e` is for behavior and acceptance flows.
