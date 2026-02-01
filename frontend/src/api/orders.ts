import { apiFetch } from "./clients";
import type { Order } from "./types";

export function getOrders(): Promise<Order[]> {
  return apiFetch("/orders");
}
