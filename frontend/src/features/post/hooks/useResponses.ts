import { useQuery } from "@tanstack/react-query";
import { type PostData } from "../types/post";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const useResponses = (postId: string | undefined) => {
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();

  const { data, isFetching, isError, refetch } = useQuery<PostData[]>({
    queryKey: ["posts", "responses", postId],
    enabled: !!authToken && !!postId,
    queryFn: async (): Promise<PostData[]> => {
      const responses = await apiWithRefresh<PostData[]>({
        url: `/posts/responses?replypostId=${postId}`,
        options: {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        },
      });

      return responses;
    },
    refetchOnMount: true,
  });

  return { data, isFetching, isError, refetch };
};
