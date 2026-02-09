
import { apiFetch } from './clients';
import type { Restaurant, PaginatedResponse } from './types';

interface GetAllRestaurantsParams {
  page?: number;
  pageSize?: number;
  region?: string;
  cuisine?: string;
}

export const restaurantsApi = {
  getAll: async (params?: GetAllRestaurantsParams): Promise<PaginatedResponse<Restaurant>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.region) queryParams.append('region', params.region);
    if (params?.cuisine) queryParams.append('cuisine', params.cuisine);
    
    const query = queryParams.toString();
    return apiFetch<PaginatedResponse<Restaurant>>(
      `/restaurants${query ? `?${query}` : ''}`
    );
  },

  getById: async (id: string): Promise<Restaurant> => {
    return apiFetch<Restaurant>(`/restaurants/${id}`);
  },

  create: async (data: Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt'>): Promise<Restaurant> => {
    return apiFetch<Restaurant>('/restaurants', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Restaurant>): Promise<Restaurant> => {
    return apiFetch<Restaurant>(`/restaurants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiFetch<void>(`/restaurants/${id}`, {
      method: 'DELETE',
    });
  },
};