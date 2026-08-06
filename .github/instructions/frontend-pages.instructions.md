---
applyTo: "src/frontend/src/pages/**/*.tsx"
---

# Frontend Pages layer instructions

## Purpose
Pages are **route handlers** that compose components, fetch data from services, and manage page-level state. One page per route.

## Rules

### Page Structure
- File naming: `PascalCase.tsx` (e.g., `OrderListPage.tsx`, `CreateOrderPage.tsx`)
- Each page is a React component that can be mounted by a router
- Pages manage page-level state (`useEffect`, `useState` for loading/data/errors)
- Pages do NOT directly call API; they import and use service functions

### Data Fetching Pattern
```typescript
// ✅ CORRECT
export const OrderListPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await OrderService.fetchOrders();
        setOrders(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  return <OrderList orders={orders} onCancel={...} />;
};
```

### Folder Structure
```
pages/
├── OrderListPage.tsx
├── CreateOrderPage.tsx
├── OrderDetailsPage.tsx
└── hooks/
    └── useOrderForm.ts
```

### State Management
- Use `useState` for local page state (loading, filters, form data)
- Use service functions for API/domain logic
- **Do NOT** build a global Redux/Context store (keep it simple for now)
- Pass state to child components via props

### Error Handling
- All async operations wrapped in try-catch
- Display user-friendly error messages (never raw API errors)
- Provide "Retry" button for failed operations
- Log errors to console/logging service (not shown to user)

### Navigation & Routing
- Pages accept route params via `useParams()` (React Router)
- Pages can navigate via `useNavigate()`
- Page should handle both valid and invalid route params gracefully
- 404 handling: if order not found, show error UI (don't crash)

### Component Composition
- Pages import reusable components from `components/`
- Pages import page-specific hooks from `pages/hooks/`
- Example:
  ```typescript
  import { OrderCard } from '../components/orders/OrderCard';
  import { CreateOrderForm } from '../components/forms/CreateOrderForm';
  import { useOrderForm } from './hooks/useOrderForm';
  ```

### Event Handlers at Page Level
- Page captures user events (form submit, cancel button) and calls services
- Example:
  ```typescript
  const handleCreateOrder = async (data: CreateOrderRequest) => {
    try {
      const newOrder = await OrderService.createOrder(data);
      navigate(`/orders/${newOrder.id}`);
    } catch (err) {
      setError(err as Error);
    }
  };
  ```

### Accessibility
- Use semantic HTML: `<main>`, `<section>`, `<article>`
- Page title in `<title>` or via `useEffect` (document.title)
- Form labels, error messages accessible
- Focus management on navigation/modal open

### Testing
- Each page has a `.test.tsx` file
- Tests should mock `OrderService` and test loading/error/success states
- Do NOT test API directly in page tests; mock `OrderService.fetchOrders()`
- Example:
  ```typescript
  vi.mock('../services/OrderService', () => ({
    OrderService: {
      fetchOrders: vi.fn()
    }
  }));

  it('displays orders after loading', async () => {
    vi.mocked(OrderService.fetchOrders).mockResolvedValue([...mockOrders]);
    render(<OrderListPage />);
    await waitFor(() => expect(screen.getByText(/Order #/)).toBeInTheDocument());
  });
  ```

### Imports & Dependencies
- Import services from `../services/`
- Import components from `../components/`
- Import types from `../types/`
- Do NOT import other pages or sibling pages
