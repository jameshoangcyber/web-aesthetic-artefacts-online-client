import api, { ApiResponse } from '@/lib/api';
import { User, Artist, Product, Order, Category } from '@/types';

export interface DashboardStats {
  totalUsers: number;
  totalArtists: number;
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: Order[];
}

export const AdminService = {
  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    // Since backend doesn't have a dedicated stats endpoint, we'll fetch data from multiple endpoints
    const [usersRes, artistsRes, productsRes, categoriesRes, ordersRes] = await Promise.all([
      api.get<ApiResponse<User[]>>('/users'),
      api.get<ApiResponse<Artist[]>>('/artists'),
      api.get<ApiResponse<Product[]>>('/products'),
      api.get<ApiResponse<Category[]>>('/categories'),
      api.get<ApiResponse<Order[]>>('/orders/admin/all'),
    ]);

    const users = usersRes.data.data || [];
    const artists = artistsRes.data.data || [];
    const products = productsRes.data.data || [];
    const categories = categoriesRes.data.data || [];
    const orders = ordersRes.data.data || [];

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const recentOrders = orders.slice(0, 5);

    return {
      totalUsers: users.length,
      totalArtists: artists.length,
      totalProducts: products.length,
      totalCategories: categories.length,
      totalOrders: orders.length,
      totalRevenue,
      recentOrders,
    };
  },

  // Users Management
  getAllUsers: async (): Promise<User[]> => {
    const { data } = await api.get<ApiResponse<User[]>>('/users');
    return data.data || [];
  },

  getUserById: async (id: string): Promise<User> => {
    const { data } = await api.get<ApiResponse<User>>(`/users/${id}`);
    return data.data!;
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const { data } = await api.put<ApiResponse<User>>(`/users/${id}`, userData);
    return data.data!;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  // Artists Management
  getAllArtists: async (): Promise<Artist[]> => {
    const { data } = await api.get<ApiResponse<Artist[]>>('/artists');
    return data.data || [];
  },

  createArtist: async (artistData: Omit<Artist, '_id' | 'createdAt' | 'updatedAt'>): Promise<Artist> => {
    const { data } = await api.post<ApiResponse<Artist>>('/artists', artistData);
    return data.data!;
  },

  updateArtist: async (id: string, artistData: Partial<Artist>): Promise<Artist> => {
    const { data } = await api.put<ApiResponse<Artist>>(`/artists/${id}`, artistData);
    return data.data!;
  },

  // Products Management
  getAllProducts: async (): Promise<Product[]> => {
    const { data } = await api.get<ApiResponse<Product[]>>('/products');
    return data.data || [];
  },

  createProduct: async (productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    const { data } = await api.post<ApiResponse<Product>>('/products', productData);
    return data.data!;
  },

  updateProduct: async (id: string, productData: Partial<Product>): Promise<Product> => {
    const { data } = await api.put<ApiResponse<Product>>(`/products/${id}`, productData);
    return data.data!;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  // Orders Management
  getAllOrders: async (): Promise<Order[]> => {
    const { data } = await api.get<ApiResponse<Order[]>>('/orders/admin/all');
    return data.data || [];
  },

  updateOrderStatus: async (
    id: string,
    status: Order['orderStatus']
  ): Promise<Order> => {
    const { data } = await api.put<ApiResponse<Order>>(`/orders/${id}`, {
      orderStatus: status,
    });
    return data.data!;
  },

  // Categories Management
  getAllCategories: async (): Promise<Category[]> => {
    const { data } = await api.get<ApiResponse<Category[]>>('/categories');
    return data.data || [];
  },

  createCategory: async (categoryData: Partial<Category>): Promise<Category> => {
    const { data } = await api.post<ApiResponse<Category>>('/categories', categoryData);
    return data.data!;
  },

  updateCategory: async (id: string, categoryData: Partial<Category>): Promise<Category> => {
    const { data } = await api.put<ApiResponse<Category>>(`/categories/${id}`, categoryData);
    return data.data!;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },

  updateCategoryCounts: async (): Promise<Category[]> => {
    const { data } = await api.post<ApiResponse<Category[]>>('/categories/update-counts');
    return data.data || [];
  },
};

