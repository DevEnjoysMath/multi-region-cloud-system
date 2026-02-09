
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { restaurantsApi } from './restaurants';
import { ordersApi } from './orders';
import type { Restaurant, Order } from './types';

interface UseRestaurantsParams {
  page?: number;
  pageSize?: number;
  region?: string;
  cuisine?: string;
}

interface UseOrdersParams {
  page?: number;
  pageSize?: number;
  restaurantId?: string;
  status?: string;
}


export const useRestaurants = (params: UseRestaurantsParams = {}) => {
  return useQuery({
    queryKey: ['restaurants', params],
    queryFn: () => restaurantsApi.getAll(params),
  });
};

export const useRestaurant = (id: string) => {
  return useQuery({
    queryKey: ['restaurants', id],
    queryFn: () => restaurantsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt'>
    ) => restaurantsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });
};


export const useOrders = (params: UseOrdersParams = {}) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => ordersApi.getAll(params),
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>
    ) => ordersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
