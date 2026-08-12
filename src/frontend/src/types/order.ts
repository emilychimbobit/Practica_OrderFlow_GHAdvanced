export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REOPEN';

export type CustomerTier = 'STANDARD' | 'GOLD' | 'VIP';

export interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  discount: number;
  status: OrderStatus;
  createdAt: string;
}

export interface CreateOrderRequest {
  customerEmail: string;
  customerTier: CustomerTier;
  items: OrderItem[];
}

export interface OrderResponse {
  id: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  discount: number;
  status: OrderStatus;
  createdAt: string;
}
