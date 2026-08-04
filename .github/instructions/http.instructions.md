---
applyTo: "src/http/**/*.js"
---

# HTTP layer instructions

- Limit this layer to routing, request parsing, response serialization, and error translation.
- Depend on services for order operations; never call repositories for business workflows.
- Keep business validation and calculations out of route handlers.
- Use the built-in `node:http` server unless a framework change is explicitly approved.
- Return JSON with `application/json; charset=utf-8` for every response path.
- Convert malformed JSON to `ValidationError`; let services validate business input.
- Preserve routes, payload shapes, and status semantics unless explicitly approved.
- Map known service errors consistently: validation 400, missing order 404, invalid state 409.
- Log unexpected errors internally and expose only the generic 500 response.
