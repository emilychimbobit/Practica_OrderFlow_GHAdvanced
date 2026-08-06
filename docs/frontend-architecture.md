# Frontend Architecture - OrderFlow Portal

## Overview

El portal OrderFlow es una aplicación React + TypeScript que permite a usuarios visualizar, crear y gestionar órdenes. Integra con la API backend OrderFlow a través de una capa de servicios tipada.

**Stack:**
- **Framework:** React 18+ (Functional Components, Hooks)
- **Lenguaje:** TypeScript (strict mode)
- **Estilos:** CSS Modules / Tailwind CSS
- **Testing:** Vitest + @testing-library/react
- **Build:** Vite
- **API Client:** Fetch API nativa

## Arquitectura de Capas

```
┌─────────────────────────────────────────┐
│  Pages (Rutas, orquestación)            │
│  ├─ OrderListPage                       │
│  ├─ CreateOrderPage                     │
│  └─ OrderDetailsPage                    │
└────────────────┬────────────────────────┘
                 │ (importa)
┌────────────────▼────────────────────────┐
│  Components (UI puro, sin lógica)       │
│  ├─ OrderCard, OrderTable               │
│  ├─ CreateOrderForm                     │
│  └─ ErrorAlert, LoadingSpinner          │
└────────────────┬────────────────────────┘
                 │ (recibe props)
┌────────────────▼────────────────────────┐
│  Services (Integración API + mapeo)     │
│  └─ OrderService                        │
│     ├─ fetchOrders()                    │
│     ├─ fetchOrderById(id)               │
│     ├─ createOrder(request)             │
│     └─ cancelOrder(id)                  │
└────────────────┬────────────────────────┘
                 │ (llamadas HTTP)
┌────────────────▼────────────────────────┐
│  API Backend (Node.js, puerto 3000)     │
│  GET  /orders                           │
│  GET  /orders/:id                       │
│  POST /orders                           │
│  POST /orders/:id/cancel                │
└─────────────────────────────────────────┘
```

## Responsabilidades por Capa

### Pages Layer
- **Propósito:** Orquestación, manejo de rutas y estado de página
- **Responsabilidades:**
  - Montaje de componentes
  - Fetch de datos via servicios (useEffect)
  - Gestión de loading/error/success states
  - Event handlers que llaman servicios
  - Navegación entre rutas
- **Ejemplos:**
  - `OrderListPage` — lista órdenes con filtros
  - `CreateOrderPage` — formulario de creación
  - `OrderDetailsPage` — vista detallada de orden

### Components Layer
- **Propósito:** Renderizado de UI, ninguna lógica de negocio
- **Responsabilidades:**
  - Recibir datos vía props (no los buscan)
  - Emitir eventos via callbacks de props
  - Manejar interacción local (focus, hover, etc.)
  - Accesibilidad (aria-labels, roles)
  - Estilo y layout
- **Ejemplos:**
  - `OrderCard` — tarjeta de orden
  - `OrderTable` — tabla de órdenes
  - `CreateOrderForm` — formulario con validación UX
  - `Button`, `Input`, `Modal` — componentes comunes

### Services Layer
- **Propósito:** Integración con API backend
- **Responsabilidades:**
  - Llamadas HTTP (fetch)
  - Mapeo de respuestas API → tipos TypeScript
  - Manejo de errores HTTP → excepciones tipadas
  - Cachado (si es necesario)
  - **NO:** lógica de negocio (cálculos, validaciones complejas)
- **Ejemplo:**
  ```typescript
  OrderService.fetchOrders()  // GET /orders, mapea a Order[]
  OrderService.createOrder(request)  // POST /orders, mapea respuesta
  OrderService.cancelOrder(id)  // POST /orders/:id/cancel
  ```

### Utils & Hooks
- **Propósito:** Funciones reutilizables sin estado (utils) o con estado (hooks)
- **Ejemplos:**
  - `formatCurrency(100)` → "100,00 €"
  - `formatDate(new Date())` → "15.01.2024"
  - `isValidEmail(email)` → boolean
  - `useOrderForm()` → hook para estado de formulario
  - `useFetch(url)` → hook genérico de fetch

## Tipos TypeScript Principales

```typescript
// Derivados del backend (src/domain/order.js)
export type OrderStatus = "PENDING" | "CANCELLED" | "REOPEN";

export interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;  // EUR
}

export interface Order {
  id: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;  // EUR, ya con descuento
  discountApplied: number;  // EUR
  status: OrderStatus;
  createdAt: Date;
}

export interface CreateOrderRequest {
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
  customerEmail: string;
  tier: "STANDARD" | "GOLD" | "VIP";
}

// Error types
export class ApiError extends Error {
  constructor(status: number, message: string) { ... }
}
export class ValidationError extends ApiError { ... }
export class NotFoundError extends ApiError { ... }
```

## Flujos Principales

### 1. Listar Órdenes

```
User abre /orders
   ↓
OrderListPage monta
   ↓ useEffect
OrderService.fetchOrders() llamada
   ↓ fetch GET /orders
Backend responde [Order1, Order2, ...]
   ↓ mapApiOrderToOrder
Order[] tipadas en estado
   ↓ render
OrderTable recibe orders vía props
   ↓
Usuario ve tabla de órdenes
```

