
import type { Restaurant, Order } from './types';

export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Pizza Palace',
    cuisine: 'Italian',
    location: 'New York',
    region: 'us-east',
    rating: 4.5,
    description: 'Best pizza in town',
    imageUrl: 'https://example.com/pizza.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Sushi World',
    cuisine: 'Japanese',
    location: 'San Francisco',
    region: 'us-west',
    rating: 4.8,
    description: 'Fresh sushi daily',
    imageUrl: 'https://example.com/sushi.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const mockOrders: Order[] = [
  {
    id: '1',
    restaurantId: '1',
    customerId: 'customer-1',
    items: [
      { id: '1', name: 'Margherita Pizza', quantity: 2, price: 12.99 },
      { id: '2', name: 'Garlic Bread', quantity: 1, price: 5.99 },
    ],
    status: 'pending',
    totalAmount: 31.97,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const mockApi = {
  restaurants: {
    getAll: async () => ({
      data: mockRestaurants,
      total: mockRestaurants.length,
      page: 1,
      pageSize: 10,
    }),
    getById: async (id: string) => mockRestaurants.find(r => r.id === id),
  },
  orders: {
    getAll: async () => ({
      data: mockOrders,
      total: mockOrders.length,
      page: 1,
      pageSize: 10,
    }),
    getById: async (id: string) => mockOrders.find(o => o.id === id),
  },
};