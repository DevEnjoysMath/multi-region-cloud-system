import { useMutation } from "@tanstack/react-query";
import { login, signup } from "./auth";

/**
 * useLogin hook.
 *
 * Custom React Query mutation hook used to
 * authenticate an existing user.
 *
 * Sends login credentials to the backend API.
 *
 * @returns React Query mutation object
 */

export function useLogin() {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
    },
  });
}

/**
 * useSignup hook.
 *
 * Custom React Query mutation hook used to
 * register a new user account.
 *
 * Sends user registration data to the backend
 * authentication API.
 *
 * @returns React Query mutation object
 */

export function useSignup() {
  return useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
    },
  });
}