### 2. Crear Orden

```
User abre /orders/create
   ↓
CreateOrderPage monta
   ↓
CreateOrderForm recibe handleSubmit vía props
   ↓ user llena formulario y presiona submit
handleSubmit(formData) ejecutado en página
   ↓
OrderService.createOrder(formData) llamada
   ↓ fetch POST /orders
Backend crea orden, responde Order
   ↓
Page navega a /orders/:id
   ↓
Usuario ve orden creada
```

### 3. Cancelar Orden

```
User ve OrderCard con botón "Cancel"
   ↓
onClick → handleCancel callback ejecutado
   ↓ en página
OrderService.cancelOrder(id) llamada
   ↓ fetch POST /orders/:id/cancel
Backend cancela, responde Order actualizado
   ↓
Estado actualizado, componente re-renderiza
   ↓
Usuario ve status = "CANCELLED"
```

## Integración con Backend API

### Base URL
```
Desarrollo: http://localhost:3000
Producción: (variable de entorno VITE_API_BASE_URL)
```

### Endpoints Consumidos
- `GET /health` — health check
- `GET /orders` — lista todas las órdenes
- `GET /orders/:id` — obtiene orden por ID
- `POST /orders` — crea nueva orden
- `POST /orders/:id/cancel` — cancela orden

### Esquema de Respuesta (Backend)
```json
{
  "id": "uuid",
  "customerEmail": "user@example.com",
  "items": [
    { "productName": "...", "quantity": 2, "unitPrice": "100.50" }
  ],
  "total": "201.00",
  "discount": "0.00",
  "status": "PENDING",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Mapeo Frontend
```
Backend string "100.50" → Frontend number 100.50
Backend ISO timestamp → Frontend Date object
Backend response → Frontend Order (tipado)
```

## Estructura de Carpetas

```
src/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   └── LoadingSpinner.tsx
│   │   │   ├── orders/
│   │   │   │   ├── OrderCard.tsx
│   │   │   │   ├── OrderTable.tsx
│   │   │   │   └── OrderDetails.tsx
│   │   │   └── forms/
│   │   │       └── CreateOrderForm.tsx
│   │   ├── pages/
│   │   │   ├── OrderListPage.tsx
│   │   │   ├── CreateOrderPage.tsx
│   │   │   ├── OrderDetailsPage.tsx
│   │   │   └── hooks/
│   │   │       └── useOrderForm.ts
│   │   ├── services/
│   │   │   ├── orderService.ts
│   │   │   ├── mappers.ts
│   │   │   └── __tests__/
│   │   │       └── orderService.test.ts
│   │   ├── types/
│   │   │   ├── index.ts
│   │   │   └── errors.ts
│   │   ├── utils/
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   ├── constants.ts
│   │   │   └── hooks/
│   │   │       ├── useFetch.ts
│   │   │       └── useDebounce.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   │   └── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.example
```

## Reglas de Arquitectura

### ✅ Permitido
- Componentes reciben datos vía props
- Páginas llaman servicios en useEffect
- Servicios llaman API y mapean tipos
- Utils exportan funciones puras
- Hooks manejan estado local reutilizable

### ❌ Prohibido
- Componentes llaman API directamente
- Servicios contienen lógica de negocio de dominio (cálculos, validaciones complejas)
- Páginas llaman componentes en loop (causa re-renderizados)
- Circular imports entre capas
- Hardcodear URLs de API
- Props como `any` sin tipado

## Testing Strategy

### Por Capa

**Components (renderizado + interacción)**
```typescript
render(<OrderCard order={mockOrder} onCancel={vi.fn()} />);
expect(screen.getByText('Order #...')).toBeInTheDocument();
await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
expect(onCancel).toHaveBeenCalled();
```

**Pages (orquestación + estado)**
```typescript
vi.mock('../services/orderService');
render(<OrderListPage />);
await waitFor(() => expect(screen.getByText(/order #/i)).toBeInTheDocument());
// Verifica que OrderService fue llamado y componentes renderizados
```

**Services (API mapping + errores)**
```typescript
vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => mockData });
const orders = await OrderService.fetchOrders();
expect(orders[0].total).toBe(100);  // Verifica mapeo de tipos
```

## Consideraciones de Producción

### Fase 1 (Actual)
- ✅ Portal básico sin autenticación
- ✅ API pública en localhost:3000
- ✅ Errores genéricos mostrados

### Fase 2 (Future)
- 🔄 Autenticación OAuth2 / Entra ID
- 🔄 JWT tokens en requests
- 🔄 Caching de órdenes
- 🔄 Notificaciones en tiempo real (WebSocket)
- 🔄 Paginación y filtros avanzados

## Variables de Entorno

```bash
# .env.development (local)
VITE_API_BASE_URL=http://localhost:3000

# .env.staging
VITE_API_BASE_URL=https://api-staging.orderflow.example.com

# .env.production
VITE_API_BASE_URL=https://api.orderflow.example.com
```

## Performance

- Componentes: React.memo si es necesario (no por defecto)
- Hooks: useCallback para callbacks estables
- Servicios: No cachado por ahora (agregar si es necesario)
- Build: Vite genera bundles optimizados (code-splitting automático)

---

**Última actualización:** 2025-01-15  
**Creado por:** OrderFlow Frontend Agent
