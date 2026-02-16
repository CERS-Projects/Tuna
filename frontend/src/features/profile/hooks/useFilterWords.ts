import { useQuery } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { type FilterWords } from "../types/setting";
import { useUser } from "@/features/auth/hooks/useUser";

export const useFilterWords = () => {
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();
  const { data: user } = useUser(authToken);

  return useQuery<FilterWords>({
    queryKey: ["filterWords", user?.userId],
    enabled: !!authToken && !!user,
    queryFn: async (): Promise<FilterWords> => {
      const res = await apiWithRefresh<string[]>({
        url: `/profile/filter-words`,
        options: {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      });

      return { filterWords: res ?? [] };
    },
    refetchOnMount: true,
    throwOnError: false,
  });
};
