import { apiFetch } from "./clients";
import type { Restaurant } from "./types";

export function getRestaurants(): Promise<Restaurant[]> {
  return apiFetch("/restaurants");
}
