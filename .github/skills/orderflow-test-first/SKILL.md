---
name: orderflow-test-first
description: Ãšsala para implementar funcionalidades o correcciones de OrderFlow mediante pruebas incrementales.
---

1. Traduce criterios de aceptaciÃ³n en escenarios.
2. Selecciona el nivel correcto: domain, service, repository o http.
3. Escribe primero una prueba que falle por la razÃ³n esperada.
4. Implementa el cambio mÃ­nimo.
5. Refactoriza solo con cobertura.
6. No debilites aserciones ni elimines tests para obtener verde.
7. Ejecuta la prueba focalizada y despuÃ©s `npm test`.
8. Reporta escenarios cubiertos, no cubiertos y riesgos residuales.