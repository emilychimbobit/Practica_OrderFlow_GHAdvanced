import test from 'node:test';
import assert from 'node:assert/strict';
import { InMemoryOrderRepository } from '../src/repositories/in-memory-order-repository.js';
import {
  InvalidOrderStateError,
  OrderService,
  ValidationError
} from '../src/services/order-service.js';

test('creates a pending order with normalized customer email', async () => {
  const service = new OrderService(new InMemoryOrderRepository());

  const order = await service.createOrder({
    customerEmail: '  User@Example.com ',
    customerTier: 'STANDARD',
    items: [{ sku: 'ABC-001', quantity: 2, unitPrice: 25 }]
  });

  assert.equal(order.customer.email, 'user@example.com');
  assert.equal(order.status, 'PENDING');
  assert.equal(order.total, 50);
});

test('assigns sequential numeric IDs and returns their sum', async () => {
  const service = new OrderService(new InMemoryOrderRepository());
  const input = {
    customerEmail: 'user@example.com',
    customerTier: 'STANDARD',
    items: [{ sku: 'ABC-001', quantity: 1, unitPrice: 25 }]
  };

  const firstOrder = await service.createOrder(input);
  const secondOrder = await service.createOrder(input);

  assert.equal(firstOrder.numericId, 1);
  assert.equal(secondOrder.numericId, 2);
  assert.equal(await service.sumOrderIds(), 3);
});

test('returns zero when summing numeric IDs from an empty repository', async () => {
  const service = new OrderService(new InMemoryOrderRepository());

  assert.equal(await service.sumOrderIds(), 0);
});

test('ignores legacy orders without a numeric ID when calculating IDs', async () => {
  const repository = new InMemoryOrderRepository([
    { id: 'legacy-order' },
    { id: 'numbered-order', numericId: 4 }
  ]);
  const service = new OrderService(repository);

  const order = await service.createOrder({
    customerEmail: 'user@example.com',
    customerTier: 'STANDARD',
    items: [{ sku: 'ABC-001', quantity: 1, unitPrice: 25 }]
  });

  assert.equal(order.numericId, 5);
  assert.equal(await service.sumOrderIds(), 9);
});

test('rejects an order without items', async () => {
  const service = new OrderService(new InMemoryOrderRepository());

  await assert.rejects(
    service.createOrder({
      customerEmail: 'user@example.com',
      customerTier: 'STANDARD',
      items: []
    }),
    ValidationError
  );
});

test('does not cancel a confirmed order', async () => {
  const repository = new InMemoryOrderRepository([
    {
      id: 'order-1',
      customer: { email: 'user@example.com', tier: 'STANDARD' },
      items: [{ sku: 'ABC-001', quantity: 1, unitPrice: 20 }],
      subtotal: 20,
      discount: 0,
      total: 20,
      status: 'CONFIRMED',
      createdAt: '2026-08-01T10:00:00.000Z',
      cancelledAt: null
    }
  ]);
  const service = new OrderService(repository);

  await assert.rejects(service.cancelOrder('order-1'), InvalidOrderStateError);
});
