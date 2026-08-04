import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CUSTOMER_TIER,
  calculateDiscount,
  calculateSubtotal
} from '../src/domain/order.js';

test('calculates subtotal from all items', () => {
  const subtotal = calculateSubtotal([
    { quantity: 2, unitPrice: 10.5 },
    { quantity: 1, unitPrice: 5 }
  ]);

  assert.equal(subtotal, 26);
});

test('applies GOLD discount when threshold is reached', () => {
  assert.equal(calculateDiscount(200, CUSTOMER_TIER.GOLD), 10);
});

test('does not apply GOLD discount below threshold', () => {
  assert.equal(calculateDiscount(199.99, CUSTOMER_TIER.GOLD), 0);
});

test('caps discount at 150 dollars', () => {
  assert.equal(calculateDiscount(3000, CUSTOMER_TIER.VIP), 150);
});
