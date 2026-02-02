import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { createPost } from "../api/createPost";
import { type CreatePostRequest } from "../types/post";
import { paths } from "@/config/paths";

type UseCreatePostOptions = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useCreatePost = (options?: UseCreatePostOptions) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreatePostRequest) => createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["timeline"] });

      options?.onSuccess?.();
      navigate(paths.app.timeline.path);
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
};
