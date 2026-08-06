---
applyTo: "src/frontend/src/utils/**/*.ts, src/frontend/src/hooks/**/*.ts"
---

# Frontend Utils & Hooks layer instructions

## Purpose
Reusable utilities and custom hooks that provide formatting, validation, and stateful logic to components without being full services.

## Rules

### Utilities (Pure Functions)

**File naming:** `camelCase.ts` (e.g., `formatters.ts`, `validators.ts`, `constants.ts`)

**Examples:**

```typescript
// formatters.ts
export function formatCurrency(value: number, locale = 'de-DE'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('de-DE');
}

export function formatOrderStatus(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    PENDING: 'Pendiente',
    CANCELLED: 'Cancelada',
    REOPEN: 'Reabierta'
  };
  return labels[status] || status;
}

// validators.ts
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidQuantity(qty: any): qty is number {
  return Number.isInteger(qty) && qty > 0;
}

// constants.ts
export const DISCOUNT_TIERS = {
  STANDARD: { threshold: 0, rate: 0 },
  GOLD: { threshold: 200, rate: 5 },
  VIP: { threshold: 500, rate: 10 }
} as const;

export const ORDER_STATUSES = ['PENDING', 'CANCELLED', 'REOPEN'] as const;
```

**Rules:**
- ✅ Pure functions (no side effects, no state)
- ✅ Take explicit parameters, return values deterministically
- ✅ Export from `utils/` folder, not from page/component files
- ✅ Include TypeScript types
- ❌ DO NOT call API or services
- ❌ DO NOT rely on React or component context

### Custom Hooks

**File naming:** `use{HookName}.ts` (e.g., `useOrderForm.ts`, `useFetch.ts`)

**Location:** `pages/hooks/` or `utils/hooks/` (keep close to where used)

**Example:**

```typescript
// hooks/useOrderForm.ts
import { useState, useCallback } from 'react';
import { CreateOrderRequest } from '../types';
import { isValidEmail, isValidQuantity } from '../utils/validators';

export interface UseOrderFormReturn {
  formData: CreateOrderRequest;
  updateItem: (index: number, field: string, value: any) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
  updateEmail: (email: string) => void;
  errors: Record<string, string>;
  isValid: () => boolean;
  reset: () => void;
}

const initialFormData: CreateOrderRequest = {
  items: [{ productName: '', quantity: 1, unitPrice: 0 }],
  customerEmail: '',
  tier: 'STANDARD'
};

export function useOrderForm(): UseOrderFormReturn {
  const [formData, setFormData] = useState<CreateOrderRequest>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateItem = useCallback((index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
    setErrors(prev => ({ ...prev, [`items[${index}].${field}`]: '' }));
  }, []);

  const isValid = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!isValidEmail(formData.customerEmail)) {
      newErrors.customerEmail = 'Invalid email';
    }
    formData.items.forEach((item, idx) => {
      if (!item.productName) newErrors[`items[${idx}].productName`] = 'Required';
      if (!isValidQuantity(item.quantity)) newErrors[`items[${idx}].quantity`] = 'Must be > 0';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const reset = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
  }, []);

  return {
    formData,
    updateItem,
    addItem: () => { /* ... */ },
    removeItem: (idx) => { /* ... */ },
    updateEmail: (email) => setFormData(prev => ({ ...prev, customerEmail: email })),
    errors,
    isValid,
    reset
  };
}
```

**Rules:**
- ✅ Manage internal component state
- ✅ Return data + mutable functions
- ✅ Use other hooks (`useState`, `useCallback`, `useEffect`)
- ✅ Call utils/validators
- ✅ Exported from hook file, used in components/pages
- ❌ DO NOT call services directly (pass service calls to parent page)
- ❌ DO NOT return JSX or components

### Built-in Hooks to Avoid Duplication

Define reusable hooks once in `utils/hooks/`:

- `useFetch(url)` — generic data fetching with loading/error states
- `useLocalStorage(key)` — persist/retrieve from localStorage
- `useDebounce(value, delay)` — debounce user input
- `useAsyncEffect(asyncFn, deps)` — handle async operations safely

### No Business Logic at Utility Level

- ✅ Format money, dates, text
- ✅ Validate input shape (email, number range)
- ✅ Convert/map data types
- ❌ **DO NOT:** Calculate order totals
- ❌ **DO NOT:** Determine discount tier
- ❌ **DO NOT:** Transition order state
- *(Business logic stays in services or domain)*

### Testing

- Utilities: unit tests for each function
  ```typescript
  describe('formatCurrency', () => {
    it('formats EUR correctly', () => {
      expect(formatCurrency(123.45)).toBe('123,45 €');
    });
  });
  ```

- Hooks: use `@testing-library/react` + `renderHook`
  ```typescript
  import { renderHook, act } from '@testing-library/react';
  
  it('updates form data', () => {
    const { result } = renderHook(() => useOrderForm());
    act(() => result.current.updateEmail('test@example.com'));
    expect(result.current.formData.customerEmail).toBe('test@example.com');
  });
  ```

### Folder Structure

```
utils/
├── formatters.ts
├── validators.ts
├── constants.ts
├── hooks/
│   ├── useFetch.ts
│   └── useDebounce.ts
└── __tests__/
    ├── formatters.test.ts
    └── validators.test.ts

pages/
├── OrderListPage.tsx
└── hooks/
    └── useOrderForm.ts
```

### Imports & Dependencies
- Import from other utils, NOT from services/components/pages
- Minimal external dependencies
- Do NOT import React Context (pass props instead)
