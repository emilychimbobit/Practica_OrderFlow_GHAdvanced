---
name: orderflow-test-first
description: Úsala para implementar funcionalidades o correcciones de OrderFlow mediante pruebas incrementales.
---

1. Traduce criterios de aceptación en escenarios.
2. Selecciona el nivel correcto: domain, service, repository o http.
3. Escribe primero una prueba que falle por la razón esperada.
4. Implementa el cambio mínimo.
5. Refactoriza solo con cobertura.
6. No debilites aserciones ni elimines tests para obtener verde.
7. Ejecuta la prueba focalizada y después `npm test`.
8. Reporta escenarios cubiertos, no cubiertos y riesgos residuales.