import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { type LoginResponse } from "../types/auth";

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: () =>
      api<LoginResponse>({
        url: "/refresh",
        options: {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      }),
  });
};
