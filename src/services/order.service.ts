import { apiClient, ApiResponse } from '@/lib/api';
import type { Order, PaginationParams } from '@/types';

interface CreateOrderData {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    district: string;
    ward: string;
  };
  paymentMethod: 'stripe' | 'cod';
  notes?: string;
}

export const orderService = {
  // Get user's orders
  getOrders: async (params?: PaginationParams): Promise<ApiResponse<Order[]>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    return await apiClient.get<Order[]>(`/orders?${queryParams.toString()}`);
  },

  // Get single order by ID
  getOrderById: async (id: string): Promise<Order> => {
    const response = await apiClient.get<Order>(`/orders/${id}`);
    return response.data;
  },

  // Create new order
  createOrder: async (data: CreateOrderData): Promise<Order> => {
    const response = await apiClient.post<Order>('/orders', data);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id: string): Promise<Order> => {
    const response = await apiClient.patch<Order>(`/orders/${id}/cancel`);
    return response.data;
  },

  // Create Stripe payment intent
  createPaymentIntent: async (orderId: string): Promise<{ clientSecret: string }> => {
    const response = await apiClient.post<{ clientSecret: string }>(`/orders/${orderId}/payment-intent`);
    return response.data;
  },

  // Confirm payment
  confirmPayment: async (orderId: string, paymentIntentId: string): Promise<Order> => {
    const response = await apiClient.post<Order>(`/orders/${orderId}/confirm-payment`, {
      paymentIntentId,
    });
    return response.data;
  },
};

