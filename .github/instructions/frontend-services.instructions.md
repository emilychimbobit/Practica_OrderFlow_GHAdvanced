---
applyTo: "src/frontend/src/services/**/*.ts"
---

# Frontend Services layer instructions

## Purpose
Services encapsulate **API integration logic** and **shared state handling**. They bridge frontend components with the OrderFlow backend API. Services are pure business logic with dependency injection for HTTP client.

## Rules

### Service Structure
- File naming: `camelCase.ts` (e.g., `orderService.ts`, `authService.ts`)
- Each service is a singleton module exporting functions (NOT classes)
- Functions are async and return typed data

### API Integration Pattern
```typescript
// services/orderService.ts

import { Order, CreateOrderRequest, OrderResponse } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const OrderService = {
  async fetchOrders(): Promise<Order[]> {
    const response = await fetch(`${API_BASE}/orders`);
    if (!response.ok) throw new Error(`Failed to fetch orders: ${response.status}`);
    const data = await response.json() as OrderResponse[];
    return data.map(mapOrderResponseToOrder);
  },

  async fetchOrderById(id: string): Promise<Order> {
    const response = await fetch(`${API_BASE}/orders/${id}`);
    if (response.status === 404) throw new NotFoundError(`Order ${id} not found`);
    if (!response.ok) throw new Error(`Failed to fetch order: ${response.status}`);
    return mapOrderResponseToOrder(await response.json());
  },

  async createOrder(request: CreateOrderRequest): Promise<Order> {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    if (response.status === 400) throw new ValidationError('Invalid order data');
    if (!response.ok) throw new Error(`Failed to create order: ${response.status}`);
    return mapOrderResponseToOrder(await response.json());
  }
};
```

### Error Handling
- Map HTTP status codes to domain errors:
  - `400` → `ValidationError` (invalid input)
  - `404` → `NotFoundError` (order not found)
  - `409` → `ConflictError` (invalid state transition)
  - `5xx` → `ServerError` (backend error)
- Create custom error classes:
  ```typescript
  export class ApiError extends Error {
    constructor(public status: number, message: string) {
      super(message);
      this.name = 'ApiError';
    }
  }
  ```

### Type Mapping
- Backend API returns raw JSON; services map to **typed** frontend models
- Example:
  ```typescript
  // Backend response: { id, customerEmail, items: [...], total, discount, status, createdAt }
  function mapOrderResponseToOrder(dto: OrderResponse): Order {
    return {
      id: dto.id,
      customerEmail: dto.customerEmail,
      items: dto.items.map(item => ({
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      })),
      total: parseFloat(dto.total),
      discountApplied: parseFloat(dto.discount),
      status: dto.status as OrderStatus,
      createdAt: new Date(dto.createdAt)
    };
  }
  ```

### No Business Logic
- ✅ Map API responses to types
- ✅ Build request payloads
- ✅ Handle HTTP errors
- ✅ Convert dates/numbers to frontend types
- ❌ **DO NOT:** Calculate totals or discounts (backend owns this)
- ❌ **DO NOT:** Validate business rules (e.g., "quantity > 0") — backend validates
- ❌ **DO NOT:** Implement authentication/authorization logic here (phase 2)

### Environment Variables
- API URL from `import.meta.env.VITE_API_BASE_URL`
- Default to `http://localhost:3000` for local development
- Never hardcode URLs in service
- Document required env vars in `.env.example`

### Testing
- Mock fetch calls, do NOT call real API in tests
- Test success and error paths
- Example:
  ```typescript
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches orders successfully', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ id: '1', total: 100, ...mockData }]
    });
    const orders = await OrderService.fetchOrders();
    expect(orders).toHaveLength(1);
  });

  it('throws NotFoundError on 404', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({})
    });
    await expect(OrderService.fetchOrderById('invalid')).rejects.toThrow(NotFoundError);
  });
  ```

### Imports & Dependencies
- Import types from `../types/`
- Import error classes from `../types/errors.ts`
- Do NOT import components or pages
- Minimal external dependencies (prefer native fetch, consider Axios only if explicitly needed)

### Folder Structure
```
services/
├── orderService.ts
├── utilities/
│   ├── apiClient.ts    (shared fetch wrapper)
│   └── errorHandler.ts (error mapping)
└── __tests__/
    └── orderService.test.ts
```

### API Assumptions
- Backend: `http://localhost:3000` (configurable)
- Endpoints:
  - `GET /health` — health check
  - `GET /orders` — list all orders
  - `GET /orders/:id` — get single order
  - `POST /orders` — create order (request body: `{ items, customerEmail, tier }`)
  - `POST /orders/:id/cancel` — cancel order
- All responses: `Content-Type: application/json`
- All timestamps: ISO 8601 format
