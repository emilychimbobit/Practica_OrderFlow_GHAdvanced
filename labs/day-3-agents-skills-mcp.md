# Laboratorio DÃ­a 3 â€” Agents, Skills y MCP

## ValidaciÃ³n

1. Confirma los agentes `OrderFlow Planner`, `OrderFlow Implementer` y `OrderFlow Reviewer`.
2. Ejecuta `/analyze-orderflow-change` y verifica que utiliza `agent: ask`.
3. Ejecuta `/plan-orderflow-change` y compara anÃ¡lisis frente a planificaciÃ³n.
4. Invoca `/orderflow-domain-rules` y `/orderflow-test-first`.
5. Abre `.vscode/mcp.json`, inicia `github`, autentÃ­cate con OAuth y habilita solo las herramientas requeridas.
6. Ejecuta una consulta de solo lectura para listar ramas.
7. Usa el flujo analizar â†’ planificar â†’ implementar â†’ probar â†’ revisar.
8. Ejecuta `npm test` y revisa `git diff`.

## Requerimiento de prÃ¡ctica

Un pedido solo puede cancelarse si todavÃ­a no fue enviado. Un intento invÃ¡lido debe conservar el estado anterior y devolver un error consistente.

## Criterios de Ã©xito

- Planner y reviewer no editan.
- Implementer respeta el alcance.
- Las skills se cargan Ãºnicamente cuando son relevantes.
- MCP no almacena tokens.
- La suite de pruebas permanece estable.