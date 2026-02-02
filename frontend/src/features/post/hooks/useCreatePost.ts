import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../api/createPost";
import { type CreatePostRequest } from "../types/post";

type UseCreatePostOptions = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useCreatePost = (options?: UseCreatePostOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostRequest) => createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["timeline"] });

      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
};
