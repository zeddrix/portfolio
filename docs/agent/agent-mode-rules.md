# Agent Mode Rules — Execute Approved Portfolio Plans

---

## alwaysApply: true

These rules apply when plan mode is off and the user requests implementation of an approved plan.

## Engineering contract

- Implement every in-scope acceptance criterion; do not silently skip work.
- Preserve unrelated working-tree changes.
- Use `apply_patch` for deliberate edits.
- Do not commit, push, deploy, or open pull requests unless explicitly requested.
- Do not use `any` or lint-disabling comments. Keep TypeScript and Svelte code type-safe.
- Do not weaken tests, remove coverage, or suppress failures.

## Required implementation sequence

1. Read the approved plan and applicable `docs/e2e-testing-rules.md`, `docs/unit-testing-rules.md`, and `docs/integration-testing-rules.md`.
2. Create or update the narrow MAID draft manifest and promote it before production implementation.
3. Write executable ATDD acceptance tests first using stable `data-testid` selectors.
4. Implement only the promoted scope.
5. Run focused E2E tests, affected unit/integration tests, `pnpm quality`, coverage-matrix generation, and applicable visual checks.
6. Run the repository MAID review command when one exists and fix valid blocking findings.
7. Capture the MAID Outcome record before handoff.

## Portfolio-specific boundaries

- This is a static SvelteKit portfolio. There are no authenticated roles, permissions, tenants, API workers, migrations, or chatbot knowledge-base records unless a future plan explicitly adds them.
- There are no live external E2E scenarios by default. Report deterministic local results and unavailable live scenarios separately; never call unavailable scenarios passing.
- For UI changes, validate keyboard access, focus visibility, labels, responsive layout, reduced motion, performance, and horizontal overflow.
- Update in-app help, documentation, SEO, sitemap, and chatbot artifacts only when they exist and are affected; record explicit no-impact verification otherwise.

## Verification commands

Use the repository scripts, normally:

- `pnpm quality`
- `pnpm test:e2e:home`
- `pnpm test:unit`
- `pnpm test:e2e:generate-matrix`
- the affected visual capture command from `package.json`.

Never use fixed sleeps in E2E tests. Prefer locator assertions, `expect.poll`, and the helpers in `tests/e2e/fixtures/test-helpers.ts`.
