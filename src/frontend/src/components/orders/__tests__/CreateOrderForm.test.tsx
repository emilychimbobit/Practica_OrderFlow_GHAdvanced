import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateOrderForm } from '../CreateOrderForm';

describe('CreateOrderForm', () => {
  it('should render form fields', () => {
    const onSubmit = vi.fn();
    render(<CreateOrderForm onSubmit={onSubmit} />);
    
    expect(screen.getByLabelText('Email del Cliente')).toBeInTheDocument();
    expect(screen.getByLabelText('Nivel de Cliente')).toBeInTheDocument();
    expect(screen.getByLabelText('Producto')).toBeInTheDocument();
  });

  it('should validate required email', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<CreateOrderForm onSubmit={onSubmit} />);
    
    const submitButton = screen.getByText('Crear Orden');
    await user.click(submitButton);
    
    expect(screen.getByText('El email es requerido')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should validate quantity > 0', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<CreateOrderForm onSubmit={onSubmit} />);
    
    const emailInput = screen.getByLabelText('Email del Cliente');
    await user.type(emailInput, 'test@example.com');
    
    const qtyInput = screen.getByLabelText('Cantidad');
    await user.clear(qtyInput);
    await user.type(qtyInput, '0');
    
    const submitButton = screen.getByText('Crear Orden');
    await user.click(submitButton);
    
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should submit valid form', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<CreateOrderForm onSubmit={onSubmit} />);
    
    const emailInput = screen.getByLabelText('Email del Cliente');
    await user.type(emailInput, 'test@example.com');
    
    const productInput = screen.getByLabelText('Producto');
    await user.type(productInput, 'Test Product');
    
    const qtyInput = screen.getByLabelText('Cantidad');
    await user.clear(qtyInput);
    await user.type(qtyInput, '2');
    
    const priceInput = screen.getByLabelText('Precio Unitario (€)');
    await user.clear(priceInput);
    await user.type(priceInput, '50');
    
    const submitButton = screen.getByText('Crear Orden');
    await user.click(submitButton);
    
    expect(onSubmit).toHaveBeenCalledWith({
      customerEmail: 'test@example.com',
      customerTier: 'STANDARD',
      items: [{ productName: 'Test Product', quantity: 2, unitPrice: 50 }]
    });
  });
});
