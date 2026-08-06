---
name: review-orderflow-change
description: Revisa los cambios actuales sin editarlos.
argument-hint: "[criterios de aceptaciÃ³n]"
agent: 'orderflow-reviewer'
---

Revisa el diff contra: `${input:criteria:Describe los criterios}`

Reporta hallazgos accionables por severidad con archivo, impacto, escenario, correcciÃ³n y prueba requerida. No modifiques archivos.