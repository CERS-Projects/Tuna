import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { type GroupCreateType } from "../types/group";
import { decodeUserParams } from "@/features/auth/utils/jwt";

export const useCreateGroup = () => {
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();
  const queryClient = useQueryClient();
  const userInfo = decodeUserParams(authToken);

  return useMutation({
    mutationFn: async (data: GroupCreateType) => {
      return await apiWithRefresh<void>({
        url: "/groups/new",
        options: {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        },
      });
    },
    onSuccess: () => {
      if (userInfo)
        queryClient.invalidateQueries({
          queryKey: ["groups", userInfo?.schoolId, userInfo?.sub],
        });
    },
  });
};
