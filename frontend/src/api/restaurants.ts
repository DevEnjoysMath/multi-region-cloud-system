import { apiFetch } from "./clients";
import type { Restaurant } from "./types";

function isRestaurant(value: any): value is Restaurant {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value
  );
}

export async function getRestaurants(): Promise<Restaurant[]> {
  try {
    const data = await apiFetch<unknown>("/restaurants");

    if (!Array.isArray(data) || !data.every(isRestaurant)) {
      throw new Error("Invalid restaurants response shape");
    }

    return data;
  } catch (error) {
    console.error("getRestaurants failed:", error);
    throw error;
  }
}
