/**
 * Represents a restaurant entity.
 */
export interface Restaurant {
  /** Unique restaurant ID */
  id: string;

  /** Display name of the restaurant */
  name: string;

  /** Type of cuisine served */
  cuisine: string;

  /** City or physical location */
  location: string;

  /** Geographic region identifier */
  region: string;

  /** Average customer rating */
  rating: number;

  /** Optional restaurant description */
  description?: string;

  /** Optional image URL */
  imageUrl?: string;

  /** ISO timestamp when the restaurant was created */
  createdAt: string;

  /** ISO timestamp when the restaurant was last updated */
  updatedAt: string;
}

/**
 * Represents a customer order.
 */
export interface Order {
  /** Unique order ID */
  id: string;

  /** ID of the restaurant fulfilling the order */
  restaurantId: string;

  /** ID of the customer who placed the order */
  customerId: string;

  /** List of ordered items */
  items: OrderItem[];

  /** Current order status */
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled";

  /** Total monetary value of the order */
  totalAmount: number;

  /** ISO timestamp when the order was created */
  createdAt: string;

  /** ISO timestamp when the order was last updated */
  updatedAt: string;
}

/**
 * Represents an individual item within an order.
 */
export interface OrderItem {
  /** Unique order item ID */
  id: string;

  /** Name of the item */
  name: string;

  /** Quantity ordered */
  quantity: number;

  /** Price per item */
  price: number;
}

/**
 * Represents an API error response.
 */
export interface ApiError {
  /** Human-readable error message */
  message: string;

  /** HTTP status code */
  status: number;

  /** Optional field-level validation errors */
  errors?: Record<string, string[]>;
}

/**
 * Represents a paginated API response.
 * @template T - Type of the returned data
 */
export interface PaginatedResponse<T> {
  /** List of returned items */
  data: T[];

  /** Total number of available items */
  total: number;

  /** Current page number */
  page: number;

  /** Number of items per page */
  pageSize: number;
}
