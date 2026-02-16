import { useQuery } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useParams } from "react-router";
import { useProfile } from "./useProfile";
import { type FollowData } from "../types/profileTypes";

export const useFollower = () => {
  const { authToken } = useAuth();
  const { data: profile, isMyProfile } = useProfile();
  const apiWithRefresh = useApiWithRefresh();
  const { showUserId } = useParams();

  return useQuery({
    queryKey: ["user", "profile", "follower", showUserId],
    enabled: !!authToken && !!showUserId && !!profile,
    queryFn: async (): Promise<FollowData[]> => {
      if (isMyProfile) {
        const follower = await apiWithRefresh<FollowData[]>({
          url: `/profile/followers/me?targetUserId=${profile?.userId}`,
          options: {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        });

        return follower;
      } else {
        const follower = await apiWithRefresh<FollowData[]>({
          url: `/profile/followers?targetUserId=${profile?.userId}`,
          options: {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        });

        return follower;
      }
    },
    throwOnError: false,
    retry: false,
    refetchOnMount: true,
  });
};
