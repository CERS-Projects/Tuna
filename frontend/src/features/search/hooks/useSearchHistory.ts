import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { decodeUserParams } from "@/features/auth/utils/jwt";
import { type SearchHistory } from "../types/search";

export const SEARCH_HISTORY_QUERY_KEY = ["posts", "history"] as const;

export const useSearchHistory = () => {
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();
  const userInfo = decodeUserParams(authToken);

  return useQuery({
    queryKey: [...SEARCH_HISTORY_QUERY_KEY, userInfo?.sub],
    enabled: !!authToken,
    queryFn: async (): Promise<SearchHistory[]> => {
      const history = await apiWithRefresh<SearchHistory[]>({
        url: "/posts/searchhistory",
        options: {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      });

      return history;
    },
    select: (data) =>
      [...data].sort(
        (a, b) =>
          new Date(b.searched_at).getTime() - new Date(a.searched_at).getTime(),
      ),
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: 1000 * 60 * 30,
    retry: false,
    throwOnError: false,
  });
};

export const useDeleteSearchHistory = () => {
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();
  const queryClient = useQueryClient();
  const userInfo = decodeUserParams(authToken);

  return useMutation({
    mutationFn: async ({ query }: { query: string; searchedAt: string }) => {
      if (!query) return;

      const apiParams = new URLSearchParams();
      apiParams.append("keyword", query);

      return await apiWithRefresh<void>({
        url: `/posts/searchhistory?${apiParams.toString()}`,
        options: {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      });
    },
    onMutate: async ({ query, searchedAt }) => {
      const queryKey = [...SEARCH_HISTORY_QUERY_KEY, userInfo?.sub];
      await queryClient.cancelQueries({ queryKey });

      const previousHistory =
        queryClient.getQueryData<SearchHistory[]>(queryKey);

      queryClient.setQueryData<SearchHistory[]>(queryKey, (old) => {
        if (!old) return [];

        let removed = false;
        return old.filter((item) => {
          if (
            !removed &&
            item.query === query &&
            item.searched_at === searchedAt
          ) {
            removed = true;
            return false;
          }
          return true;
        });
      });

      return { previousHistory };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousHistory) {
        const queryKey = [...SEARCH_HISTORY_QUERY_KEY, userInfo?.sub];
        queryClient.setQueryData(queryKey, context.previousHistory);
      }
    },
  });
};
