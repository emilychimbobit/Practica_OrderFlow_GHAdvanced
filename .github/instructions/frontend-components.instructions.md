---
applyTo: "src/frontend/src/components/**/*.tsx"
---

# Frontend Components layer instructions

## Purpose
Define reusable, single-responsibility UI components. Components are **presentation-only**; they receive data via props and emit user events via callbacks. No API calls, state fetching, or business logic.

## Rules

### Component Structure
- Use **Functional Components** with Hooks only (no class components)
- Each component file exports ONE main component + optional small helpers
- Props must be typed with explicit TypeScript interfaces (no `any`)
- Components accept `children` when appropriate for composition

### Props Pattern
```typescript
interface OrderCardProps {
  orderId: string;
  customerEmail: string;
  total: number;
  status: OrderStatus;
  onCancel?: (orderId: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  orderId,
  customerEmail,
  total,
  status,
  onCancel
}) => {
  // ...
};
```

### Naming and Organization
- Component files: `PascalCase.tsx` (e.g., `OrderList.tsx`, `CreateOrderForm.tsx`)
- Folder structure: Group by feature or UI type
  ```
  components/
  ├── common/          (Button, Input, Modal, etc.)
  ├── orders/          (OrderCard, OrderTable, etc.)
  └── forms/           (CreateOrderForm, FilterForm, etc.)
  ```

### Accessibility & UX
- All interactive elements must have `aria-label` or `aria-labelledby`
- Forms use `<label>` with `htmlFor` binding
- Buttons must be `<button>` (not `<div>` with onClick)
- Error messages displayed inline with `aria-live="polite"`
- Loading states: use disabled states + spinner or skeleton
- Keyboard navigation: Tab order, Enter/Space to activate

### Styling
- Use CSS Modules (`.module.css`) OR Tailwind utility classes (not both in same file)
- **No inline styles** except for truly dynamic values
- No hardcoded colors/sizes; use design tokens from theme
- Responsive first: mobile → tablet → desktop

### No Business Logic
- ✅ Format display date: `new Date(timestamp).toLocaleDateString()`
- ✅ Conditional rendering: `status === 'PENDING' ? ... : ...`
- ✅ User event handling: `onClick`, `onChange` → call prop callback
- ❌ **DO NOT:** Calculate totals, validate customer email, fetch from API, determine discount
- ❌ **DO NOT:** Manage complex state that belongs in services

### Testing
- Each component has a `.test.tsx` file (co-located in same folder)
- Minimum tests:
  - Renders without crashing
  - Displays correct props (text, values, states)
  - Handles user interactions (click, form submit)
  - Calls prop callbacks with correct arguments
- Use `@testing-library/react` (avoid snapshot tests)

### Imports & Dependencies
- Import only from:
  - React/React hooks
  - `../types/` (TypeScript interfaces)
  - `../utils/` (formatters, helpers)
  - `./` (sibling components or styles)
- Avoid circular dependencies
- Do not import from `services/` directly; pass data via props
