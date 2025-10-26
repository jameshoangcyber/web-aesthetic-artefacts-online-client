import { apiClient, ApiResponse } from '@/lib/api';
import type { Product, ProductFilters } from '@/types';

export const productService = {
  // Get all products with filters
  getProducts: async (filters?: ProductFilters): Promise<ApiResponse<Product[]>> => {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.category) params.append('category', filters.category);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.artistId) params.append('artistId', filters.artistId);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters?.featured !== undefined) params.append('featured', filters.featured.toString());
    if (filters?.isAvailable !== undefined) params.append('isAvailable', filters.isAvailable.toString());

    return await apiClient.get<Product[]>(`/products?${params.toString()}`);
  },

  // Get single product by ID
  getProductById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async (limit?: number): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(`/products?featured=true&limit=${limit || 6}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category: string, filters?: ProductFilters): Promise<ApiResponse<Product[]>> => {
    return await productService.getProducts({ ...filters, category });
  },

  // Get products by artist
  getProductsByArtist: async (artistId: string, filters?: ProductFilters): Promise<ApiResponse<Product[]>> => {
    return await productService.getProducts({ ...filters, artistId });
  },

  // Search products
  searchProducts: async (query: string, filters?: ProductFilters): Promise<ApiResponse<Product[]>> => {
    return await productService.getProducts({ ...filters, search: query });
  },

  // Increment product views
  incrementViews: async (id: string): Promise<void> => {
    await apiClient.post(`/products/${id}/view`);
  },

  // Like/unlike product
  toggleLike: async (id: string): Promise<{ liked: boolean; likes: number }> => {
    const response = await apiClient.post<{ liked: boolean; likes: number }>(`/products/${id}/like`);
    return response.data;
  },

  // Create product (Artist/Admin only)
  createProduct: async (data: Partial<Product>): Promise<Product> => {
    const response = await apiClient.post<Product>('/products', data);
    return response.data;
  },

  // Update product (Artist/Admin only)
  updateProduct: async (id: string, data: Partial<Product>): Promise<Product> => {
    const response = await apiClient.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  // Delete product (Artist/Admin only)
  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },
};

