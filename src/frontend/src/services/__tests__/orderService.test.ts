import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderService, ValidationError, NotFoundError } from '../orderService';

// Mock fetch
global.fetch = vi.fn();

describe('OrderService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchOrders', () => {
    it('should fetch and map orders correctly', async () => {
      const mockResponse = [
        {
          id: '1',
          customerEmail: 'test@example.com',
          items: [{ productName: 'Product', quantity: 1, unitPrice: 100 }],
          total: 100,
          discount: 0,
          status: 'PENDING',
          createdAt: '2024-01-01T00:00:00Z'
        }
      ];

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await OrderService.fetchOrders();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
      expect(result[0].total).toBe(100);
    });

    it('should throw error on fetch failure', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      await expect(OrderService.fetchOrders()).rejects.toThrow();
    });
  });

  describe('createOrder', () => {
    it('should create order successfully', async () => {
      const request = {
        customerEmail: 'test@example.com',
        customerTier: 'STANDARD' as const,
        items: [{ productName: 'Product', quantity: 1, unitPrice: 100 }]
      };

      const mockResponse = {
        id: '1',
        customerEmail: 'test@example.com',
        items: [{ productName: 'Product', quantity: 1, unitPrice: 100 }],
        total: 100,
        discount: 0,
        status: 'PENDING',
        createdAt: '2024-01-01T00:00:00Z'
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await OrderService.createOrder(request);
      expect(result.id).toBe('1');
    });

    it('should throw ValidationError on 400', async () => {
      const request = {
        customerEmail: 'test@example.com',
        customerTier: 'STANDARD' as const,
        items: []
      };

      (fetch as any).mockResolvedValueOnce({
        status: 400,
        json: async () => ({ error: 'Invalid order' })
      });

      await expect(OrderService.createOrder(request)).rejects.toThrow(
        ValidationError
      );
    });
  });

  describe('cancelOrder', () => {
    it('should cancel order successfully', async () => {
      const mockResponse = {
        id: '1',
        customerEmail: 'test@example.com',
        items: [{ productName: 'Product', quantity: 1, unitPrice: 100 }],
        total: 100,
        discount: 0,
        status: 'CANCELLED',
        createdAt: '2024-01-01T00:00:00Z'
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await OrderService.cancelOrder('1');
      expect(result.status).toBe('CANCELLED');
    });

    it('should throw NotFoundError on 404', async () => {
      (fetch as any).mockResolvedValueOnce({
        status: 404
      });

      await expect(OrderService.cancelOrder('999')).rejects.toThrow(NotFoundError);
    });
  });
});
