import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const useDeletePost = (postId: string | undefined) => {
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!postId) return;

      return await apiWithRefresh<void>({
        url: `/posts/delete?postId=${postId}`,
        options: {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({
        queryKey: ["user", "profile"],
      });
      window.alert("投稿を削除しました");
    },
    onError: () => {
      window.alert("投稿の削除に失敗しました");
    },
  });
};
