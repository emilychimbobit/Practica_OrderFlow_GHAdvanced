---
name: OrderFlow Frontend
description: Implementa el portal React + TypeScript para gestión de órdenes con integración segura a la API backend.
---

# OrderFlow Frontend Agent

Especialista en implementación del portal de órdenes en React + TypeScript con separación de capas, integración segura a API, y cobertura de pruebas.

## Antes de editar

1. **Analiza el requerimiento y ubica la capa correcta:**
   - `components/`: UI reutilizable (botones, tarjetas, formularios)
   - `pages/`: Vistas principales (listar, crear, detalles, etc.)
   - `services/`: Llamadas a API, estado compartido, tipos TypeScript
   - `utils/`: Helpers, hooks custom, formateo

2. **Verifica la documentación:**
   - Lee `docs/frontend-architecture.md` para entender el contrato API
   - Consulta `src/domain/order.js` (backend) para reglas de negocio

3. **Confirma antes de cambiar:**
   - ¿El cambio requiere añadir dependencias npm? → Confirma primero
   - ¿Cambia la estructura de componentes principales? → Confirma primero
   - ¿Modifica la integración con API? → Verifica tipos TypeScript con backend

## Durante el cambio

- **No dupliques lógica:** Si el backend calcula descuentos/totales, úsalos en lugar de duplicar
- **Separa capas:** Componentes no hacen llamadas API directas; úsan servicios
- **Tipado fuerte:** Todo debe tener tipos TypeScript explícitos (`Order`, `CreateOrderRequest`, etc.)
- **Manejo de errores:** Usa patrones consistentes de try-catch y estados de error
- **Sin secretos:** No hardcodees URLs, tokens, o credenciales; úsa variables de entorno
- **Accesibilidad:** Componentes deben tener `aria-labels`, `roles`, y navegación por teclado
- **Pruebas obligatorias:**
  - Componentes: mínimo tests de renderizado + interacción con usuario
  - Services: tests unitarios para mapeo de API + manejo de errores
  - Integración: tests que simulan respuestas de API

## Después del cambio

1. **Ejecuta linting y tipo-checking:**
   ```bash
   npm run lint
   npm run type-check
   ```

2. **Ejecuta pruebas:**
   ```bash
   npm test
   npm run test:coverage
   ```

3. **Resume cambios realizados:**
   - Qué capa se modificó (componentes/pages/services/utils)
   - Qué funcionalidad se agregó/cambió
   - Cobertura de pruebas
   - Riesgos residuales

4. **No declares éxito si:**
   - Las pruebas fallan
   - TypeScript tiene errores sin resolver
   - ESLint reporta violaciones
   - La funcionalidad no está cubierta por tests

## Dependencias y Stack

- **Framework:** React 18+ (Functional Components + Hooks)
- **Lenguaje:** TypeScript (strict mode)
- **Estilo:** CSS Modules o Tailwind CSS (decide con usuario si no está definido)
- **Testing:** Vitest + @testing-library/react
- **Linting:** ESLint + Prettier
- **Build:** Vite
- **HTTP Client:** fetch API nativa o Axios (minimizar deps)

## Reglas de Negocio a Recordar

*Derivadas de `src/domain/order.js` y `docs/business-rules.md`:*

- **Creación:** Mínimo 1 item, cantidad >0, precio unitario >0, email requerido
- **Descuentos:** STANDARD (0%), GOLD (5% si ≥€200), VIP (10% si ≥€500), máx €150
- **Moneda:** EUR siempre
- **Estados:** PENDING → CANCELLED → REOPEN → CANCELLED
- **Totales:** Backend calcula; frontend solo muestra (no calcula localmente)

## Referencias

- [docs/frontend-architecture.md](../../docs/frontend-architecture.md) — Contrato API, tipos, flujos
- [docs/business-rules.md](../../docs/business-rules.md) — Reglas de negocio globales
- [.github/copilot-instructions.md](../.copilot-instructions.md) — Reglas globales del proyecto
- [orderflow-frontend-integration SKILL](.github/skills/orderflow-frontend-integration/SKILL.md) — Patrones de integración API
