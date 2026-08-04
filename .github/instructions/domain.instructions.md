---
applyTo: "src/domain/**/*.js"
---

# Domain layer instructions

- Define domain constants, invariants, and deterministic business calculations.
- Keep this layer independent from HTTP, services, repositories, and external state.
- Export closed value sets such as statuses and customer tiers as frozen constants.
- Implement calculations as pure functions with no I/O, mutation, IDs, or timestamps. The calculations could not include any kind of ID in the parameters or return values. The calculations should be based on the input data only.
- Centralize monetary rounding in `roundMoney`; do not duplicate rounding formulas.
- Preserve discount thresholds, rates, and caps unless requirements and tests change.
- Return values that can be tested directly without mocks or environment setup.
- Add focused domain tests for every new calculation branch or boundary value.
