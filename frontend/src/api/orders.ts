import { apiFetch } from "./clients";
import type { Order, PaginatedResponse } from "./types";

/**
 * Parameters for fetching orders via ordersApi.getAll.
 */
export interface GetAllOrdersParams {
  /** Page number to fetch (default: 1) */
  page?: number;

  /** Number of items per page (default: 10) */
  pageSize?: number;

  /** Restaurant ID filter */
  restaurantId?: string;

  /** Order status filter (e.g., "pending") */
  status?: string;
}

/**
 * Orders API client.
 *
 * Provides methods for fetching and mutating order data.
 */
export const ordersApi = {
  /**
   * Fetches a paginated and filterable list of orders.
   * @param params - Pagination and filter options
   * @returns Paginated order response
   */
  getAll: async (
    params?: GetAllOrdersParams,
  ): Promise<PaginatedResponse<Order>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.pageSize)
      queryParams.append("pageSize", params.pageSize.toString());
    if (params?.restaurantId)
      queryParams.append("restaurantId", params.restaurantId);
    if (params?.status) queryParams.append("status", params.status);

    const query = queryParams.toString();
    return apiFetch<PaginatedResponse<Order>>(
      `/orders${query ? `?${query}` : ""}`,
    );
  },

  /**
   * Fetches a single order by ID.
   * @param id - Order ID
   * @returns The matching order
   */
  getById: async (id: string): Promise<Order> => {
    return apiFetch<Order>(`/orders/${id}`);
  },

  /**
   * Creates a new order.
   * @param data - Order data without generated fields
   * @returns The created order
   */
  create: async (
    data: Omit<Order, "id" | "createdAt" | "updatedAt">,
  ): Promise<Order> => {
    return apiFetch<Order>("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Updates the status of an existing order.
   * @param id - Order ID
   * @param status - New order status
   * @returns The updated order
   */
  updateStatus: async (id: string, status: Order["status"]): Promise<Order> => {
    return apiFetch<Order>(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  /**
   * Deletes an order by ID.
   * @param id - Order ID
   * @returns Void on success
   */
  delete: async (id: string): Promise<void> => {
    return apiFetch<void>(`/orders/${id}`, {
      method: "DELETE",
    });
  },
};
