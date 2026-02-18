import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { decodeUserParams } from "@/features/auth/utils/jwt";
import {
  type StudentAccountEditType,
  type TeacherAccountEditType,
} from "../types/account";

export const useDeleteAccount = () => {
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();
  const queryClient = useQueryClient();
  const userInfo = decodeUserParams(authToken);

  return useMutation({
    mutationFn: async (
      data: StudentAccountEditType | TeacherAccountEditType,
    ) => {
      if ("authority" in data) {
        return await apiWithRefresh<void>({
          url: `/accounts/teacher?userId=${data.userId}`,
          options: {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        });
      } else {
        return await apiWithRefresh<void>({
          url: `/accounts/student?userId=${data.userId}`,
          options: {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        });
      }
    },
    onSuccess: () => {
      if (userInfo)
        queryClient.invalidateQueries({
          queryKey: ["members", userInfo.schoolId],
        });
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
    },
  });
};
