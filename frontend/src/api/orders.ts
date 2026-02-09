
import { apiFetch } from './clients';
import type { Order, PaginatedResponse } from './types';

interface GetAllOrdersParams {
  page?: number;
  pageSize?: number;
  restaurantId?: string;
  status?: string;
}

export const ordersApi = {
  getAll: async (params?: GetAllOrdersParams): Promise<PaginatedResponse<Order>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.restaurantId) queryParams.append('restaurantId', params.restaurantId);
    if (params?.status) queryParams.append('status', params.status);
    
    const query = queryParams.toString();
    return apiFetch<PaginatedResponse<Order>>(
      `/orders${query ? `?${query}` : ''}`
    );
  },

  getById: async (id: string): Promise<Order> => {
    return apiFetch<Order>(`/orders/${id}`);
  },

  create: async (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
    return apiFetch<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateStatus: async (id: string, status: Order['status']): Promise<Order> => {
    return apiFetch<Order>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiFetch<void>(`/orders/${id}`, {
      method: 'DELETE',
    });
  },
};