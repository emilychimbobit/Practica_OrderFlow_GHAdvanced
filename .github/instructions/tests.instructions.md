---
applyTo: "tests/**/*.test.js"
---

# Test instructions

- Use the built-in `node:test` runner and `node:assert/strict`; add no test framework.
- Name each test after one observable behavior and the relevant condition.
- Keep domain tests deterministic and free of repositories, clocks, and mocks.
- Use `InMemoryOrderRepository` for service tests and isolate state per test.
- Test successful results and typed error behavior, including error messages when contractual.
- Cover creation constraints, discount boundaries and cap, rounding, and cancellation states.
- Assert persisted values such as normalized email, copied items, status, and ISO timestamps.
- Import production modules through explicit relative `.js` paths.
- Run the full suite with `npm test` after changing business behavior.
