import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../Input';

describe('Input', () => {
  it('should render with label', () => {
    render(<Input id="email" label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('should display error message', () => {
    render(
      <Input id="email" label="Email" error="Email is required" />
    );
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  it('should have aria-invalid when error exists', () => {
    render(
      <Input id="email" label="Email" error="Invalid email" />
    );
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('should update value on change', async () => {
    const user = userEvent.setup();
    render(<Input id="email" label="Email" />);
    const input = screen.getByLabelText('Email') as HTMLInputElement;
    
    await user.type(input, 'test@example.com');
    expect(input.value).toBe('test@example.com');
  });
});
