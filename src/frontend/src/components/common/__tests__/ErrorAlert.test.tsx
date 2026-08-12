import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorAlert } from '../ErrorAlert';

describe('ErrorAlert', () => {
  it('should not render when error is null', () => {
    const { container } = render(<ErrorAlert error={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render error message from Error object', () => {
    const error = new Error('Something went wrong');
    render(<ErrorAlert error={error} />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('should render error message from string', () => {
    render(<ErrorAlert error="An error occurred" />);
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });

  it('should have role alert', () => {
    const { container } = render(<ErrorAlert error="Error" />);
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toBeInTheDocument();
  });

  it('should render close button when onDismiss provided', () => {
    const onDismiss = () => {};
    render(<ErrorAlert error="Error" onDismiss={onDismiss} />);
    expect(screen.getByLabelText('Cerrar alerta')).toBeInTheDocument();
  });
});
