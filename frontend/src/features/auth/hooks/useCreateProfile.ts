import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { decodeUserParams } from "../utils/jwt";

export const useCreateProfile = (authToken: string) => {
  const apiWithRefresh = useApiWithRefresh();
  const queryClient = useQueryClient();
  const jwtPayload = authToken ? decodeUserParams(authToken) : null;

  return useMutation({
    mutationFn: async () => {
      await apiWithRefresh({
        url: "/profile",
        options: {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", jwtPayload?.sub] });
      alert("プロフィールが作成されていなかったため、作成しました");
    },
    throwOnError: false,
  });
};
