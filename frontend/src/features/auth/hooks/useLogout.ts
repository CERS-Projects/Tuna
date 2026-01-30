import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export const useLogout = () => {
  return useMutation({
    mutationFn: (authToken: string) =>
      api<void>({
        url: "/logout",
        options: {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        },
      }),
  });
};
