import { randomUUID } from 'node:crypto';
import {
  CUSTOMER_TIER,
  ORDER_STATUS,
  calculateDiscount,
  calculateSubtotal,
  roundMoney
} from '../domain/order.js';

export class OrderService {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async listOrders() {
    return this.orderRepository.list();
  }

  async getOrder(id) {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new OrderNotFoundError(id);
    }

    return order;
  }

  async createOrder(input) {
    validateCreateOrderInput(input);

    const subtotal = calculateSubtotal(input.items);
    const discount = calculateDiscount(subtotal, input.customerTier);
    const orders = await this.orderRepository.list();
    const numericId = orders.reduce((highestId, order) => {
      return isValidNumericId(order.numericId)
        ? Math.max(highestId, order.numericId)
        : highestId;
    }, 0) + 1;

    const order = {
      id: randomUUID(),
      numericId,
      customer: {
        email: input.customerEmail.trim().toLowerCase(),
        tier: input.customerTier
      },
      items: input.items.map((item) => ({ ...item })),
      subtotal,
      discount,
      total: roundMoney(subtotal - discount),
      status: ORDER_STATUS.PENDING,
      createdAt: new Date().toISOString(),
      cancelledAt: null
    };

    return this.orderRepository.save(order);
  }

  async sumOrderIds() {
    const orders = await this.orderRepository.list();

    return orders.reduce((total, order) => {
      return isValidNumericId(order.numericId) ? total + order.numericId : total;
    }, 0);
  }

  async cancelOrder(id) {
    const order = await this.getOrder(id);

    if (order.status !== ORDER_STATUS.PENDING) {
      throw new InvalidOrderStateError(
        `Order ${id} cannot be cancelled from status ${order.status}`
      );
    }

    order.status = ORDER_STATUS.CANCELLED;
    order.cancelledAt = new Date().toISOString();

    return this.orderRepository.save(order);
  }
}

export class OrderNotFoundError extends Error {
  constructor(id) {
    super(`Order ${id} was not found`);
    this.name = 'OrderNotFoundError';
  }
}

export class InvalidOrderStateError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidOrderStateError';
  }
}

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

function isValidNumericId(numericId) {
  return Number.isSafeInteger(numericId) && numericId > 0;
}

function validateCreateOrderInput(input) {
  if (!input || typeof input !== 'object') {
    throw new ValidationError('Request body is required');
  }

  if (!input.customerEmail || !input.customerEmail.includes('@')) {
    throw new ValidationError('A valid customerEmail is required');
  }

  if (!Object.values(CUSTOMER_TIER).includes(input.customerTier)) {
    throw new ValidationError('customerTier is invalid');
  }

  if (!Array.isArray(input.items) || input.items.length === 0) {
    throw new ValidationError('At least one item is required');
  }

  for (const item of input.items) {
    if (!item.sku || typeof item.sku !== 'string') {
      throw new ValidationError('Each item requires a sku');
    }

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new ValidationError('Item quantity must be a positive integer');
    }

    if (typeof item.unitPrice !== 'number' || item.unitPrice <= 0) {
      throw new ValidationError('Item unitPrice must be greater than zero');
    }
  }
}
