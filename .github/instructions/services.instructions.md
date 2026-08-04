---
applyTo: "src/services/**/*.js"
---

# Service layer instructions

- Orchestrate order use cases, input validation, state transitions, and persistence.
- Depend on domain functions and the injected repository; never depend on HTTP modules.
- Validate complete creation input before calculating or saving an order.
- Reuse domain calculations for subtotal, discount, total, and monetary rounding.
- Generate order IDs with `randomUUID()` and timestamps as ISO 8601 strings.
- Normalize customer email before persistence and copy caller-owned item objects.
- Throw typed service errors so the HTTP layer can translate failures consistently.
- Check allowed status transitions before mutating or saving an existing order.
- Cover every new rule and failure path with focused service tests.
