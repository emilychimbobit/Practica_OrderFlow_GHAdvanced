export const ORDER_STATUS = Object.freeze({
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  REOPEN: 'REOPEN'
});

export const CUSTOMER_TIER = Object.freeze({
  STANDARD: 'STANDARD',
  GOLD: 'GOLD',
  VIP: 'VIP'
});

export function calculateSubtotal(items) {
  return roundMoney(items.reduce((total, item) => {
    return total + item.quantity * item.unitPrice;
  }, 0));
}

export function calculateDiscount(subtotal, customerTier) {
  let discount = 0;

  if (customerTier === CUSTOMER_TIER.GOLD && subtotal >= 200) {
    discount = subtotal * 0.05;
  }

  if (customerTier === CUSTOMER_TIER.VIP && subtotal >= 500) {
    discount = subtotal * 0.1;
  }

  return Math.min(roundMoney(discount), 150);
}

export function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
