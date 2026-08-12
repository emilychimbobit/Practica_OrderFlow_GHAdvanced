import React from 'react';
import { Order } from '../../types/order';
import { Button } from '../common/Button';
import styles from './OrderList.module.css';

interface OrderListProps {
  orders: Order[];
  onEdit: (order: Order) => void;
  onDelete: (orderId: string) => void;
  loading?: boolean;
}

export const OrderList: React.FC<OrderListProps> = ({
  orders,
  onEdit,
  onDelete,
  loading = false
}) => {
  if (orders.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No hay órdenes aún. ¡Crea la primera!</p>
      </div>
    );
  }

  return (
    <div className={styles.listContainer}>
      <ul className={styles.list} role="list">
        {orders.map((order) => (
          <li key={order.id} className={styles.item}>
            <div className={styles.orderInfo}>
              <div className={styles.header}>
                <span className={styles.id}>Orden: {order.id}</span>
                <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
                  {order.status}
                </span>
              </div>
              <div className={styles.details}>
                <p>
                  <strong>Email:</strong> {order.customerEmail}
                </p>
                <p>
                  <strong>Items:</strong> {order.items.length}
                </p>
                <p>
                  <strong>Total:</strong> €{order.total.toFixed(2)}
                </p>
                {order.discount > 0 && (
                  <p className={styles.discount}>
                    <strong>Descuento:</strong> €{order.discount.toFixed(2)}
                  </p>
                )}
                <p className={styles.date}>
                  {new Date(order.createdAt).toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>
            <div className={styles.actions}>
              <Button
                variant="secondary"
                onClick={() => onEdit(order)}
                disabled={loading}
                aria-label={`Editar orden ${order.id}`}
              >
                Editar
              </Button>
              <Button
                variant="danger"
                onClick={() => onDelete(order.id)}
                disabled={loading}
                aria-label={`Eliminar orden ${order.id}`}
              >
                Eliminar
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
