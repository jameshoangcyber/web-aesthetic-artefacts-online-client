import api from '@/lib/api';

export const uploadService = {
  // Upload single image
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post<{ success: boolean; data: { url: string } }>(
      '/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.data.url;
  },

  // Upload multiple images
  uploadImages: async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await api.post<{ success: boolean; data: { urls: string[] } }>(
      '/upload/multiple',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.data.urls;
  },
};

