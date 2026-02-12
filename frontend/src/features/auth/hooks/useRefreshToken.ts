import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { type OtpTokenResponse } from "../types/auth";

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: () =>
      api<OtpTokenResponse>({
        url: "/refresh",
        options: {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      }),
  });
};
