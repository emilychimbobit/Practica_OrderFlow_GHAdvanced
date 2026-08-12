---
name: orderflow-frontend-integration
description: Úsala para integrar el frontend React con la API OrderFlow, mapear tipos, manejar errores y ubicar llamadas fetch en la capa de servicios.
---

# OrderFlow Frontend-API Integration SKILL

Patrón seguro de integración del frontend React con la API OrderFlow backend.

## Cuándo usar este skill

- Integrar frontend con endpoints OrderFlow
- Mapear respuestas API a tipos TypeScript
- Manejar errores de API de forma consistente
- Configurar comunicación entre componentes → páginas → servicios → API
- Cambios que afecten la capa `services/`

## Contrato API Backend

### Base URL
```
http://localhost:3000  (desarrollo)
Configurable vía VITE_API_BASE_URL
```
Siempre validar si es el puerto correcto y si la API está corriendo antes de hacer fetch.

### Response Schema (Backend)

```typescript
// Respuesta de GET /orders o GET /orders/:id
{
  "id": "uuid",
  "customerEmail": "user@example.com",
  "items": [
    {
      "productName": "Widget A",
      "quantity": 2,
      "unitPrice": "100.50"  // String de EUR
    }
  ],
  "total": "201.00",        // String, ya incluye descuento
  "discount": "0.00",       // String
  "status": "PENDING",      // "PENDING" | "CANCELLED" | "REOPEN"
  "createdAt": "2024-01-15T10:30:00Z"  // ISO 8601
}
```

### Request Schema (Frontend)

```typescript
interface CreateOrderRequest {
  items: Array<{
    productName: string;
    quantity: number;        // Integer > 0
    unitPrice: number;       // Number > 0
  }>;
  customerEmail: string;     // Valid email
  tier: "STANDARD" | "GOLD" | "VIP";  // Customer tier for discount
}
```

## Patrón de Servicio Seguro

### 1. Mapeo de Tipos (Response → Frontend Model)

```typescript
// types/index.ts
export type OrderStatus = "PENDING" | "CANCELLED" | "REOPEN";

export interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number; // Already a number, not string
}

export interface Order {
  id: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;      // Parsed from string
  discountApplied: number;
  status: OrderStatus;
  createdAt: Date;    // Converted from ISO string
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

// services/mappers.ts
export function mapApiOrderToOrder(dto: any): Order {
  return {
    id: dto.id,
    customerEmail: dto.customerEmail,
    items: dto.items.map((item: any) => ({
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: parseFloat(item.unitPrice)
    })),
    total: parseFloat(dto.total),
    discountApplied: parseFloat(dto.discount),
    status: dto.status as OrderStatus,
    createdAt: new Date(dto.createdAt)
  };
}
```

### 2. Manejo de Errores

```typescript
// types/errors.ts
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super(400, message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string) {
    super(404, `${resource} not found`);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends ApiError {
  constructor(message: string) {
    super(409, message);
    this.name = 'ConflictError';
  }
}

// services/orderService.ts
async function handleApiResponse(response: Response) {
  const contentType = response.headers.get('content-type');
  let data: any;
  
  if (contentType?.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    switch (response.status) {
      case 400:
        throw new ValidationError(data.message || 'Invalid request');
      case 404:
        throw new NotFoundError('Order');
      case 409:
        throw new ConflictError(data.message || 'Conflict');
      default:
        throw new ApiError(response.status, `Server error: ${response.status}`, data);
    }
  }

  return data;
}
```

### 3. Llamadas API (No duplicar en componentes)

```typescript
// services/orderService.ts
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const OrderService = {
  async fetchOrders(): Promise<Order[]> {
    try {
      const response = await fetch(`${API_BASE}/orders`);
      const data = await handleApiResponse(response);
      return data.map(mapApiOrderToOrder);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      throw error;
    }
  },

  async fetchOrderById(id: string): Promise<Order> {
    try {
      const response = await fetch(`${API_BASE}/orders/${id}`);
      const data = await handleApiResponse(response);
      return mapApiOrderToOrder(data);
    } catch (error) {
      console.error(`Failed to fetch order ${id}:`, error);
      throw error;
    }
  },

  async createOrder(request: CreateOrderRequest): Promise<Order> {
    try {
      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
      const data = await handleApiResponse(response);
      return mapApiOrderToOrder(data);
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  },

  async cancelOrder(id: string): Promise<Order> {
    try {
      const response = await fetch(`${API_BASE}/orders/${id}/cancel`, {
        method: 'POST'
      });
      const data = await handleApiResponse(response);
      return mapApiOrderToOrder(data);
    } catch (error) {
      console.error(`Failed to cancel order ${id}:`, error);
      throw error;
    }
  }
};
```

### 4. Uso en Páginas (NO en Componentes)

```typescript
// pages/OrderListPage.tsx
export const OrderListPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await OrderService.fetchOrders();
        setOrders(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert error={error} />;
  return <OrderList orders={orders} />;
};
```

## Reglas de Integración

### CORRECTO
- Servicios llaman API y mapean tipos
- Páginas usan servicios y manejan loading/error/success
- Componentes reciben datos vía props
- Errores de API se lanzan en servicios, se capturan en páginas
- URLs de API en variables de entorno

### INCORRECTO
- Componentes llaman `fetch()` directamente
- Componentes llaman servicios sin pasar por página
- URLs hardcodeadas en componentes
- Errores crudos de API mostrados a usuarios
- Servicios calculan lógica de negocio (totales, descuentos)

## Testing de Integración

```typescript
// services/__tests__/orderService.test.ts
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { OrderService } from '../orderService';
import { ValidationError, NotFoundError } from '../../types/errors';

describe('OrderService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('fetches orders successfully', async () => {
    const mockResponse = [
      {
        id: '123',
        customerEmail: 'user@example.com',
        items: [{ productName: 'Widget', quantity: 1, unitPrice: '100.00' }],
        total: '100.00',
        discount: '0.00',
        status: 'PENDING',
        createdAt: '2024-01-01T00:00:00Z'
      }
    ];
    
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => mockResponse
    } as any);

    const orders = await OrderService.fetchOrders();
    expect(orders).toHaveLength(1);
    expect(orders[0].id).toBe('123');
    expect(orders[0].total).toBe(100);
  });

  it('throws ValidationError on 400', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      status: 400,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ message: 'Invalid email' })
    } as any);

    await expect(
      OrderService.createOrder({
        items: [],
        customerEmail: 'invalid',
        tier: 'STANDARD'
      })
    ).rejects.toThrow(ValidationError);
  });
});
```

## Configuración de Variables de Entorno

```bash
# .env.development (local dev)
VITE_API_BASE_URL=http://localhost:3000

# .env.production (deployed)
VITE_API_BASE_URL=https://api.orderflow.example.com
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    __API_BASE__: JSON.stringify(process.env.VITE_API_BASE_URL || 'http://localhost:3000')
  }
});
```

## Notas de Seguridad

- Variables de entorno para URLs de API
- Validar email/datos en frontend (UX), backend valida (seguridad)
- Nunca loguear datos sensibles
- HTTPS en producción
- No hardcodear URLs
- No exponer tokens/credenciales en frontend (phase 2)
- No confiar en validación frontend solamente
