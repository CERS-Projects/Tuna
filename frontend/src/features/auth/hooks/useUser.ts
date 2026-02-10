import { useQuery } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { type ProfileData } from "@/features/profile/types/profileTypes";
import { type User } from "@/types/user";
import { decodeUserParams } from "../utils/jwt";

export const useUser = (authToken: string) => {
  const apiWithRefresh = useApiWithRefresh();
  const jwtPayload = authToken ? decodeUserParams(authToken) : null;

  return useQuery({
    queryKey: ["user", jwtPayload?.sub],
    enabled: !!authToken && !!jwtPayload,
    queryFn: async (): Promise<User> => {
      const profile = await apiWithRefresh<ProfileData>({
        url: "/profile/me",
        options: {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        },
      });

      return {
        showUserId: profile.showUserId,
        userName: profile.nickname,
        iconUrl: profile.iconUrl,
        follow: profile.followCount,
        follower: profile.followerCount,
        introduction: profile.introduction,
        role: jwtPayload?.role ?? "STUDENT",
      };
    },
    staleTime: 1000 * 60 * 10,
    retry: false,
  });
};
