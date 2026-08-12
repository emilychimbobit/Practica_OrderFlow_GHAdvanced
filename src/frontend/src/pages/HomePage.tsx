import React, { useState, useEffect } from 'react';
import { Order, CreateOrderRequest } from '../types/order';
import { OrderService, ApiError } from '../services/orderService';
import { OrderList } from '../components/orders/OrderList';
import { CreateOrderForm } from '../components/orders/CreateOrderForm';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorAlert } from '../components/common/ErrorAlert';
import styles from './HomePage.module.css';

export const HomePage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch orders on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await OrderService.fetchOrders();
      setOrders(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (request: CreateOrderRequest) => {
    try {
      setSubmitting(true);
      setError(null);
      const newOrder = await OrderService.createOrder(request);
      setOrders([...orders, newOrder]);
      setSelectedOrder(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    // Scroll to form on mobile
    const formElement = document.getElementById('order-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm('¿Está seguro de que desea eliminar esta orden?')) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const updatedOrder = await OrderService.cancelOrder(orderId);
      setOrders(orders.map((o) => (o.id === orderId ? updatedOrder : o)));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updatedOrder);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('Failed to delete order:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando órdenes..." />;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>OrderFlow</h1>
        <p>Gestiona tus órdenes de forma simple y eficiente</p>
      </header>

      {error && (
        <ErrorAlert error={error} onDismiss={() => setError(null)} />
      )}

      <main className={styles.container}>
        <section className={styles.panel}>
          <h2>Órdenes</h2>
          {loading ? (
            <LoadingSpinner message="Cargando..." />
          ) : (
            <OrderList
              orders={orders}
              onEdit={handleEditOrder}
              onDelete={handleDeleteOrder}
              loading={submitting}
            />
          )}
        </section>

        <section className={styles.panel} id="order-form">
          <CreateOrderForm
            onSubmit={handleCreateOrder}
            initialOrder={selectedOrder}
            loading={submitting}
          />
        </section>
      </main>
    </div>
  );
};
