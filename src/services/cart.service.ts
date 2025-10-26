import { apiClient } from '@/lib/api';
import type { Cart } from '@/types';

export const cartService = {
  // Get user's cart
  getCart: async (): Promise<Cart> => {
    const response = await apiClient.get<Cart>('/cart');
    return response.data;
  },

  // Add item to cart
  addToCart: async (productId: string, quantity: number = 1): Promise<Cart> => {
    const response = await apiClient.post<Cart>('/cart/add', {
      productId,
      quantity,
    });
    return response.data;
  },

  // Update cart item quantity
  updateCartItem: async (productId: string, quantity: number): Promise<Cart> => {
    const response = await apiClient.put<Cart>('/cart/update', {
      productId,
      quantity,
    });
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (productId: string): Promise<Cart> => {
    const response = await apiClient.delete<Cart>(`/cart/remove/${productId}`);
    return response.data;
  },

  // Clear cart
  clearCart: async (): Promise<void> => {
    await apiClient.delete('/cart/clear');
  },
};

