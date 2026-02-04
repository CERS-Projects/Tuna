import { useQuery } from "@tanstack/react-query";
import { type PostData } from "../types/post";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const usePosts = (shareRange: number[] = []) => {
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();

  const { data, isFetching, isError, refetch } = useQuery<PostData[]>({
    queryKey: ["posts", shareRange],
    enabled: !!authToken,
    queryFn: async (): Promise<PostData[]> => {
      const range = shareRange.length > 0 ? shareRange : [0];

      const params = new URLSearchParams();
      range.forEach((value) => {
        params.append("shareRange", value.toString());
      });

      const posts = await apiWithRefresh<PostData[]>({
        url: `/posts/timeline?${params.toString()}`,
        options: {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        },
      });

      return posts;
    },
    refetchOnMount: true,
  });

  return { data, isFetching, isError, refetch };
};
