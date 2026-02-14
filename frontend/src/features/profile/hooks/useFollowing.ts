import { useQuery } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useParams } from "react-router";
import { useProfile } from "./useProfile";
import { type FollowData } from "../types/profileTypes";

export const useFollowing = () => {
  const { authToken } = useAuth();
  const { data: profile, isMyProfile } = useProfile();
  const apiWithRefresh = useApiWithRefresh();
  const { showUserId } = useParams();

  return useQuery({
    queryKey: ["user", "profile", showUserId, "following"],
    enabled: !!authToken && !!showUserId && !!profile,
    queryFn: async (): Promise<FollowData[]> => {
      if (isMyProfile) {
        const following = await apiWithRefresh<FollowData[]>({
          url: `/profile/following/me?targetUserId=${profile?.userId}`,
          options: {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        });
        console.log(following);
        return following;
      } else {
        const following = await apiWithRefresh<FollowData[]>({
          url: `/profile/following?targetUserId=${profile?.userId}`,
          options: {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        });
        console.log(following);
        return following;
      }
    },
    throwOnError: false,
    retry: false,
    refetchOnMount: true,
  });
};
