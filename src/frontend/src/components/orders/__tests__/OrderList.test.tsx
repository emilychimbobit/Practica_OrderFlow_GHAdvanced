import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Order } from '../../../types/order';
import { OrderList } from '../OrderList';

const mockOrders: Order[] = [
  {
    id: '1',
    customerEmail: 'test@example.com',
    items: [{ productName: 'Product 1', quantity: 1, unitPrice: 100 }],
    total: 100,
    discount: 0,
    status: 'PENDING',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

describe('OrderList', () => {
  it('should render empty state', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(<OrderList orders={[]} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.getByText(/No hay órdenes aún/)).toBeInTheDocument();
  });

  it('should render orders list', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(
      <OrderList orders={mockOrders} onEdit={onEdit} onDelete={onDelete} />
    );
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('should render edit and delete buttons', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(
      <OrderList orders={mockOrders} onEdit={onEdit} onDelete={onDelete} />
    );
    expect(screen.getByLabelText(/Editar orden 1/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Eliminar orden 1/)).toBeInTheDocument();
  });
});
