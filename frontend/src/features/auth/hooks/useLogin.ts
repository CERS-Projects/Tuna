import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { type LoginInfo, type LoginResponse } from "../types/auth";

export const useLogin = () => {
  return useMutation({
    mutationFn: (info: LoginInfo) =>
      api<LoginResponse>({
        url: "/api/login",
        options: {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(info),
        },
      }),
  });
};
