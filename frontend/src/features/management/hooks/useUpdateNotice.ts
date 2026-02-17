import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const useUpdateNotice = () => {
  const { authToken } = useAuth();
  const apiWithRefresh = useApiWithRefresh();
  const queryClient = useQueryClient();

  const updateNoticeMutation = useMutation({
    mutationFn: async (data: {
      noticeId: string;
      title: string;
      content: string;
      groupId: number;
    }) => {
      return await apiWithRefresh<void>({
        url: "/notice/modify",
        options: {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(data),
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
  });

  return {
    updateNotice: updateNoticeMutation.mutateAsync,
    isUpdating: updateNoticeMutation.isPending,
  };
};
