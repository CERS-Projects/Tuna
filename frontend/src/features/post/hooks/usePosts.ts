import { useQuery } from "@tanstack/react-query";
import { type PostData } from "../types/post";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useSearchParams } from "react-router";

export const usePosts = () => {
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("groupId");

  const { data, isFetching, isError, refetch } = useQuery<PostData[]>({
    queryKey: ["posts", groupId ? groupId : "0"],
    enabled: !!authToken,
    queryFn: async (): Promise<PostData[]> => {
      const params = new URLSearchParams();
      if (groupId) {
        params.append("shareRange", groupId);
      } else {
        params.append("shareRange", "0");
      }

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
