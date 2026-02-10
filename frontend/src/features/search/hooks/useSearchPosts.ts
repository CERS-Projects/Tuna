import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { type PostData } from "@/features/post/types/post";
import { SEARCH_HISTORY_QUERY_KEY } from "./useSearchHistory";

export const useSearchPosts = (keyword: string, selectedIds: Set<number>) => {
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();
  const queryClient = useQueryClient();

  const selectedIdsArray = [...selectedIds].sort();
  const shareRangeKey =
    selectedIdsArray.length === 0 ? "0" : selectedIdsArray.join(",");

  return useQuery<PostData[]>({
    queryKey: ["posts", "search", keyword, shareRangeKey],
    enabled: !!authToken && !!keyword.trim(),
    queryFn: async (): Promise<PostData[]> => {
      const apiParams = new URLSearchParams();

      if (selectedIdsArray.length === 0) {
        apiParams.append("shareRange", "0");
      } else {
        selectedIdsArray.forEach((groupId) => {
          apiParams.append("shareRange", groupId.toString());
        });
      }

      apiParams.append("keyword", keyword);

      const result = await apiWithRefresh<PostData[]>({
        url: `/posts/search?${apiParams.toString()}`,
        options: {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      });

      queryClient.invalidateQueries({
        queryKey: [...SEARCH_HISTORY_QUERY_KEY],
      });

      return result;
    },
    throwOnError: false,
    staleTime: 0,
    retry: false,
  });
};
