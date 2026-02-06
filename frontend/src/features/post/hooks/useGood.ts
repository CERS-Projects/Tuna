import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useDebouncedCallback } from "use-debounce";

type UseGoodOptions = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useLikePost = (
  postId: string | undefined,
  shareRange: number[] = [0],
  options?: UseGoodOptions,
) => {
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();
  const queryClient = useQueryClient();
  console.log(`post:${postId}, share:${shareRange}`);
  return useMutation({
    mutationFn: async () => {
      if (!postId) return;

      return await apiWithRefresh<void>({
        url: "/posts/addLikes",
        options: {
          method: "POST",
          body: JSON.stringify({ postId }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", shareRange] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
};

export const useUnlikePost = (
  postId: string | undefined,
  shareRange: number[] = [0],
  options?: UseGoodOptions,
) => {
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!postId) return;

      return await apiWithRefresh<void>({
        url: `/posts/removelikes?postId=${postId}`,
        options: {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", shareRange] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
};

export const useDebouncedLike = (
  postId: string | undefined,
  shareRange: number[] = [0],
) => {
  const { mutate: likeMutate } = useLikePost(postId, shareRange);
  const { mutate: unLikeMutate } = useUnlikePost(postId, shareRange);

  const debouncedToggle = useDebouncedCallback((isLiked: boolean) => {
    if (isLiked) {
      likeMutate(undefined);
    } else {
      unLikeMutate(undefined);
    }
  }, 1500);

  return { debouncedToggle };
};
