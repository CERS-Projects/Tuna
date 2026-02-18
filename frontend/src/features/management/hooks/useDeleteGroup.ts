import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { type GroupDeleteRequestType } from "../types/group";
import { decodeUserParams } from "@/features/auth/utils/jwt";

export const useDeleteGroup = () => {
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();
  const queryClient = useQueryClient();
  const userInfo = decodeUserParams(authToken);

  return useMutation({
    mutationFn: async (data: GroupDeleteRequestType) => {
      return await apiWithRefresh<void>({
        url: `/groups?groupId=${data.groupId}&parentId=${data.parentId}`,
        options: {
          method: "DELETE",
          headers: {
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
