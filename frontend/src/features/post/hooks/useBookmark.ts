import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useDebouncedCallback } from "use-debounce";
import { useEffect } from "react";
import { useParams } from "react-router";

type UseBookmarkOptions = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useBookmark = (
  postId: string | undefined,
  shareRange: number[] = [0],
  options?: UseBookmarkOptions,
) => {
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();
  const { showUserId } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!postId) return;

      return await apiWithRefresh<void>({
        url: "/posts/addbookmarks",
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
      queryClient.invalidateQueries({
        queryKey: ["user", "profile", showUserId],
      });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
};

export const useUnBookmarkPost = (
  postId: string | undefined,
  shareRange: number[] = [0],
  options?: UseBookmarkOptions,
) => {
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();
  const { showUserId } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!postId) return;

      return await apiWithRefresh<void>({
        url: `/posts/removebookmarks?postId=${postId}`,
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
      queryClient.invalidateQueries({
        queryKey: ["user", "profile", showUserId],
      });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
};

export const useDebouncedBookmark = (
  postId: string | undefined,
  shareRange: number[] = [0],
) => {
  const { mutate: bookmarkMutate } = useBookmark(postId, shareRange);
  const { mutate: unBookmarkMutate } = useUnBookmarkPost(postId, shareRange);

  const debouncedToggle = useDebouncedCallback((isBookmarked: boolean) => {
    if (isBookmarked) {
      bookmarkMutate(undefined);
    } else {
      unBookmarkMutate(undefined);
    }
  }, 5000);

  useEffect(() => {
    return () => {
      debouncedToggle.flush();
    };
  }, [debouncedToggle]);

  return { debouncedToggle };
};
