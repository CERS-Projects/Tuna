import { useAuth } from "@/features/auth/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { type GroupFormType } from "../types/group";
import { type ModifyGroupRequestType } from "../types/member";
import { decodeUserParams } from "@/features/auth/utils/jwt";

export const useEditGroup = (groupId: number | null) => {
  const { authToken } = useAuth();
  const userInfo = decodeUserParams(authToken);

  const apiWithRefresh = useApiWithRefresh();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: GroupFormType) => {
      if (!userInfo || !groupId) throw new Error("グループ更新に失敗しました");

      const modifyData: ModifyGroupRequestType = {
        parentGroupId: data.parentGroupId,
        groupName: data.groupName,
        members: data.members.map((m) => ({
          userId: m.userId,
          modifiedIsJoined: m.isJoined,
        })),
      };

      return await apiWithRefresh<void>({
        url: `/groups/${groupId}`,
        options: {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(modifyData),
        },
      });
    },
    onSuccess: () => {
      if (userInfo && groupId) {
        queryClient.invalidateQueries({
          queryKey: ["groups", userInfo.schoolId, userInfo.sub],
        });
        queryClient.invalidateQueries({
          queryKey: ["members", userInfo.schoolId, groupId],
        });
      }
    },
  });
};
