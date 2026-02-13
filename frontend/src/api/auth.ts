import { apiFetch } from "./clients";

/**
 * Request payload for user login.
 */
export interface LoginRequest {
  /** User email address */
  email: string;
  /** User password */
  password: string;
}

/**
 * Request payload for user registration.
 */
export interface SignupRequest {
  /** User full name */
  name: string;
  /** User email address */
  email: string;
  /** User password */
  password: string;
}

/**
 * Response returned after successful authentication.
 */
export interface AuthResponse {
  /** JWT authentication token */
  token: string;
  /** Authenticated user details */
  user: {
    /** User ID */
    id: string;
    /** User name */
    name: string;
    /** User email address */
    email: string;
  };
}

/**
 * Sends login request to backend authentication endpoint.
 *
 * @param data - Login credentials (email and password)
 * @returns AuthResponse containing JWT token and user data
 */
export const login = (data: LoginRequest) =>
  apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

/**
 * Sends signup request to backend authentication endpoint.
 *
 * @param data - Signup information (name, email, password)
 * @returns AuthResponse containing JWT token and user data
 */
export const signup = (data: SignupRequest) =>
  apiFetch<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
