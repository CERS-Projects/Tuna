import { useQuery } from "@tanstack/react-query";
import { type PostData } from "../types/post";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const usePost = (postId: string | undefined) => {
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();

  const { data, isFetching, isError, refetch } = useQuery<PostData>({
    queryKey: ["post", postId],
    enabled: !!authToken && !!postId,
    queryFn: async (): Promise<PostData> => {
      const post = await apiWithRefresh<PostData>({
        url: `/posts?postId=${postId}`,
        options: {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        },
      });

      return post;
    },
    refetchOnMount: true,
  });

  return { data, isFetching, isError, refetch };
};
