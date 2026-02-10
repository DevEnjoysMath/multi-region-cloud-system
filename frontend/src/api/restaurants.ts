import { apiFetch } from "./clients";
import type { Restaurant, PaginatedResponse } from "./types";

/**
 * Parameters for fetching restaurants via restaurantsApi.getAll.
 */
export interface GetAllRestaurantsParams {
  /** Page number to fetch (default: 1) */
  page?: number;

  /** Number of items per page (default: 10) */
  pageSize?: number;

  /** Region filter (e.g., "us-east") */
  region?: string;

  /** Cuisine filter (e.g., "Italian") */
  cuisine?: string;
}

/**
 * Restaurants API client.
 *
 * Provides methods for fetching and mutating restaurant data.
 */
export const restaurantsApi = {
  /**
   * Fetches a paginated and filterable list of restaurants.
   * @param params - Pagination and filter options
   * @returns Paginated restaurant response
   */
  getAll: async (
    params?: GetAllRestaurantsParams,
  ): Promise<PaginatedResponse<Restaurant>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.pageSize)
      queryParams.append("pageSize", params.pageSize.toString());
    if (params?.region) queryParams.append("region", params.region);
    if (params?.cuisine) queryParams.append("cuisine", params.cuisine);

    const query = queryParams.toString();
    return apiFetch<PaginatedResponse<Restaurant>>(
      `/restaurants${query ? `?${query}` : ""}`,
    );
  },

  /**
   * Fetches a single restaurant by ID.
   * @param id - Restaurant ID
   * @returns The matching restaurant
   */
  getById: async (id: string): Promise<Restaurant> => {
    return apiFetch<Restaurant>(`/restaurants/${id}`);
  },

  /**
   * Creates a new restaurant.
   * @param data - Restaurant data without generated fields
   * @returns The created restaurant
   */
  create: async (
    data: Omit<Restaurant, "id" | "createdAt" | "updatedAt">,
  ): Promise<Restaurant> => {
    return apiFetch<Restaurant>("/restaurants", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Updates an existing restaurant.
   * @param id - Restaurant ID
   * @param data - Partial restaurant data to update
   * @returns The updated restaurant
   */
  update: async (
    id: string,
    data: Partial<Restaurant>,
  ): Promise<Restaurant> => {
    return apiFetch<Restaurant>(`/restaurants/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Deletes a restaurant by ID.
   * @param id - Restaurant ID
   * @returns Void on success
   */
  delete: async (id: string): Promise<void> => {
    return apiFetch<void>(`/restaurants/${id}`, {
      method: "DELETE",
    });
  },
};
