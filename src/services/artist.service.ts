import { apiClient, ApiResponse } from '@/lib/api';
import type { Artist, ArtistFilters } from '@/types';

export const artistService = {
  // Get all artists with filters
  getArtists: async (filters?: ArtistFilters): Promise<ApiResponse<Artist[]>> => {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.specialty) params.append('specialty', filters.specialty);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.featured !== undefined) params.append('featured', filters.featured.toString());
    if (filters?.verified !== undefined) params.append('verified', filters.verified.toString());

    return await apiClient.get<Artist[]>(`/artists?${params.toString()}`);
  },

  // Get single artist by ID
  getArtistById: async (id: string): Promise<Artist> => {
    const response = await apiClient.get<Artist>(`/artists/${id}`);
    return response.data;
  },

  // Get featured artists
  getFeaturedArtists: async (limit?: number): Promise<Artist[]> => {
    const response = await apiClient.get<Artist[]>(`/artists?featured=true&limit=${limit || 6}`);
    return response.data;
  },

  // Create artist profile (Artist/Admin only)
  createArtist: async (data: Partial<Artist>): Promise<Artist> => {
    const response = await apiClient.post<Artist>('/artists', data);
    return response.data;
  },

  // Update artist profile (Artist/Admin only)
  updateArtist: async (id: string, data: Partial<Artist>): Promise<Artist> => {
    const response = await apiClient.put<Artist>(`/artists/${id}`, data);
    return response.data;
  },

  // Delete artist (Admin only)
  deleteArtist: async (id: string): Promise<void> => {
    await apiClient.delete(`/artists/${id}`);
  },
};

