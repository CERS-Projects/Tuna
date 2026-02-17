import { useQuery } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { type ProfileData } from "@/features/profile/types/profileTypes";
import { type User } from "@/types/user";
import { decodeUserParams } from "@/features/auth/utils/jwt";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useParams } from "react-router";
import { useUser } from "@/features/auth/hooks/useUser";

export const useProfile = () => {
  const { authToken } = useAuth();
  const apiWithRefresh = useApiWithRefresh();
  const jwtPayload = authToken ? decodeUserParams(authToken) : null;
  const { showUserId } = useParams();
  const { data: user } = useUser(authToken);
  const isMyProfile = user?.showUserId === showUserId;

  const query = useQuery({
    queryKey: ["user", "profile", showUserId],
    enabled: !!authToken && !!jwtPayload && !!showUserId && !!user,
    queryFn: async (): Promise<User | ProfileData> => {
      if (isMyProfile) {
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
          userId: profile.userId,
          showUserId: profile.showUserId,
          userName: profile.nickname,
          iconUrl: profile.iconUrl,
          followCount: profile.followCount,
          followerCount: profile.followerCount,
          introduction: profile.introduction,
          role: jwtPayload?.role ?? "STUDENT",
        };
      } else {
        return await apiWithRefresh<ProfileData>({
          url: `/profile?targetShowUserId=${showUserId}`,
          options: {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          },
        });
      }
    },
    staleTime: 1000 * 60 * 10,
    throwOnError: false,
    retry: false,
  });

  return {
    ...query,
    isMyProfile,
  };
};
