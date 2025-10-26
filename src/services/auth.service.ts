import { apiClient } from '@/lib/api';
import type { AuthResponse, LoginCredentials, RegisterData, User } from '@/types';

export const authService = {
  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    // apiClient returns { success, message, data }, so we extract the nested data
    return (response as any).data;
  },

  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    // apiClient returns { success, message, data }, so we extract the nested data
    return (response as any).data;
  },

  // Logout user
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return (response as any).data;
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    const response = await apiClient.post<{ accessToken: string; refreshToken: string }>(
      '/auth/refresh-token',
      { refreshToken }
    );
    return (response as any).data;
  },

  // Update profile
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<User>('/auth/profile', data);
    return (response as any).data;
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },

  // Request password reset
  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post('/auth/forgot-password', { email });
  },

  // Reset password
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiClient.post('/auth/reset-password', {
      token,
      newPassword,
    });
  },
};

