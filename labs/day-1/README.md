# Laboratorio Día 1 — Context Engineering y Spec-Driven Development

## Parte A — Reconocimiento del repositorio

Solicita a Copilot que analice el repositorio y entregue:

1. Mapa de componentes y dependencias.
2. Reglas de negocio detectadas.
3. Riesgos técnicos y contradicciones.
4. Archivos relevantes para el requerimiento.
5. Información faltante que impide implementar con seguridad.

No aceptes una respuesta que no cite archivos concretos.

## Parte B — Convertir ambigüedad en especificación

Usa `requirements/day-1-ambiguous-request.md` y genera:

- Preguntas para negocio.
- Supuestos provisionales claramente marcados.
- Criterios de aceptación en formato Given/When/Then.
- Casos límite.
- Contrato de datos propuesto.
- Plan de implementación por archivos.
- Estrategia de pruebas.

## Parte C — Implementación controlada

La instructora entregará la especificación clarificada. Después:

1. Pide a Copilot un plan antes de editar.
2. Limita explícitamente los archivos permitidos.
3. Implementa el cambio en pasos pequeños.
4. Ejecuta las pruebas después de cada cambio relevante.
5. Revisa el diff y solicita a Copilot una autocrítica.
6. Verifica manualmente los criterios de aceptación.

## Evidencias esperadas

- Prompt utilizado.
- Plan producido.
- Lista de supuestos descartados o confirmados.
- Diff final.
- Resultado de pruebas.
- Breve reflexión sobre qué contexto mejoró la respuesta.
