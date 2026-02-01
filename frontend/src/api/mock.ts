import type { Restaurant, Order } from "./types";

export const mockRestaurants: Restaurant[] = [
  { id: "1", name: "Mock Pizza", location: "Dublin" },
  { id: "2", name: "Mock Sushi", location: "Galway" },
];

export const mockOrders: Order[] = [
  { id: "o1", restaurantId: "1", total: 25, status: "CONFIRMED" },
];
