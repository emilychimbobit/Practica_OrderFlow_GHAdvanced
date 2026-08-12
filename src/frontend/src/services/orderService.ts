import { Order, CreateOrderRequest, OrderResponse } from '../types/order';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
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
  constructor(message: string) {
    super(404, message);
    this.name = 'NotFoundError';
  }
}

function mapOrderResponseToOrder(dto: OrderResponse): Order {
  return {
    id: dto.id,
    customerEmail: dto.customerEmail,
    items: dto.items,
    total: typeof dto.total === 'string' ? parseFloat(dto.total) : dto.total,
    discount: typeof dto.discount === 'string' ? parseFloat(dto.discount) : dto.discount,
    status: dto.status,
    createdAt: dto.createdAt
  };
}

export const OrderService = {
  async fetchOrders(): Promise<Order[]> {
    const response = await fetch(`${API_BASE}/orders`);
    if (!response.ok) {
      throw new ApiError(response.status, `Failed to fetch orders: ${response.status}`);
    }
    const data = (await response.json()) as OrderResponse[];
    return data.map(mapOrderResponseToOrder);
  },

  async fetchOrderById(id: string): Promise<Order> {
    const response = await fetch(`${API_BASE}/orders/${id}`);
    if (response.status === 404) {
      throw new NotFoundError(`Order ${id} not found`);
    }
    if (!response.ok) {
      throw new ApiError(response.status, `Failed to fetch order: ${response.status}`);
    }
    return mapOrderResponseToOrder(await response.json());
  },

  async createOrder(request: CreateOrderRequest): Promise<Order> {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    if (response.status === 400) {
      const errorData = (await response.json()) as { error: string };
      throw new ValidationError(errorData.error || 'Invalid order data');
    }
    if (!response.ok) {
      throw new ApiError(response.status, `Failed to create order: ${response.status}`);
    }
    return mapOrderResponseToOrder(await response.json());
  },

  async cancelOrder(id: string): Promise<Order> {
    const response = await fetch(`${API_BASE}/orders/${id}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.status === 404) {
      throw new NotFoundError(`Order ${id} not found`);
    }
    if (response.status === 409) {
      const errorData = (await response.json()) as { error: string };
      throw new ApiError(409, errorData.error || 'Invalid order state transition');
    }
    if (!response.ok) {
      throw new ApiError(response.status, `Failed to cancel order: ${response.status}`);
    }
    return mapOrderResponseToOrder(await response.json());
  }
};
