---
agent: 'agent'
description: 'Ejecuta una revisión final antes del merge'
---

Realiza una revisión final del pull request asociado a la rama actual.

Evalúa:

1. Trazabilidad:
   - issue relacionado;
   - criterios de aceptación;
   - alcance del PR.
2. Arquitectura:
   - dependencias permitidas;
   - separación de capas;
   - contratos públicos;
   - cambios de persistencia.
3. Código:
   - correctitud;
   - legibilidad;
   - manejo de errores;
   - casos límite;
   - concurrencia y tiempo;
   - compatibilidad.
4. Seguridad:
   - secretos;
   - validación de entradas;
   - exposición de datos;
   - permisos;
   - dependencias.
5. Pruebas:
   - pruebas existentes;
   - escenarios negativos;
   - límites;
   - determinismo;
   - regresiones.
6. Git:
   - título del PR;
   - commits;
   - archivos fuera de alcance;
   - conflictos;
   - estado de checks y revisiones.

Clasifica cada hallazgo:

- `BLOCKER`
- `MAJOR`
- `MINOR`
- `SUGGESTION`

Entrega una conclusión:

- `APTO PARA MERGE`
- `APTO CON OBSERVACIONES`
- `NO APTO`

No apruebes ni hagas merge automáticamente. La decisión final debe permanecer en una persona autorizada.
