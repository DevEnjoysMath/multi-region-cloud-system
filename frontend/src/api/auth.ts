import { apiFetch } from "./clients";

/**
 * Request payload for user login.
 */
export interface LoginRequest {
  /** Username or email address */
  identifier: string;
  /** User password */
  password: string;
}

/**
 * Request payload for user registration.
 */
export interface SignupRequest {
  /** Unique username */
  username: string;
  /** User first name */
  firstName: string;
  /** User last name */
  lastName: string;
  /** User email address */
  email: string;
  /** User password */
  password: string;
}

/**
 * Response returned after successful authentication.
 */
export interface AuthResponse {
  /** JWT access token */
  accessToken: string;
  /** Token type, typically "Bearer" */
  tokenType: string;
  /** Token expiration time in seconds */
  expiresIn: number;
  /** Authenticated user details */
  user: {
    /** User ID */
    id: string;
    /** Username */
    username: string;
    /** User email address */
    email: string;
  };
}

/**
 * Sends a login request to the backend authentication endpoint.
 *
 * @param data - Login credentials containing an identifier (email or username) and password
 * @returns AuthResponse containing the JWT access token and user data
 */
export const login = (data: LoginRequest) =>
  apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

/**
 * Sends a signup request to the backend authentication endpoint.
 *
 * @param data - Registration information including username, name, email, and password
 * @returns AuthResponse containing the JWT access token and user data
 */
export const signup = (data: SignupRequest) =>
  apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
