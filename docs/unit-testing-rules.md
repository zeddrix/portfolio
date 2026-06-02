# Unit Testing Rules

## Scope

These rules apply to unit tests for utility functions, data mappers, and pure logic.

## Mandatory standards

1. Add unit tests only when logic extraction introduces non-trivial behavior.
2. Test pure functions directly with focused inputs and outputs.
3. Keep tests deterministic (no network calls, no real timers unless mocked).
4. Cover edge cases and error handling branches.
5. Avoid snapshot-heavy tests for simple data structures.
6. No `any` types in test code or fixtures.

## File conventions

- Co-locate tests beside modules when practical:
  - `src/lib/data/*.test.ts`
  - `src/lib/utils/*.test.ts`

## Assertion style

- Prefer explicit assertions over broad truthy checks.
- Validate exact fields for critical mapping outputs.
