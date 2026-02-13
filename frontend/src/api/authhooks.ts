import { useMutation } from "@tanstack/react-query";
import { login, signup } from "./auth";

export function useLogin() {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
    },
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
    },
  });
}
