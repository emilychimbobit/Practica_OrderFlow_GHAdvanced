import React, { useState, useEffect } from 'react';
import { Order, CreateOrderRequest, OrderItem, CustomerTier } from '../../types/order';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import styles from './CreateOrderForm.module.css';

interface CreateOrderFormProps {
  onSubmit: (data: CreateOrderRequest) => Promise<void>;
  initialOrder?: Order | null;
  loading?: boolean;
}

export const CreateOrderForm: React.FC<CreateOrderFormProps> = ({
  onSubmit,
  initialOrder = null,
  loading = false
}) => {
  const [email, setEmail] = useState('');
  const [tier, setTier] = useState<CustomerTier>('STANDARD');
  const [items, setItems] = useState<OrderItem[]>([{ productName: '', quantity: 1, unitPrice: 0 }]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Populate form when initialOrder changes
  useEffect(() => {
    if (initialOrder) {
      setEmail(initialOrder.customerEmail);
      setItems(initialOrder.items);
      setErrors({});
      setSubmitError(null);
    } else {
      resetForm();
    }
  }, [initialOrder]);

  const resetForm = () => {
    setEmail('');
    setTier('STANDARD');
    setItems([{ productName: '', quantity: 1, unitPrice: 0 }]);
    setErrors({});
    setSubmitError(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!email.includes('@')) {
      newErrors.email = 'El email debe ser válido';
    }

    if (items.length === 0) {
      newErrors.items = 'Debe tener al menos un artículo';
    }

    items.forEach((item, idx) => {
      if (!item.productName.trim()) {
        newErrors[`item-${idx}-name`] = 'El nombre del producto es requerido';
      }
      if (item.quantity <= 0) {
        newErrors[`item-${idx}-qty`] = 'La cantidad debe ser mayor a 0';
      }
      if (item.unitPrice <= 0) {
        newErrors[`item-${idx}-price`] = 'El precio debe ser mayor a 0';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleItemChange = (idx: number, field: keyof OrderItem, value: any) => {
    const newItems = [...items];
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[idx][field] = Number(value);
    } else {
      newItems[idx][field] = value;
    }
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { productName: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (idx: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    const request: CreateOrderRequest = {
      customerEmail: email.trim(),
      customerTier: tier,
      items
    };

    try {
      await onSubmit(request);
      resetForm();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Error al guardar la orden');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3>Crear Orden</h3>

      {submitError && (
        <div className={styles.alert} role="alert">
          {submitError}
        </div>
      )}

      <Input
        id="email"
        label="Email del Cliente"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        disabled={loading}
        required
      />

      <div className={styles.formGroup}>
        <label htmlFor="tier">Nivel de Cliente</label>
        <select
          id="tier"
          value={tier}
          onChange={(e) => setTier(e.target.value as CustomerTier)}
          disabled={loading}
          className={styles.select}
        >
          <option value="STANDARD">Standard</option>
          <option value="GOLD">Gold</option>
          <option value="VIP">VIP</option>
        </select>
      </div>

      <div className={styles.itemsSection}>
        <div className={styles.itemsHeader}>
          <h4>Artículos</h4>
          {errors.items && (
            <span className={styles.itemsError}>{errors.items}</span>
          )}
        </div>

        <div className={styles.itemsList}>
          {items.map((item, idx) => (
            <div key={idx} className={styles.itemRow}>
              <Input
                id={`product-${idx}`}
                label="Producto"
                value={item.productName}
                onChange={(e) => handleItemChange(idx, 'productName', e.target.value)}
                error={errors[`item-${idx}-name`]}
                disabled={loading}
                className={styles.itemInput}
              />

              <Input
                id={`qty-${idx}`}
                label="Cantidad"
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                error={errors[`item-${idx}-qty`]}
                disabled={loading}
                className={styles.itemInput}
              />

              <Input
                id={`price-${idx}`}
                label="Precio Unitario (€)"
                type="number"
                min="0"
                step="0.01"
                value={item.unitPrice}
                onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                error={errors[`item-${idx}-price`]}
                disabled={loading}
                className={styles.itemInput}
              />

              {items.length > 1 && (
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => removeItem(idx)}
                  disabled={loading}
                  className={styles.removeButton}
                  aria-label={`Eliminar artículo ${idx + 1}`}
                >
                  Eliminar
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={addItem}
          disabled={loading}
          className={styles.addButton}
        >
          + Agregar Artículo
        </Button>
      </div>

      <div className={styles.actions}>
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {initialOrder ? 'Actualizar Orden' : 'Crear Orden'}
        </Button>
        {initialOrder && (
          <Button
            type="button"
            variant="secondary"
            onClick={resetForm}
            disabled={loading}
          >
            Limpiar
          </Button>
        )}
      </div>
    </form>
  );
};
