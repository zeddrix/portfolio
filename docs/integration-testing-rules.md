# Integration Testing Rules

## Scope

These rules apply when multiple modules interact (routing loaders + data modules, API handlers + validators).

## Mandatory standards

1. Add integration tests only when cross-module behavior is critical.
2. Keep external dependencies mocked unless explicitly validating real integration points.
3. Validate contracts at boundaries (input parsing, output shape, status handling).
4. Include unhappy-path assertions (invalid slug, missing data, malformed payload).
5. Keep tests independent and free of shared mutable state.

## Recommended focus areas in this portfolio project

- Project slug resolution and not-found behavior.
- Data-source-to-route rendering contract for project details.
- Contact route validation if API form handling is introduced later.
