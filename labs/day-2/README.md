# Día 2 — Personalización avanzada de GitHub Copilot

## Objetivo

Construir un Copilot Enablement Pack para OrderFlow usando instrucciones globales, instrucciones por ruta, `AGENTS.md`, prompt files y un blueprint de Copilot Space.

## Requisitos

- Node.js 20 o superior
- GitHub Copilot habilitado
- VS Code recomendado para la demostración de prompt files
- Repositorio OrderFlow abierto desde su carpeta raíz

## Secuencia de laboratorio

### Laboratorio 1 — Instrucciones globales

Crear `.github/copilot-instructions.md`.

Debe cubrir:

- propósito y runtime;
- arquitectura;
- comandos;
- restricciones;
- estrategia de pruebas;
- Definition of Done;
- límites que requieren aprobación humana.

Validación en Copilot Chat:

> Resume las reglas globales de este repositorio. Separa arquitectura, validación, restricciones y Definition of Done. No escribas código.

### Laboratorio 2 — Instrucciones por ruta

Crear:

- `.github/instructions/domain.instructions.md`
- `.github/instructions/services.instructions.md`
- `.github/instructions/http.instructions.md`
- `.github/instructions/tests.instructions.md`

Validación:

> Voy a implementar prioridad de pedidos. Antes de escribir código, dime qué reglas globales y específicas por ruta aplicarían si modificas `src/domain/order.js`, `src/services/order-service.js`, `src/http/server.js` y `tests/order-domain.test.js`.

### Laboratorio 3 — AGENTS.md

Crear `AGENTS.md` con acciones obligatorias antes, durante y después de cambiar código.

Validación:

> Según `AGENTS.md`, ¿qué debes hacer antes de modificar `src/services/order-service.js` y en qué situaciones debes pedir confirmación humana?

### Laboratorio 4 — Prompt files

Crear:

- `.github/prompts/analyze-requirement.prompt.md`
- `.github/prompts/implement-priority.prompt.md`

Ejecutar primero `/analyze-requirement` con `requirements/day-1-ambiguous-request.md`.

No ejecutar implementación mientras el resultado sea `NOT READY`.

Después de revisar la especificación clarificada, ejecutar `/implement-priority`.

### Laboratorio 5 — Copilot Space

Completar `docs/copilot-space-blueprint.md` y definir:

- nombre;
- audiencia;
- fuentes;
- instrucciones;
- preguntas de validación;
- propietario y mantenimiento.

## Entregable

```text
.github/
├── copilot-instructions.md
├── instructions/
│   ├── domain.instructions.md
│   ├── services.instructions.md
│   ├── http.instructions.md
│   └── tests.instructions.md
└── prompts/
    ├── analyze-requirement.prompt.md
    └── implement-priority.prompt.md

AGENTS.md
docs/copilot-space-blueprint.md
```

## Criterios de revisión

- Las reglas son accionables y verificables.
- No existen contradicciones entre archivos.
- Las instrucciones globales no contienen detalles exclusivos de una sola capa.
- Cada `applyTo` coincide con la ruta correcta.
- `AGENTS.md` define comportamiento operativo y confirmación humana.
- Los prompts separan análisis e implementación.
- Ningún archivo contiene secretos o información sensible.
