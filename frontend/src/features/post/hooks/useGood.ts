import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useDebouncedCallback } from "use-debounce";

type UseGoodOptions = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useGood = (
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
      shareRange.forEach((id) => {
        queryClient.invalidateQueries({ queryKey: ["posts", id.toString()] });
      });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
};

export const useUnGood = (
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
      shareRange.forEach((id) => {
        queryClient.invalidateQueries({ queryKey: ["posts", id.toString()] });
      });
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
  const { mutate: goodMutate } = useGood(postId, shareRange);
  const { mutate: unGoodMutate } = useUnGood(postId, shareRange);

  const debouncedToggle = useDebouncedCallback((isLiked: boolean) => {
    if (isLiked) {
      goodMutate(undefined);
    } else {
      unGoodMutate(undefined);
    }
  }, 1500);

  return { debouncedToggle };
};
