import { useMutation } from "@tanstack/react-query";
import { login, signup } from "./auth";

/**
 * useLogin hook.
 *
 * Custom React Query mutation hook used to authenticate an existing user.
 * On success, stores the returned JWT access token in localStorage.
 *
 * @returns React Query mutation object with mutate, isPending, and error fields
 *
 * @example
 * const { mutate, isPending, error } = useLogin();
 * mutate({ identifier: "john", password: "secret" }, { onSuccess: () => navigate("/") });
 */
export function useLogin() {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem("token", data.accessToken);
    },
  });
}

/**
 * useSignup hook.
 *
 * Custom React Query mutation hook used to register a new user account.
 * On success, stores the returned JWT access token in localStorage.
 *
 * @returns React Query mutation object with mutate, isPending, and error fields
 *
 * @example
 * const { mutate, isPending, error } = useSignup();
 * mutate({ username: "john", firstName: "John", lastName: "Doe", email: "john@example.com", password: "secret" }, { onSuccess: () => navigate("/") });
 */
export function useSignup() {
  return useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      localStorage.setItem("token", data.accessToken);
    },
  });
}
