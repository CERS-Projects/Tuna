import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { type Notice } from "@/features/management/types/notice";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const useNotices = () => {
  const { authToken } = useAuth();
  const apiWithRefresh = useApiWithRefresh();
  const queryClient = useQueryClient();

  const noticesQuery = useQuery({
    queryKey: ["notices"],
    queryFn: async () => {
      return await apiWithRefresh<Notice[]>({
        url: "/notice/teacher/list",
        options: {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        },
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiWithRefresh<void>({
        url: `/notice/delete?noticeId=${encodeURIComponent(id)}`,
        options: {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
  });

  return {
    notices: noticesQuery.data ? [...noticesQuery.data].reverse() : [],

    isLoading: noticesQuery.isLoading,
    isError: noticesQuery.isError,
    error: noticesQuery.error,

    deleteNotice: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};
