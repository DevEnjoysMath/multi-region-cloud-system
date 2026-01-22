import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge className inputs with Tailwind-aware conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
