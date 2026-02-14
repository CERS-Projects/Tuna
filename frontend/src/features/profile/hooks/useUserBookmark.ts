import { useQuery } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { type PostData } from "@/features/post/types/post";
import { useParams } from "react-router";

export const useUserBookmark = (userId: number | undefined) => {
  const { authToken } = useAuth();
  const apiWithRefresh = useApiWithRefresh();
  const { showUserId } = useParams();

  return useQuery({
    queryKey: ["user", "profile", "bookmarks", showUserId],
    enabled: !!authToken && !!showUserId && !!userId,
    queryFn: async (): Promise<PostData[]> => {
      const posts = await apiWithRefresh<PostData[]>({
        url: `/posts/bookmarks?targetUserId=${userId}`,
        options: {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      });

      return posts;
    },
    throwOnError: false,
    retry: false,
    refetchOnMount: true,
  });
};
