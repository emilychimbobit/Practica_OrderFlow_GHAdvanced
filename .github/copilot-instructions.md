# GitHub Copilot instructions — OrderFlow

> LAB: Complete this file using evidence from `README.md`, `docs/architecture.md`, `docs/business-rules.md`, `package.json`, source code, and tests.

## Project purpose

- OrderFlow is a small HTTP JSON API for order management used in an advanced GitHub Copilot training lab.
- This repository is intentionally educational: it runs end-to-end, but architecture and requirements are designed to exercise safe, incremental changes.
- Copilot must prioritize preserving behavior and contracts over broad refactors.

## Runtime and conventions

- Runtime: Node.js >= 20.
- Module system: ECMAScript Modules (`"type": "module"`). Use `import`/`export`, not CommonJS.
- Dependency policy: avoid adding external packages when the task can be solved with built-in Node.js APIs.
- API protocol: HTTP responses are JSON.
- Currency and money domain assumptions: amounts are in EUR.
- Keep naming and style consistent with the existing codebase (simple modules, explicit domain vocabulary, and minimal indirection).

## Architecture

- Layer responsibilities:
- `src/domain`: domain entities, states, and domain-level invariants.
- `src/repositories`: data access and persistence details (currently in-memory implementation).
- `src/services`: application rules, orchestration, calculations, and ID generation.
- `src/http`: endpoint wiring, request/response mapping, and error translation.

- Architectural prohibitions:
- Do not make `domain` depend on `http` or `repositories`.
- Do not move business rules into `src/http` handlers.
- Do not bypass `services` by calling repositories directly from `http` for business operations.
- Do not introduce framework-level abstractions or external dependencies unless explicitly required by the task.
- Do not change endpoint shapes/status behavior without explicit justification and test updates.

## Change workflow

1. Read relevant docs first (`README.md`, `docs/architecture.md`, `docs/business-rules.md`) and map the requested change to the correct layer.
2. Propose a small, verifiable plan that preserves endpoint contracts and dependency direction before editing.
3. Implement minimal changes, then run tests and summarize what changed, what was validated, and any residual risks.

## Testing and validation

```bash
npm test
npm start
```

- Test runner: Node built-in test runner (`node --test`).
- Minimum scenarios for business-rule changes:
- Creation constraints: at least one item, positive integer quantity, positive unit price, required customer email.
- Contract safety: existing endpoints continue returning JSON and preserving behavior for current tests.

## Definition of Done

- Change is implemented in the correct layer without violating dependency direction.
- Existing endpoint contracts are preserved, or contract changes are explicitly documented and approved.
- Automated tests pass with `npm test`.
- New or modified business rules are covered by automated tests.
- No unnecessary external dependency was introduced.
- Domain assumptions remain explicit: EUR amounts, ISO 8601 timestamps, explainable automatic decisions.

## Human confirmation boundaries

Request confirmation before:

- Changing endpoint routes, payload schemas, or status code semantics.
- Introducing new npm dependencies or replacing the built-in HTTP server approach.
- Moving logic across layers in ways that alter architectural boundaries.
- Applying broad refactors that touch multiple layers without direct requirement coverage.
