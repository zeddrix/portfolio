# Plan Mode Rules — Portfolio

---

## alwaysApply: true

Planning is read-only. Do not implement code, modify application files, run migrations, deploy, or make external changes while preparing a plan.

Create one decision-complete ATDD plan. It must identify scope, assumptions, issue-by-issue production and test files, Given/When/Then acceptance criteria, accessibility, performance, security, rollback, documentation, SEO, chatbot, CI, and Definition of Done.

Before planning, inspect the repository and distinguish discoverable facts from product decisions. Ask only about decisions that cannot be derived safely. Do not include optional enhancements without confirmation.

## Required references

Plans must follow:

- `docs/e2e-testing-rules.md`
- `docs/unit-testing-rules.md`
- `docs/integration-testing-rules.md`
- repository contributor guidance, when present
- visual-review guidance, when present and applicable

## ATDD and UI sequencing

For each issue: define a narrow MAID draft manifest, write red acceptance tests first, implement the promoted scope, run focused tests, then run visual capture and review for affected UI. Use stable test IDs, at least two meaningful user actions per user-facing test, isolated state, deterministic waits, and meaningful outcomes.

For UI work, plan the relevant 390×844, 375×667, 768×1024, and 1280×900 viewports when applicable. Include visual checkpoints and expected before/after behavior. Fix overflow, clipping, broken states, hierarchy, spacing, and missing test IDs in implementation rather than deferring them.

## Repository boundaries

This portfolio has no known authenticated roles, permissions, API/data migrations, live external E2E scenarios, or chatbot knowledge base. Plans must explicitly record those as not applicable when unaffected. SEO and sitemap behavior must still be assessed for route or rendered-content changes.

## Required completion gates

The plan must specify focused E2E, unit/integration, `pnpm quality`, coverage-matrix, applicable visual, accessibility, performance, CI-equivalent, MAID review, and Outcome-record checks. Scope changes require explicit user confirmation. No commit, push, deployment, or pull request is implied.
