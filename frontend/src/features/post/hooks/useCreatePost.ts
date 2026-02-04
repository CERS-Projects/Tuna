import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type CreatePostRequest } from "../types/post";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";

type UseCreatePostOptions = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useCreatePost = (options?: UseCreatePostOptions) => {
  const queryClient = useQueryClient();
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();

  return useMutation({
    mutationFn: async (data: CreatePostRequest) => {
      const formData = new FormData();

      formData.append("sentence", data.sentence);

      data.shareRange.forEach((id) => {
        formData.append("shareRange", id.toString());
      });

      if (data.imageFile && data.imageFile.length > 0) {
        data.imageFile.forEach((file) => {
          formData.append("imageFile", file, file.name);
        });
      }

      if (data.responseTo) {
        formData.append("responseTo", data.responseTo.toString());
      }

      return await apiWithRefresh<void>({
        url: "/posts",
        options: {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      });
    },
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
